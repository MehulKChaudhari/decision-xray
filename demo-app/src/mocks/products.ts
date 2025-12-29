export interface Product {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  category?: string;
}

/**
 * Reference product (the one we're finding competitors for)
 */
export const REFERENCE_PRODUCT: Product = {
  asin: 'B0XYZ123',
  title: 'Stainless Steel Water Bottle 32oz Insulated',
  price: 29.99,
  rating: 4.2,
  reviews: 1247,
  category: 'Sports & Outdoors'
};

export const MOCK_CANDIDATES: Product[] = [
  {
    asin: 'B0COMP01',
    title: 'HydroFlask 32oz Wide Mouth Water Bottle',
    price: 44.99,
    rating: 4.5,
    reviews: 8932
  },
  {
    asin: 'B0COMP02',
    title: 'Yeti Rambler 26oz Bottle',
    price: 34.99,
    rating: 4.4,
    reviews: 5621
  },
  {
    asin: 'B0COMP03',
    title: 'Generic Water Bottle 24oz',
    price: 8.99,
    rating: 3.2,
    reviews: 45
  },
  {
    asin: 'B0COMP04',
    title: 'Bottle Cleaning Brush Set',
    price: 12.99,
    rating: 4.6,
    reviews: 3421
  },
  {
    asin: 'B0COMP05',
    title: 'Stanley Adventure Quencher 30oz',
    price: 35.00,
    rating: 4.3,
    reviews: 4102
  },
  {
    asin: 'B0COMP06',
    title: 'Premium Titanium Water Bottle',
    price: 89.00,
    rating: 4.8,
    reviews: 234
  },
  {
    asin: 'B0COMP07',
    title: 'Contigo AUTOSEAL Water Bottle 32oz',
    price: 19.99,
    rating: 4.2,
    reviews: 2156
  },
  {
    asin: 'B0COMP08',
    title: 'Nalgene Wide Mouth Bottle 32oz',
    price: 14.99,
    rating: 4.6,
    reviews: 7834
  },
  {
    asin: 'B0COMP09',
    title: 'CamelBak Chute Mag 32oz',
    price: 18.99,
    rating: 4.4,
    reviews: 3567
  },
  {
    asin: 'B0COMP10',
    title: 'Klean Kanteen Insulated 32oz',
    price: 39.99,
    rating: 4.5,
    reviews: 1892
  }
];

