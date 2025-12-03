/**
 * Overworked Sarah - Senior dev, perfectionist, hates blockers
 * Tools: move_card, add_comment, set_due_date, create_blocker_link
 * Chaos: Leaves 47 "Still waiting on design…" comments, moves things to Stuck 8×/day
 */

import { Board, PersonaAction, Card } from '../models';
import { BaseAgent, AgentConfig, randomChoice, randomInt, randomSample } from './baseAgent';
import { moveCard, addComment, setDueDate, createBlockerLink } from '../tools';

const SARAH_COMMENTS = [
  "Still waiting on design…",
  "Still waiting on design feedback",
  "Still waiting on design review",
  "@maya when can we expect the mockups?",
  "This has been blocked for {days} days now",
  "Moving to Stuck until we get clarity on requirements",
  "I've asked about this 3 times already",
  "Can someone please unblock this?",
  "We need to address the blockers before we can proceed",
  "This is holding up the entire sprint",
  "Bumping this - still no response",
  "Following up again on this blocker",
  "This needs attention ASAP",
  "Waiting on API team to provide endpoint",
  "Blocked by security review",
  "Can't proceed without database schema finalized"
];

const DEFAULT_CONFIG: AgentConfig = {
  name: 'Overworked Sarah',
  id: 'sarah',
  activityLevel: 0.95, // Very active
  personality: 'Senior dev, perfectionist, hates blockers',
  goals: [
    'Identify and document blockers',
    'Keep cards moving through the pipeline',
    'Ensure nothing falls through the cracks'
  ]
};

export class OverworkedSarah extends BaseAgent {
  private consecutiveBlockerDays: number = 0;

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    if (!this.shouldAct()) {
      return actions;
    }

    const cards = Array.from(board.cards.values());
    
    // Find cards that are potentially blocked (in progress for too long, no recent updates)
    const inProgressCards = cards.filter(c => 
      c.status === 'In Progress' || c.status === 'Review'
    );
    
    // Move cards to Stuck (up to 8 times per day)
    const moveToStuckCount = randomInt(3, 8);
    const cardsToMove = randomSample(inProgressCards, moveToStuckCount);
    
    for (const card of cardsToMove) {
      if (card.status !== 'Stuck') {
        moveCard(board, card.id, 'Stuck', this.id);
        this.logAction('move_card', { cardId: card.id, to: 'Stuck' }, card.id);
        actions.push({
          type: 'move_card',
          persona: this.id,
          timestamp: new Date(),
          details: { cardId: card.id, to: 'Stuck' },
          cardId: card.id
        });
      }
    }
    
    // Add "Still waiting on design…" comments
    const commentCount = randomInt(5, 15);
    const cardsToComment = randomSample(
      cards.filter(c => c.status === 'Stuck' || c.status === 'In Progress'),
      commentCount
    );
    
    for (const card of cardsToComment) {
      let comment = randomChoice(SARAH_COMMENTS);
      comment = comment.replace('{days}', String(randomInt(3, 45)));
      
      addComment(board, card.id, this.id, this.name, comment);
      this.logAction('add_comment', { cardId: card.id, comment }, card.id);
      actions.push({
        type: 'add_comment',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, comment },
        cardId: card.id
      });
    }
    
    // Set due dates on cards without them
    const cardsWithoutDueDate = cards.filter(c => 
      !c.dueDate && (c.status === 'In Progress' || c.status === 'Todo')
    );
    const dueDateCount = randomInt(2, 5);
    const cardsToSetDueDate = randomSample(cardsWithoutDueDate, dueDateCount);
    
    for (const card of cardsToSetDueDate) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + randomInt(3, 14));
      
      setDueDate(board, card.id, dueDate, this.id);
      this.logAction('set_due_date', { cardId: card.id, dueDate: dueDate.toISOString() }, card.id);
      actions.push({
        type: 'set_due_date',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, dueDate: dueDate.toISOString() },
        cardId: card.id
      });
    }
    
    // Create blocker links
    const blockerLinkCount = randomInt(1, 4);
    for (let i = 0; i < blockerLinkCount; i++) {
      const blockedCard = randomChoice(cards.filter(c => c.status === 'Stuck'));
      const blockingCard = randomChoice(cards.filter(c => c.id !== blockedCard?.id));
      
      if (blockedCard && blockingCard) {
        createBlockerLink(board, blockedCard.id, blockingCard.id, this.id, 'Waiting on this to complete');
        this.logAction('create_blocker_link', { 
          blockedCardId: blockedCard.id, 
          blockingCardId: blockingCard.id 
        }, blockedCard.id);
        actions.push({
          type: 'create_blocker_link',
          persona: this.id,
          timestamp: new Date(),
          details: { blockedCardId: blockedCard.id, blockingCardId: blockingCard.id },
          cardId: blockedCard.id
        });
      }
    }
    
    this.consecutiveBlockerDays++;
    
    return actions;
  }
}
