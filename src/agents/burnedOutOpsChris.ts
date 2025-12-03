/**
 * Burned-Out Ops Chris - Only reacts when something is on fire
 * Tools: move_to("Done") when someone screams "PROD DOWN" in a comment
 * Chaos: Ignores everything until the 47th "@chris pls" then rage-closes 40 cards
 */

import { Board, PersonaAction } from '../models';
import { BaseAgent, AgentConfig, randomInt, randomSample, randomChoice } from './baseAgent';
import { moveCard, addComment } from '../tools';

const FIRE_KEYWORDS = [
  'PROD DOWN',
  'prod down',
  'production down',
  'PRODUCTION DOWN',
  'outage',
  'OUTAGE',
  'incident',
  'INCIDENT',
  'critical',
  'CRITICAL',
  'on fire',
  'ON FIRE',
  'emergency',
  'EMERGENCY',
  '🔥',
  'P0',
  'SEV1',
  'SEV-1'
];

const CHRIS_PING_PATTERNS = [
  '@chris',
  '@Chris',
  'chris pls',
  'Chris pls',
  '@chris pls',
  'chris please',
  'chris help',
  '@chris urgent'
];

const RAGE_CLOSE_COMMENTS = [
  "Done.",
  "Fixed.",
  "Closed.",
  "Handled.",
  "This is done now.",
  "Finally done.",
  "Moving on.",
  "Next.",
  "Resolved.",
  "Just deployed the fix.",
  "Should be working now.",
  "Try again.",
  "Check now."
];

const DEFAULT_CONFIG: AgentConfig = {
  name: 'Burned-Out Ops Chris',
  id: 'chris',
  activityLevel: 0.2, // Usually inactive
  personality: 'Only reacts when something is on fire',
  goals: [
    'Keep production running',
    'Address emergencies',
    'Eventually catch up on the backlog (when motivated)'
  ]
};

export class BurnedOutOpsChris extends BaseAgent {
  private pingCount: number = 0;
  private consecutiveIgnoreDays: number = 0;
  private rageModeTriggered: boolean = false;

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  private countChrisPings(board: Board): number {
    let count = 0;
    for (const card of board.cards.values()) {
      for (const comment of card.comments) {
        for (const pattern of CHRIS_PING_PATTERNS) {
          if (comment.content.includes(pattern)) {
            count++;
          }
        }
      }
    }
    return count;
  }

  private findFireCards(board: Board): string[] {
    const fireCards: string[] = [];
    
    for (const card of board.cards.values()) {
      const isOnFire = card.comments.some(comment =>
        FIRE_KEYWORDS.some(keyword => comment.content.includes(keyword))
      ) || card.labels.some(label =>
        FIRE_KEYWORDS.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      if (isOnFire && card.status !== 'Done' && card.status !== 'Archived') {
        fireCards.push(card.id);
      }
    }
    
    return fireCards;
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    this.consecutiveIgnoreDays++;
    this.pingCount = this.countChrisPings(board);
    
    const fireCards = this.findFireCards(board);
    
    // Check if rage mode should be triggered
    if (this.pingCount >= 47 || this.consecutiveIgnoreDays >= 30) {
      this.rageModeTriggered = true;
    }
    
    // If nothing is on fire and not in rage mode, ignore everything
    if (fireCards.length === 0 && !this.rageModeTriggered) {
      return actions;
    }
    
    // Handle fire cards first
    for (const cardId of fireCards) {
      moveCard(board, cardId, 'Done', this.id);
      addComment(board, cardId, this.id, this.name, 'Fixed. Deployed hotfix.');
      this.logAction('emergency_fix', { cardId }, cardId);
      actions.push({
        type: 'emergency_fix',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId },
        cardId
      });
    }
    
    // Rage mode: close up to 40 random cards
    if (this.rageModeTriggered) {
      const cards = Array.from(board.cards.values());
      const closableCards = cards.filter(c => 
        c.status !== 'Done' && c.status !== 'Archived'
      );
      
      const rageCloseCount = Math.min(randomInt(30, 40), closableCards.length);
      const cardsToRageClose = randomSample(closableCards, rageCloseCount);
      
      for (const card of cardsToRageClose) {
        moveCard(board, card.id, 'Done', this.id);
        
        const comment = randomChoice(RAGE_CLOSE_COMMENTS);
        addComment(board, card.id, this.id, this.name, comment);
        
        this.logAction('rage_close', { cardId: card.id }, card.id);
        actions.push({
          type: 'rage_close',
          persona: this.id,
          timestamp: new Date(),
          details: { cardId: card.id },
          cardId: card.id
        });
      }
      
      // Reset rage mode
      this.rageModeTriggered = false;
      this.consecutiveIgnoreDays = 0;
      this.pingCount = 0;
    }
    
    return actions;
  }

  getPingCount(): number {
    return this.pingCount;
  }

  isInRageMode(): boolean {
    return this.rageModeTriggered;
  }
}
