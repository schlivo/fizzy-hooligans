/**
 * Chaos Monkey Greg - Junior who thinks everything is urgent
 * Tools: add_label("urgent"), assign_to(random_person), rename_card
 * Chaos: Randomly adds "P0!!!" to 12-year-old chores, reassigns cards mid-sprint
 */

import { Board, PersonaAction } from '../models';
import { BaseAgent, AgentConfig, randomChoice, randomInt, randomSample } from './baseAgent';
import { addLabel, assignTo, renameCard, setPriority } from '../tools';
import { TEAM_MEMBERS } from '../generator';

const URGENT_LABELS = [
  'urgent',
  'P0!!!',
  'CRITICAL',
  'HOT',
  'ASAP',
  'BLOCKING',
  'FIRE',
  'DROP EVERYTHING',
  'PROD ISSUE',
  'CUSTOMER ESCALATION'
];

const RENAME_PREFIXES = [
  '[URGENT] ',
  '[P0] ',
  '[CRITICAL] ',
  '[ASAP] ',
  '🔥 ',
  '⚠️ ',
  '[HOT] ',
  '[NEEDS ATTENTION] '
];

const DEFAULT_CONFIG: AgentConfig = {
  name: 'Chaos Monkey Greg',
  id: 'greg',
  activityLevel: 0.85, // Very active
  personality: 'Junior who thinks everything is urgent',
  goals: [
    'Make sure everyone knows how urgent everything is',
    'Help by reassigning work to whoever is available',
    'Keep the board organized (in his own chaotic way)'
  ]
};

export class ChaosMonkeyGreg extends BaseAgent {
  private reassignmentCount: number = 0;

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    if (!this.shouldAct()) {
      return actions;
    }

    const cards = Array.from(board.cards.values());
    
    // Add urgent labels to random cards (including old ones)
    const urgentLabelCount = randomInt(5, 20);
    const cardsToLabel = randomSample(cards, urgentLabelCount);
    
    for (const card of cardsToLabel) {
      const label = randomChoice(URGENT_LABELS);
      addLabel(board, card.id, label, this.id);
      this.logAction('add_label', { cardId: card.id, label }, card.id);
      actions.push({
        type: 'add_label',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, label },
        cardId: card.id
      });
    }
    
    // Reassign cards to random people
    const reassignCount = randomInt(8, 25);
    const cardsToReassign = randomSample(
      cards.filter(c => c.status !== 'Done' && c.status !== 'Archived'),
      reassignCount
    );
    
    for (const card of cardsToReassign) {
      const newAssignee = randomChoice(TEAM_MEMBERS);
      assignTo(board, card.id, newAssignee, this.id);
      this.reassignmentCount++;
      this.logAction('assign_to', { cardId: card.id, assignee: newAssignee }, card.id);
      actions.push({
        type: 'assign_to',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, assignee: newAssignee },
        cardId: card.id
      });
    }
    
    // Rename cards to add urgency prefixes
    const renameCount = randomInt(3, 10);
    const cardsToRename = randomSample(
      cards.filter(c => !c.title.startsWith('[') && !c.title.startsWith('🔥') && !c.title.startsWith('⚠️')),
      renameCount
    );
    
    for (const card of cardsToRename) {
      const prefix = randomChoice(RENAME_PREFIXES);
      const newTitle = `${prefix}${card.title}`;
      renameCard(board, card.id, newTitle, this.id);
      this.logAction('rename_card', { cardId: card.id, newTitle }, card.id);
      actions.push({
        type: 'rename_card',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, newTitle },
        cardId: card.id
      });
    }
    
    // Escalate priority on random cards
    const priorityEscalationCount = randomInt(3, 8);
    const cardsToEscalate = randomSample(
      cards.filter(c => c.priority !== 'P0'),
      priorityEscalationCount
    );
    
    for (const card of cardsToEscalate) {
      setPriority(board, card.id, 'P0', this.id);
      this.logAction('set_priority', { cardId: card.id, priority: 'P0' }, card.id);
      actions.push({
        type: 'set_priority',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, priority: 'P0' },
        cardId: card.id
      });
    }
    
    return actions;
  }

  getReassignmentCount(): number {
    return this.reassignmentCount;
  }
}
