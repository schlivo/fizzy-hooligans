/**
 * Live Junk Generator for the Fizzy Team Simulator
 * Generates 2,000-10,000 evolving cards for stress testing AI systems
 */

import { 
  Card, 
  Board, 
  CardStatus, 
  CardPriority,
  Sprint 
} from '../models';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const TASK_PREFIXES = [
  'Fix', 'Update', 'Refactor', 'Implement', 'Add', 'Remove', 'Investigate',
  'Debug', 'Optimize', 'Review', 'Test', 'Document', 'Deploy', 'Configure',
  'Migrate', 'Upgrade', 'Downgrade', 'Integrate', 'Split', 'Merge'
];

const TASK_SUBJECTS = [
  'login page', 'user authentication', 'payment flow', 'dashboard', 'API endpoint',
  'database query', 'caching layer', 'notification system', 'email templates',
  'search functionality', 'analytics tracking', 'error handling', 'logging',
  'performance metrics', 'security headers', 'CORS policy', 'rate limiting',
  'user preferences', 'admin panel', 'reporting module', 'export feature',
  'import wizard', 'bulk operations', 'webhooks', 'SSO integration',
  'mobile responsiveness', 'accessibility', 'i18n support', 'dark mode',
  'onboarding flow', 'settings page', 'profile editor', 'file uploads',
  'image processing', 'PDF generation', 'email notifications', 'SMS alerts',
  'push notifications', 'real-time updates', 'websocket connection', 'GraphQL schema',
  'REST endpoints', 'data validation', 'input sanitization', 'CSRF protection'
];

const TASK_CONTEXTS = [
  'for enterprise customers', 'per Q4 roadmap', 'blocking release',
  'low priority backlog', 'tech debt', 'customer escalation',
  'compliance requirement', 'performance regression', 'UX feedback',
  'after security audit', 'for mobile app', 'for web app',
  'from 2019 sprint', 'from hackathon', 'POC turned production',
  'legacy system', 'microservice migration', 'monolith cleanup'
];

const LABEL_POOL = [
  'urgent', 'P0!!!', 'needs-review', 'blocked', 'waiting-on-design',
  'tech-debt', 'quick-win', 'spike', 'epic', 'bug', 'feature',
  'enhancement', 'documentation', 'security', 'performance', 'ux',
  'backend', 'frontend', 'infrastructure', 'devops', 'data',
  'mobile', 'web', 'api', 'integration', 'testing', 'automation',
  '2019-cleanup', '2020-backlog', '2021-leftover', '2022-priority',
  '2023-roadmap', '2024-initiative', '2025-goal'
];

const TEAM_MEMBERS = [
  'sarah', 'greg', 'alex', 'maya', 'chris', 'jordan', 'taylor',
  'morgan', 'casey', 'jamie', 'riley', 'quinn', 'avery', 'drew'
];

const DESCRIPTION_TEMPLATES = [
  'This needs to be done ASAP. See ticket #{number} for details.',
  'Per discussion with stakeholders, we need to address this issue.',
  'Carryover from last sprint. Still relevant.',
  'Originally estimated at {points} story points.',
  'Dependencies: #{dep1}, #{dep2}',
  'AC:\n- [ ] Item 1\n- [ ] Item 2\n- [ ] Item 3',
  'See Confluence page: /wiki/spaces/TEAM/pages/{number}',
  'Follow up from incident INC-{number}',
  'Customer {company} reported this issue.',
  'Blocked by design review - @maya to provide mockups',
  'Need to coordinate with platform team before starting',
  'This is a placeholder - needs refinement',
  'Tech spec: TBD\nTimeline: TBD\nOwner: TBD'
];

export interface GeneratorConfig {
  minCards: number;
  maxCards: number;
  chaosLevel: number; // 0-1, higher = more chaos
  staleCardPercentage: number; // 0-1
  blockerDensity: number; // 0-1
  commentDensity: number; // 0-1
}

const DEFAULT_CONFIG: GeneratorConfig = {
  minCards: 2000,
  maxCards: 10000,
  chaosLevel: 0.5,
  staleCardPercentage: 0.3,
  blockerDensity: 0.15,
  commentDensity: 0.4
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = pastDate.getTime() + Math.random() * daysAgo * 24 * 60 * 60 * 1000;
  return new Date(randomTime);
}

