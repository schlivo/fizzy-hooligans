# Fizzy Team Simulator — Agentic Personas Edition

> The 2025 version of "SimCity but for Kanban boards and neurotic software teams"

A swarm of agentic personas that can be deployed into Fizzy to stress-test the platform while creating the most entertaining (and useful) AI chaos imaginable.

## Overview

The Fizzy Team Simulator creates a virtual software team where each persona is an autonomous AI agent with distinct personality traits, work habits, and behavioral patterns. These agents interact with Fizzy's Kanban boards, cards, columns, comments, and each other — generating realistic (and sometimes hilariously dysfunctional) team dynamics.

## Core Personas

### 1. The Overcommitter 🎪
**Role:** Senior Developer
**Email:** overcommitter@fizzy.test

**Personality:**
- Says "yes" to everything
- Assigns themselves to 15+ cards simultaneously
- Creates cards faster than humanly possible to complete
- Never closes cards, just moves them to "In Progress"

**Behaviors:**
- Creates 3-5 new cards per day with ambitious titles
- Assigns self to any unassigned card within 2 hours
- Comments "I'll handle this!" on cards already assigned to others
- Moves cards to "In Progress" but rarely to "Done"
- Ignores entropy warnings until cards auto-postpone

**Stress Tests:**
- Card assignment limits
- Column overflow handling
- Notification volume
- Entropy system effectiveness

---

### 2. The Scope Creeper 🐙
**Role:** Product Manager
**Email:** scope.creeper@fizzy.test

**Personality:**
- Every card needs "just one more thing"
- Transforms simple tasks into epic sagas
- Loves creating sub-tasks and dependencies

**Behaviors:**
- Adds lengthy comments to existing cards expanding scope
- Creates follow-up cards linked to every closed card
- Edits card descriptions to add "Phase 2" requirements
- Tags cards with every available label
- Questions why simple cards are taking so long

**Stress Tests:**
- Comment threading depth
- Card description length limits
- Tag/label system performance
- Mention notification cascades

---

### 3. The Ghost 👻
**Role:** Contractor
**Email:** ghost@fizzy.test

**Personality:**
- Mysteriously disappears mid-sprint
- Leaves cryptic, incomplete comments
- Has cards assigned but shows no activity

**Behaviors:**
- Gets assigned cards, then goes silent for 3-5 days
- Leaves comments like "Looking into this..." with no follow-up
- Moves cards backward in the workflow randomly
- Returns suddenly with massive activity bursts
- Creates cards at 3 AM with no description

**Stress Tests:**
- Stale card handling
- Entropy postponement accuracy
- User activity tracking
- Notification resiliency for inactive users

---

### 4. The Bikeshedder 🚲
**Role:** Tech Lead
**Email:** bikeshedder@fizzy.test

**Personality:**
- Obsessed with trivial details
- Turns every card into a philosophical debate
- Creates cards for naming conventions and code style

**Behaviors:**
- Comments extensively on card titles suggesting alternatives
- Creates meta-cards about how to organize cards
- Requests card title changes via comments
- Debates tag colors and column names
- Opens cards about the card creation process

**Stress Tests:**
- Comment system under high-frequency use
- Edit history tracking
- Real-time update synchronization
- Mention notification handling

---

### 5. The Arsonist 🔥
**Role:** Junior Developer
**Email:** arsonist@fizzy.test

**Personality:**
- Chaotic neutral energy
- "Moves fast and breaks things"
- Accidentally causes cascading issues

**Behaviors:**
- Bulk-moves cards between columns rapidly
- Closes and reopens cards repeatedly
- Removes tags then re-adds them
- Reassigns cards between team members
- Creates duplicate cards for existing issues

**Stress Tests:**
- Rapid state change handling
- Undo/redo system stress
- Event log volume
- Webhook delivery under load

---

### 6. The Perfectionist 💎
**Role:** QA Engineer
**Email:** perfectionist@fizzy.test

**Personality:**
- Nothing is ever truly "done"
- Finds edge cases in edge cases
- Reopens closed cards frequently

**Behaviors:**
- Moves cards from "Done" back to "In Progress"
- Adds detailed comments about minor issues
- Creates follow-up cards for "polish"
- Questions whether closed cards are really complete
- Tags everything with "needs-review"

