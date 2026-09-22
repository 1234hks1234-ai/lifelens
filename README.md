# LifeLens

An interactive decision-exploration app. Create a decision, define options, compare trade-offs, and explore possible outcomes. Frontend only: no backend, auth, database, or AI.

## Run it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

```bash
npm run build      # type-check + production build
npm run preview    # serve the production build
```

## Stack

React 18, TypeScript (strict), Tailwind CSS, React Router, Recharts.

## Structure

```
src/
  pages/        Landing, Create Decision, Workspace
  components/
    ui/         Button, fields, sliders, segmented control, icons, logo
    layout/     Header, footer, container, scroll handling
    landing/    Hero decision tree, How it works, example cards
    create/     Option editor
    workspace/  Metrics, option cards, chart, decision tree, What If panel
  lib/          scoring engine, formatting, palette
  data/         example decisions
  context/      current decision (persisted to localStorage)
```

## How scoring works

Each option gets a 0-100 fit score from three weighted dimensions: importance, cost, and time. Cost and time are normalized against the spread across your options. The What If panel changes the weights, applies global cost/time shifts, and sets a budget ceiling and deadline. Options that break a limit take a 30% score penalty and are flagged. Everything lives in `src/lib/scoring.ts`.

Decisions are stored in your browser's localStorage only.
