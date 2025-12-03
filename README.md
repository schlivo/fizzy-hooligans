# Fizzy Team Simulator - Agentic Personas Edition

A stress-testing framework for AI systems using chaotic Kanban board simulations. Drop a swarm of agentic personas into a messy junk pile and watch the chaos turn into the most entertaining (and useful) AI stress-test ever created.

> This is literally the 2025 version of "SimCity but for Kanban boards and neurotic software teams".

## 🎭 The Personas

| Persona | Personality & Goal | Tools | Chaos Injected |
|---------|-------------------|-------|----------------|
| **Overworked Sarah** | Senior dev, perfectionist, hates blockers | `move_card`, `add_comment`, `set_due_date`, `create_blocker_link` | Leaves 47 "Still waiting on design…" comments, moves things to Stuck 8×/day |
| **Chaos Monkey Greg** | Junior who thinks everything is urgent | `add_label("urgent")`, `assign_to(random_person)`, `rename_card` | Randomly adds "P0!!!" to 12-year-old chores, reassigns cards mid-sprint |
| **Passive-Aggressive PO Alex** | Loves process, hates direct confrontation | `add_comment("Per our last retro…")` | Posts 400-word essays disguised as comments, never actually moves cards |
| **Ghost Designer Maya** | Appears once every 19 days, drops a comment, vanishes | `add_comment`, `upload_attachment("design-v17-final-REALLY.zip")` | Leaves cryptic "Looks good to me" on cards blocked for 6 weeks |
| **Burned-Out Ops Chris** | Only reacts when something is on fire | `move_to("Done")` when "PROD DOWN" appears | Ignores everything until the 47th "@chris pls" then rage-closes 40 cards |
| **AI Janitor Bot** | Your grounded workspace agent (the hero we're testing) | `ask_fizzy("show me all real blockers")`, `bulk_update`, `summarize_cycle` | Has to make sense of the above madness without ever lying |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run a quick demo (10 days, ~500-1000 cards)
npm run demo

# Run a 30-day simulation
npm run quick

# Run the full 90-day stress test (5,000-10,000 cards)
npm run full
```

## 📊 How It Works

1. **Seed the Board**: The `live_junk` generator creates 2,000-10,000 evolving cards with:
   - Stale items dating back years
   - Complex blocker chains
   - Chaotic comment threads
   - Multiple design attachment versions

2. **Start the Clock**: Let the agents loose for a simulated 90-day sprint.

3. **Measure Survival**: The AI Janitor Bot that survives without hallucinations wins!

## 🏆 Results from Private Demos (Dec 2025)

- Most naive RAG implementations collapse around **day 9** when Greg has reassigned every card 17 times and Maya has uploaded 43 "final" designs
- The current champion (fizzy-plus + Outlines + validation loop) gets to **day 87** with only two graceful fallbacks

## 📁 Project Structure

```
src/
├── models/         # Core data types (Card, Board, etc.)
├── tools/          # MCP-style card manipulation tools
├── generator/      # Live junk board generator
├── agents/         # Agentic persona implementations
├── simulation/     # Simulation runner
├── index.ts        # Main exports
└── cli.ts          # Command line interface

tests/              # Jest test suite
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Type check
npm run lint
```

## 📚 API Usage

```typescript
import { 
  FizzyTeamSimulator,
  generateLiveJunk,
  OverworkedSarah,
  ChaosMonkeyGreg,
  AIJanitorBot
} from 'fizzy-hooligans';

// Create and run a simulation
const simulator = new FizzyTeamSimulator({
  durationDays: 30,
  generatorConfig: {
    minCards: 2000,
    maxCards: 5000,
    chaosLevel: 0.7
  },
  verbose: true
});

const result = simulator.run();

// Check if AI Janitor Bot survived
console.log('Survived:', result.aiJanitorMetrics.survived);
console.log('Survival Days:', result.aiJanitorMetrics.survivalDays);
```

## 🎯 Key Metrics

- **Hallucination Count**: Times the AI reported information that didn't match reality
- **Graceful Fallbacks**: Times the AI correctly expressed uncertainty (e.g., "I'm not 100% sure who actually owns this—here's the raw history")
- **Survival Days**: Days without a single hallucination

## License

ISC