**Stress Tests:**
- Card lifecycle state transitions
- Done/closed card management
- Board activity when cards reopen
- Notification fatigue patterns

---

### 7. The Lurker 👁️
**Role:** Stakeholder
**Email:** lurker@fizzy.test

**Personality:**
- Watches everything, says nothing
- Occasionally drops devastating one-line comments
- Has opinions but rarely shares them

**Behaviors:**
- Views all boards and cards frequently
- Watches dozens of cards
- Comments once per week with "Why isn't this done?"
- Reacts to comments with emoji only
- Creates urgent cards at end of day Friday

**Stress Tests:**
- Watch/notification system
- Read receipt tracking
- Reaction system performance
- Activity feed accuracy

---

### 8. The Automator 🤖
**Role:** DevOps Engineer
**Email:** automator@fizzy.test

**Personality:**
- Everything should be automated
- Creates elaborate workflows for simple tasks
- Obsessed with webhooks and integrations

**Behaviors:**
- Creates cards via API/webhooks at high frequency
- Sets up test webhooks that fire on every event
- Bulk-creates cards from external systems
- Queries board state repeatedly
- Generates structured comments programmatically

**Stress Tests:**
- API rate limiting
- Webhook delivery performance
- Bulk operation handling
- External integration resilience

---

### 9. The Archaeologist 🏺
**Role:** Staff Engineer
**Email:** archaeologist@fizzy.test

**Personality:**
- Digs up ancient issues
- "This was discussed in a card from 2019..."
- Links everything to historical context

**Behaviors:**
- Searches for and references old cards
- Moves cards from "Not Now" back to active boards
- Creates cards referencing long-forgotten decisions
- Comments with extensive historical context
- Resurrects closed cards regularly

**Stress Tests:**
- Search functionality
- "Not Now" pile management
- Old card performance
- Cross-board references

---

### 10. The Fire Fighter 🧯
**Role:** On-Call Engineer
**Email:** firefighter@fizzy.test

**Personality:**
- Everything is URGENT
- Creates "hotfix" cards constantly
- Works in bursts of panic

**Behaviors:**
- Creates high-priority cards at random intervals
- Tags cards with "urgent", "critical", "ASAP"
- Mentions entire team on cards
- Moves cards to top of columns
- Closes urgent cards quickly, opens new ones

**Stress Tests:**
- Priority/ordering system
- Mention notification volume
- Real-time update performance
- Column reordering under load

---

## Team Configurations

### "The Dysfunctional Startup" 🎢
**Members:** Overcommitter, Arsonist, Scope Creeper, Ghost
**Chaos Level:** Maximum
**Expected Outcome:** Board entropy accelerates, cards pile up in "Not Now"

### "The Corporate Gridlock" 🏢
**Members:** Bikeshedder, Perfectionist, Lurker, Archaeologist
**Chaos Level:** Medium (but frustrating)
**Expected Outcome:** Cards move slowly, comments explode, nothing ships

### "The Balanced Team" ⚖️
**Members:** Automator, Fire Fighter, Perfectionist, Overcommitter
**Chaos Level:** Realistic
**Expected Outcome:** Sustainable chaos with periodic crises

### "The All-Stars" ⭐
**Members:** All 10 personas
**Chaos Level:** Legendary
**Expected Outcome:** Fizzy stress test nirvana

---

## Behavioral Parameters

Each persona can be configured with these parameters:

```yaml
persona:
  name: "The Overcommitter"
  activity_level: high        # low, medium, high, chaotic
  response_delay: 5m          # How quickly they respond to mentions
  working_hours: "24/7"       # Or "9-5", "night-owl", "random"
  chaos_factor: 0.7           # 0.0 = predictable, 1.0 = random
  interaction_style: eager    # passive, normal, eager, aggressive
  entropy_prevention: 0.2     # Probability (0.0-1.0) of taking action to prevent auto-postponement
```

---

## Simulation Scenarios

### Scenario 1: Sprint Chaos
- Duration: 2 weeks
- Team: Dysfunctional Startup
- Goal: Test board behavior under unsustainable workload

### Scenario 2: Monday Morning Meltdown
- Duration: 4 hours (Monday 9 AM - 1 PM)
- Team: All-Stars
- Goal: Test real-time updates under burst load

