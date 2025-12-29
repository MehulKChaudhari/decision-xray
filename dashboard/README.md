# Dashboard

React dashboard for visualizing Decision X-Ray execution traces.

## Setup

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:5173`

Backend must be running on `http://localhost:3000`

## Structure

```
src/
├── pages/              # Page components
├── components/         # UI components
│   ├── execution/     # Domain-specific
│   └── ui/            # Reusable
├── services/          # API client
└── types.ts           # TypeScript types
```

## Features

- Run workflow with one click
- Real-time execution list
- Expandable step-by-step trace
- Pass/fail evaluation visualization

## Stack

- React + TypeScript
- Vite
- Tailwind CSS

## License

MIT