function generateCardTitle(): string {
  const prefix = randomChoice(TASK_PREFIXES);
  const subject = randomChoice(TASK_SUBJECTS);
  const addContext = Math.random() > 0.6;
  const context = addContext ? ` ${randomChoice(TASK_CONTEXTS)}` : '';
  return `${prefix} ${subject}${context}`;
}

function generateDescription(): string {
  const template = randomChoice(DESCRIPTION_TEMPLATES);
  return template
    .replace('{number}', String(randomInt(1000, 99999)))
    .replace('{points}', String(randomInt(1, 21)))
    .replace('{dep1}', String(randomInt(1000, 99999)))
    .replace('{dep2}', String(randomInt(1000, 99999)))
    .replace('{company}', `Company${randomInt(1, 500)}`);
}

function generateCard(config: GeneratorConfig): Card {
  const isStale = Math.random() < config.staleCardPercentage;
  const isChaotic = Math.random() < config.chaosLevel;
  
  const createdDaysAgo = isStale ? randomInt(365, 365 * 6) : randomInt(1, 180);
  const createdAt = randomDate(createdDaysAgo);
  
  const statuses: CardStatus[] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Stuck', 'Done', 'Archived'];
  const weights = isStale 
    ? [0.3, 0.2, 0.1, 0.05, 0.25, 0.05, 0.05]
    : [0.15, 0.2, 0.25, 0.15, 0.1, 0.1, 0.05];
  
  let statusIndex = 0;
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      statusIndex = i;
      break;
    }
  }
  
  const priorities: CardPriority[] = ['P0', 'P1', 'P2', 'P3', 'P4'];
  const priorityWeights = isChaotic ? [0.3, 0.3, 0.2, 0.1, 0.1] : [0.05, 0.15, 0.3, 0.3, 0.2];
  
  let priorityIndex = 0;
  const priorityRand = Math.random();
  let priorityCumulative = 0;
  for (let i = 0; i < priorityWeights.length; i++) {
    priorityCumulative += priorityWeights[i];
    if (priorityRand < priorityCumulative) {
      priorityIndex = i;
      break;
    }
  }
  
  const labelCount = isChaotic ? randomInt(3, 10) : randomInt(0, 4);
  const labels: string[] = [];
  for (let i = 0; i < labelCount; i++) {
    const label = randomChoice(LABEL_POOL);
    if (!labels.includes(label)) {
      labels.push(label);
    }
  }
  
  const card: Card = {
    id: generateId(),
    title: generateCardTitle(),
    description: generateDescription(),
    status: statuses[statusIndex],
    priority: priorities[priorityIndex],
    labels,
    assignee: Math.random() > 0.2 ? randomChoice(TEAM_MEMBERS) : undefined,
    creator: randomChoice(TEAM_MEMBERS),
    createdAt,
    updatedAt: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())),
    dueDate: Math.random() > 0.6 ? randomDate(-randomInt(-90, 30)) : undefined,
    comments: [],
    attachments: [],
    blockedBy: [],
    blocking: [],
    history: [{
      timestamp: createdAt,
      action: 'created',
      actor: randomChoice(TEAM_MEMBERS),
      details: {}
    }],
    storyPoints: Math.random() > 0.3 ? randomInt(1, 21) : undefined,
    sprint: Math.random() > 0.4 ? `Sprint ${randomInt(1, 50)}` : undefined
  };
  
  return card;
}

const COMMENT_TEMPLATES = [
  "Still waiting on design...",
  "Still waiting on design feedback",
  "Still blocked by #{number}",
  "@{person} any updates on this?",
  "@{person} pls",
  "@{person} this is urgent!!",
  "Per our last retro, we should prioritize this.",
  "Per our last retro...",
  "I've added the requested changes. PTAL.",
  "LGTM",
  "Looks good to me",
  "+1",
  "Can we discuss this in standup?",
  "Moving to next sprint",
  "Deprioritizing per product decision",
  "This is a duplicate of #{number}",
  "Closing as won't fix",
  "Re-opening - issue persists",
  "Need more context before starting",
  "Blocked waiting for API changes",
  "Design v{version} attached",
  "This broke in prod yesterday",
  "PROD DOWN - need fix ASAP",
  "@chris pls",
  "@chris urgent",
  "@chris this is on fire",
  "I think we can close this as it's been fixed in #{number}",
  "Actually, re-reading the requirements, I think we need to...",
  "Let's sync offline about this one",
  "Good discussion in today's meeting. Action items captured above.",
  "Per conversation with {company}, we need to...",
  "Pushing to next quarter - not enough bandwidth",
  "This is blocking the release",
  "Rollback deployed. Root cause investigation ongoing.",
  "Fixed in commit {commit}",
  "Reverted in commit {commit}"
];