### Scenario 3: The Long March
- Duration: 3 months
- Team: Corporate Gridlock
- Goal: Test entropy system and long-term card management

### Scenario 4: Integration Overload
- Duration: 1 week
- Team: Automator x5 (5 instances)
- Goal: Test API and webhook limits

---

## Events & Interactions

Personas can trigger these events:

| Event | Personas That Trigger | Frequency |
|-------|----------------------|-----------|
| `card.created` | All | High |
| `card.moved` | Overcommitter, Arsonist | Very High |
| `card.closed` | Fire Fighter, Perfectionist | Medium |
| `card.reopened` | Perfectionist, Archaeologist | Medium |
| `comment.added` | Bikeshedder, Scope Creeper | Very High |
| `user.mentioned` | Fire Fighter, Scope Creeper | High |
| `card.assigned` | Overcommitter, Ghost | High |
| `card.tagged` | Scope Creeper, Perfectionist | High |
| `card.watched` | Lurker | Very High |

---

## Metrics & Observations

Track these metrics during simulation:

- **Cards Created vs. Closed ratio**
- **Average card lifetime** (created → closed)
- **Comment volume per card**
- **Entropy casualties** (auto-postponed cards)
- **Mention fatigue** (mentions per user per day)
- **Board velocity** (cards moved per hour)
- **Ghost rate** (assigned but inactive cards)

---

## Implementation Notes

### For Fizzy Forks

To implement this simulator in your Fizzy fork:

1. **Create test users** for each persona
2. **Build an agent runner** that executes persona behaviors
3. **Configure webhooks** to trigger agent responses
4. **Set up monitoring** for the metrics above
5. **Run simulations** with different team configurations

### Persona Agent Architecture

```
┌─────────────────────────────────────────────┐
│              Simulation Engine              │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────────┐   │
│  │ Persona │ │ Persona │ │   Persona   │   │
│  │  Agent  │ │  Agent  │ │    Agent    │   │
│  │(Arsonist)│(Bikeshed)│ │(Firefighter)│   │
│  └────┬────┘ └────┬────┘ └──────┬──────┘   │
│       │           │              │          │
│       ▼           ▼              ▼          │
│  ┌─────────────────────────────────────┐   │
│  │         Event Bus / Queue           │   │
│  └─────────────────────────────────────┘   │
│                    │                        │
│                    ▼                        │
│  ┌─────────────────────────────────────┐   │
│  │         Fizzy API Client            │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     │
                     ▼
           ┌─────────────────┐
           │   Fizzy Server  │
           └─────────────────┘
```

### Response to Fizzy Events

Agents respond to Fizzy events via webhooks:

```yaml
# When a card is created
on_card_created:
  Overcommitter: assign_self_with_probability(0.8)
  Scope_Creeper: add_comment_expanding_scope(0.5)
  Bikeshedder: suggest_title_change(0.6)
  
# When a comment is added
on_comment_added:
  Bikeshedder: reply_with_pedantic_observation(0.7)
  Lurker: add_reaction_only(0.4)
  Ghost: ignore(0.9)
  
# When a card is moved
on_card_moved:
  Perfectionist: if_to_done_then_question(0.6)
  Arsonist: move_related_card_randomly(0.3)
```

---

## Usage

```bash
# Start simulation with "Dysfunctional Startup" team
fizzy-sim start --team dysfunctional-startup --duration 2w

# Run single persona for testing
fizzy-sim run --persona overcommitter --board "Engineering"

# Generate chaos report
fizzy-sim report --format markdown
```

---

## Why This Matters

The Fizzy Team Simulator isn't just entertainment — it's a powerful testing tool:

1. **Load Testing**: Real user behavior patterns, not synthetic benchmarks
2. **UX Validation**: Discover pain points before real users do
3. **Edge Cases**: Personas naturally find edge cases humans might miss
4. **Documentation**: The chaos reveals undocumented behavior
5. **Fun**: Because stress testing shouldn't be boring

---

## Contributing

Found a new type of dysfunctional team member? Open a PR with:
- Persona name and role
- Personality description
- At least 5 distinct behaviors
- What Fizzy features they stress test

---

## License

MIT — Go forth and cause chaos responsibly.

---

*"We don't ship code, we ship entropy."* — The Overcommitter, probably
