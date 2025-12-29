# Demo App

Backend demonstration of Decision X-Ray SDK with a 4-step competitor selection workflow.

## Setup

**1. Build SDK first**
```bash
cd ../decision-xray
npm install && npm run build
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Configure database**
- Create PostgreSQL database
- Run `src/db/schema.sql`
- Set credentials in `src/config/local.ts`

**4. Run**
```bash
pnpm dev
```

Server runs on `http://localhost:3000`

## API

**Run workflow**
```bash
POST /api/executions/run
Content-Type: application/json

{
  "referenceProduct": {
    "asin": "B0XYZ123",
    "title": "Stainless Steel Water Bottle 32oz",
    "price": 29.99,
    "rating": 4.2,
    "reviews": 1247
  }
}
```

**List executions**
```bash
GET /api/executions
```

**Get execution details**
```bash
GET /api/executions/:id
```

## Workflow

1. Generate keywords (mock LLM)
2. Search candidates (mock API)
3. Apply filters (price, rating, reviews)
4. Rank and select best match

Each step captures detailed reasoning and evaluations using the SDK.

## License

MIT
