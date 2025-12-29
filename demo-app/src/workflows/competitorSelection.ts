import {
  createExecution,
  recordStep,
  completeExecution,
  createEvaluation,
  createFilterResult,
  Execution,
  Step
} from 'decision-xray';
import { saveExecution, saveStep } from '../db/repository';
import { Product, MOCK_CANDIDATES } from '../mocks/products';

export const runCompetitorSelection = async (
  referenceProduct: Product
): Promise<{ execution: Execution; steps: Step[] }> => {
  const execution = createExecution({
    name: 'Competitor Product Selection',
    description: `Find best competitor for: ${referenceProduct.title}`,
    metadata: { referenceAsin: referenceProduct.asin }
  });

  await saveExecution(execution);

  const steps: Step[] = [];

  try {
    const step1 = await stepGenerateKeywords(execution.id, referenceProduct);
    await saveStep(step1);
    steps.push(step1);

    const keywords = step1.output.keywords as string[];
    const step2 = await stepSearchCandidates(execution.id, keywords[0]);
    await saveStep(step2);
    steps.push(step2);

    const candidates = step2.output.candidates as Product[];
    const step3 = await stepApplyFilters(execution.id, referenceProduct, candidates);
    await saveStep(step3);
    steps.push(step3);

    const qualifiedCandidates = step3.output.qualified_candidates as Product[];
    const step4 = await stepRankAndSelect(execution.id, referenceProduct, qualifiedCandidates);
    await saveStep(step4);
    steps.push(step4);

    const completedExecution = completeExecution(execution, {
      status: 'completed',
      metadata: { selectedCompetitor: step4.output.selected_competitor }
    });

    await saveExecution(completedExecution);

    return { execution: completedExecution, steps };
  } catch (error) {
    const failedExecution = completeExecution(execution, {
      status: 'failed',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    await saveExecution(failedExecution);
    throw error;
  }
};

const stepGenerateKeywords = async (
  executionId: string,
  product: Product
): Promise<Step> => {
  const startTime = Date.now();
  const keywords = generateMockKeywords(product);

  return recordStep({
    executionId,
    name: 'Generate Keywords',
    stepType: 'keyword_generation',
    input: {
      product_title: product.title,
      category: product.category || 'Unknown'
    },
    output: {
      keywords,
      model: 'gpt-4-mock',
      tokens_used: 150
    },
    reasoning: `Extracted key product attributes from title. Generated ${keywords.length} keyword variations.`,
    durationMs: Date.now() - startTime
  });
};

const stepSearchCandidates = async (
  executionId: string,
  keyword: string
): Promise<Step> => {
  const startTime = Date.now();
  const candidates = generateMockCandidates();
  const totalResults = 2847;

  return recordStep({
    executionId,
    name: 'Search Candidates',
    stepType: 'candidate_search',
    input: { keyword, limit: 50 },
    output: {
      total_results: totalResults,
      candidates_fetched: candidates.length,
      candidates
    },
    reasoning: `Fetched top ${candidates.length} results by relevance; ${totalResults} total matches found.`,
    durationMs: Date.now() - startTime
  });
};

const stepApplyFilters = async (
  executionId: string,
  referenceProduct: Product,
  candidates: Product[]
): Promise<Step> => {
  const startTime = Date.now();

  const priceMin = referenceProduct.price * 0.5;
  const priceMax = referenceProduct.price * 2.0;
  const minRating = 3.8;
  const minReviews = 100;

  const evaluations = candidates.map(candidate => {
    const filters = [
      createFilterResult(
        'price_range',
        candidate.price >= priceMin && candidate.price <= priceMax,
        candidate.price >= priceMin && candidate.price <= priceMax
          ? `$${candidate.price.toFixed(2)} is within $${priceMin.toFixed(2)}-$${priceMax.toFixed(2)}`
          : candidate.price < priceMin
          ? `$${candidate.price.toFixed(2)} is below minimum $${priceMin.toFixed(2)}`
          : `$${candidate.price.toFixed(2)} is above maximum $${priceMax.toFixed(2)}`,
        candidate.price,
        { min: priceMin, max: priceMax }
      ),
      createFilterResult(
        'min_rating',
        candidate.rating >= minRating,
        candidate.rating >= minRating
          ? `${candidate.rating.toFixed(1)}★ >= ${minRating}★ threshold`
          : `${candidate.rating.toFixed(1)}★ < ${minRating}★ threshold`,
        candidate.rating,
        minRating
      ),
      createFilterResult(
        'min_reviews',
        candidate.reviews >= minReviews,
        candidate.reviews >= minReviews
          ? `${candidate.reviews} >= ${minReviews} minimum`
          : `${candidate.reviews} < ${minReviews} minimum`,
        candidate.reviews,
        minReviews
      )
    ];

    const passed = filters.every(f => f.passed);

    return createEvaluation(candidate.asin, candidate.title, passed, {
      filters,
      metadata: {
        price: candidate.price,
        rating: candidate.rating,
        reviews: candidate.reviews
      }
    });
  });

  const qualifiedCandidates = candidates.filter((_, idx) => evaluations[idx].passed);

  return recordStep({
    executionId,
    name: 'Apply Filters',
    stepType: 'apply_filters',
    input: {
      candidates_count: candidates.length,
      reference_product: {
        asin: referenceProduct.asin,
        title: referenceProduct.title,
        price: referenceProduct.price,
        rating: referenceProduct.rating,
        reviews: referenceProduct.reviews
      }
    },
    output: {
      total_evaluated: candidates.length,
      passed: qualifiedCandidates.length,
      failed: candidates.length - qualifiedCandidates.length,
      qualified_candidates: qualifiedCandidates
    },
    reasoning: `Applied price range (${priceMin.toFixed(2)}-${priceMax.toFixed(2)}), rating (>=${minRating}), and review count (>=${minReviews}) filters.`,
    evaluations,
    durationMs: Date.now() - startTime,
    metadata: {
      filters_applied: {
        price_range: { min: priceMin, max: priceMax, rule: '0.5x - 2x of reference price' },
        min_rating: { value: minRating, rule: 'Must be at least 3.8 stars' },
        min_reviews: { value: minReviews, rule: 'Must have at least 100 reviews' }
      }
    }
  });
};

const stepRankAndSelect = async (
  executionId: string,
  referenceProduct: Product,
  candidates: Product[]
): Promise<Step> => {
  const startTime = Date.now();

  const rankedCandidates = candidates.map(candidate => {
    const maxReviews = Math.max(...candidates.map(c => c.reviews));
    const reviewScore = candidate.reviews / maxReviews;
    const ratingScore = candidate.rating / 5.0;
    const priceDiff = Math.abs(candidate.price - referenceProduct.price);
    const maxPriceDiff = referenceProduct.price;
    const priceScore = 1 - (priceDiff / maxPriceDiff);

    const totalScore = reviewScore * 0.5 + ratingScore * 0.3 + priceScore * 0.2;

    return {
      ...candidate,
      scores: {
        review_count_score: reviewScore,
        rating_score: ratingScore,
        price_proximity_score: priceScore,
        total_score: totalScore
      }
    };
  }).sort((a, b) => b.scores.total_score - a.scores.total_score);

  const selected = rankedCandidates[0];

  return recordStep({
    executionId,
    name: 'Rank and Select',
    stepType: 'rank_and_select',
    input: {
      candidates_count: candidates.length,
      reference_product: {
        asin: referenceProduct.asin,
        title: referenceProduct.title,
        price: referenceProduct.price,
        rating: referenceProduct.rating,
        reviews: referenceProduct.reviews
      }
    },
    output: {
      ranked_candidates: rankedCandidates.map((c, idx) => ({
        rank: idx + 1,
        asin: c.asin,
        title: c.title,
        price: c.price,
        rating: c.rating,
        reviews: c.reviews,
        scores: c.scores
      })),
      selected_competitor: {
        asin: selected.asin,
        title: selected.title,
        price: selected.price,
        rating: selected.rating,
        reviews: selected.reviews
      }
    },
    reasoning: `Ranked ${candidates.length} candidates using weighted scoring: review count (50%), rating (30%), price proximity (20%). Selected "${selected.title}" with highest score.`,
    durationMs: Date.now() - startTime,
    metadata: {
      ranking_criteria: {
        primary: 'review_count',
        secondary: 'rating',
        tertiary: 'price_proximity',
        weights: { reviews: 0.5, rating: 0.3, price: 0.2 }
      }
    }
  });
};

const generateMockKeywords = (product: Product): string[] => {
  const words = product.title.toLowerCase().split(' ').filter(w => w.length > 3);
  return [
    words.slice(0, 3).join(' '),
    words.slice(0, 4).join(' ')
  ];
};

const generateMockCandidates = (): Product[] => {
  return MOCK_CANDIDATES;
};