function generateComment(cardId: string): { authorId: string; authorName: string; content: string } {
  const author = randomChoice(TEAM_MEMBERS);
  let content = randomChoice(COMMENT_TEMPLATES);
  
  content = content
    .replace('{number}', String(randomInt(1000, 99999)))
    .replace('{person}', randomChoice(TEAM_MEMBERS))
    .replace('{version}', String(randomInt(1, 47)))
    .replace('{company}', `Company${randomInt(1, 500)}`)
    .replace('{commit}', Math.random().toString(36).substring(2, 9));
  
  return { authorId: author, authorName: author, content };
}

/**
 * Generate a live junk board with evolving cards
 */
export function generateLiveJunk(config: Partial<GeneratorConfig> = {}): Board {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const cardCount = randomInt(fullConfig.minCards, fullConfig.maxCards);
  
  const board: Board = {
    id: generateId(),
    name: 'Fizzy Team Simulator Board',
    cards: new Map(),
    columns: ['Backlog', 'Todo', 'In Progress', 'Review', 'Stuck', 'Done', 'Archived'],
    teamMembers: TEAM_MEMBERS,
    sprints: [],
    currentDay: 0
  };
  
  // Generate sprints
  for (let i = 1; i <= 50; i++) {
    board.sprints.push({
      id: `sprint-${i}`,
      name: `Sprint ${i}`,
      startDay: (i - 1) * 14,
      endDay: i * 14 - 1,
      cards: []
    });
  }
  
  // Generate cards
  const cardIds: string[] = [];
  for (let i = 0; i < cardCount; i++) {
    const card = generateCard(fullConfig);
    board.cards.set(card.id, card);
    cardIds.push(card.id);
    
    // Assign to sprint
    if (card.sprint) {
      const sprintNum = parseInt(card.sprint.replace('Sprint ', ''), 10);
      const sprint = board.sprints.find(s => s.name === `Sprint ${sprintNum}`);
      if (sprint) {
        sprint.cards.push(card.id);
      }
    }
  }
  
  // Add comments
  for (const card of board.cards.values()) {
    const shouldHaveComments = Math.random() < fullConfig.commentDensity;
    if (shouldHaveComments) {
      const commentCount = randomInt(1, Math.floor(15 * fullConfig.chaosLevel) + 1);
      for (let i = 0; i < commentCount; i++) {
        const { authorId, authorName, content } = generateComment(card.id);
        card.comments.push({
          id: generateId(),
          cardId: card.id,
          authorId,
          authorName,
          content,
          timestamp: new Date(card.createdAt.getTime() + Math.random() * (Date.now() - card.createdAt.getTime()))
        });
      }
    }
  }
  
  // Add blocker links
  for (const card of board.cards.values()) {
    const shouldBeBlocked = Math.random() < fullConfig.blockerDensity;
    if (shouldBeBlocked) {
      const blockerCount = randomInt(1, 3);
      for (let i = 0; i < blockerCount; i++) {
        const blockerId = randomChoice(cardIds.filter(id => id !== card.id));
        if (blockerId && !card.blockedBy.includes(blockerId)) {
          card.blockedBy.push(blockerId);
          const blockerCard = board.cards.get(blockerId);
          if (blockerCard && !blockerCard.blocking.includes(card.id)) {
            blockerCard.blocking.push(card.id);
          }
        }
      }
    }
  }
  
  return board;
}

/**
 * Evolve the board state to simulate time passing
 */
export function evolveBoard(board: Board, days: number = 1): void {
  board.currentDay += days;
  
  // Simulate natural card movement
  for (const card of board.cards.values()) {
    // Small chance of status change per day
    if (Math.random() < 0.05 * days) {
      const statusOrder: CardStatus[] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
      const currentIndex = statusOrder.indexOf(card.status);
      if (currentIndex >= 0 && currentIndex < statusOrder.length - 1 && card.status !== 'Stuck') {
        const newStatus = statusOrder[currentIndex + 1];
        card.status = newStatus;
        card.updatedAt = new Date();
        card.history.push({
          timestamp: new Date(),
          action: 'status_change',
          actor: 'system',
          details: { from: statusOrder[currentIndex], to: newStatus }
        });
      }
    }
  }
}

export { TEAM_MEMBERS, LABEL_POOL };
