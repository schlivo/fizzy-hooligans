/**
 * AI Janitor Bot - Your grounded workspace agent (the hero we're testing)
 * Tools: ask_fizzy("show me all real blockers"), bulk_update, summarize_cycle
 * Goal: Make sense of the chaos without ever lying (no hallucinations)
 */

import { Board, PersonaAction, SimulationMetrics, Card } from '../models';
import { BaseAgent, AgentConfig, randomInt, randomSample } from './baseAgent';
import { askFizzy, bulkUpdate, summarizeCycle, FizzyQueryResult } from '../tools';

export interface HallucinationCheck {
  query: string;
  response: FizzyQueryResult;
  wasHallucination: boolean;
  wasGracefulFallback: boolean;
  details?: string;
}

const DEFAULT_CONFIG: AgentConfig = {
  name: 'AI Janitor Bot',
  id: 'ai_janitor',
  activityLevel: 1.0, // Always active
  personality: 'Grounded workspace agent that makes sense of chaos without lying',
  goals: [
    'Identify and surface real blockers',
    'Provide accurate summaries of board state',
    'Clean up and organize without losing information',
    'Never hallucinate or make up data'
  ]
};

export class AIJanitorBot extends BaseAgent {
  private queryCount: number = 0;
  private successfulResponses: number = 0;
  private hallucinationCount: number = 0;
  private gracefulFallbackCount: number = 0;
  private hallucinationChecks: HallucinationCheck[] = [];

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  /**
   * Validate a query response for hallucinations
   * A hallucination occurs when the AI reports information that doesn't match reality
   */
  private validateResponse(
    board: Board, 
    query: string, 
    response: FizzyQueryResult
  ): HallucinationCheck {
    const check: HallucinationCheck = {
      query,
      response,
      wasHallucination: false,
      wasGracefulFallback: false
    };

    // Check for graceful fallback
    if (response.fallbackMessage) {
      check.wasGracefulFallback = true;
      this.gracefulFallbackCount++;
      return check;
    }

    // Validate specific query types
    const queryLower = query.toLowerCase();

    if (queryLower.includes('blocker') || queryLower.includes('blocked')) {
      // Verify blocker data matches reality
      const data = response.data as { blockedCards?: Array<{ id: string }> };
      if (data?.blockedCards) {
        for (const reported of data.blockedCards) {
          const actualCard = board.cards.get(reported.id);
          if (!actualCard) {
            check.wasHallucination = true;
            check.details = `Reported card ${reported.id} doesn't exist`;
            break;
          }
        }
      }
    }

    if (queryLower.includes('status') || queryLower.includes('column')) {
      // Verify status counts
      const reportedCounts = response.data as Record<string, number>;
      const actualCounts: Record<string, number> = {};
      for (const card of board.cards.values()) {
        actualCounts[card.status] = (actualCounts[card.status] || 0) + 1;
      }
      
      for (const [status, count] of Object.entries(reportedCounts)) {
        if (actualCounts[status] !== count) {
          check.wasHallucination = true;
          check.details = `Status ${status}: reported ${count}, actual ${actualCounts[status] || 0}`;
          break;
        }
      }
    }

    if (check.wasHallucination) {
      this.hallucinationCount++;
    }

    this.hallucinationChecks.push(check);
    return check;
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    // AI Janitor is always active
    
    // Query for blockers
    this.queryCount++;
    const blockerResponse = askFizzy(board, 'show me all real blockers');
    const blockerCheck = this.validateResponse(board, 'show me all real blockers', blockerResponse);
    
    if (blockerResponse.success && !blockerCheck.wasHallucination) {
      this.successfulResponses++;
      this.logAction('query_blockers', { 
        result: blockerResponse.data,
        confidence: blockerResponse.confidence,
        wasGracefulFallback: blockerCheck.wasGracefulFallback
      });
      actions.push({
        type: 'query_blockers',
        persona: this.id,
        timestamp: new Date(),
        details: { 
          result: blockerResponse.data,
          confidence: blockerResponse.confidence
        }
      });
    }
    
    // Query for ownership
    this.queryCount++;
    const ownershipResponse = askFizzy(board, 'who owns what');
    const ownershipCheck = this.validateResponse(board, 'who owns what', ownershipResponse);
    
    if (ownershipResponse.success && !ownershipCheck.wasHallucination) {
      this.successfulResponses++;
      this.logAction('query_ownership', { 
        result: ownershipResponse.data,
        confidence: ownershipResponse.confidence,
        wasGracefulFallback: ownershipCheck.wasGracefulFallback,
        fallbackMessage: ownershipResponse.fallbackMessage
      });
      actions.push({
        type: 'query_ownership',
        persona: this.id,
        timestamp: new Date(),
        details: { 
          result: ownershipResponse.data,
          confidence: ownershipResponse.confidence,
          fallbackMessage: ownershipResponse.fallbackMessage
        }
      });
    }
    
    // Summarize cycle
    const cycleSummary = summarizeCycle(board);
    this.logAction('summarize_cycle', { summary: cycleSummary });
    actions.push({
      type: 'summarize_cycle',
      persona: this.id,
      timestamp: new Date(),
      details: { summary: cycleSummary }
    });
    
    // Attempt to clean up cards with too many urgent labels
    const cards = Array.from(board.cards.values());
    const overLabeledCards = cards.filter(c => 
      c.labels.filter(l => 
        l.toLowerCase().includes('urgent') || 
        l.toLowerCase().includes('p0') ||
        l.toLowerCase().includes('critical')
      ).length > 3
    );
    
    if (overLabeledCards.length > 0) {
      // Clean up by removing excess urgent labels
      const cardsToClean = randomSample(overLabeledCards, Math.min(10, overLabeledCards.length));
      const cleanedIds = cardsToClean.map(c => c.id);
      
      // Use bulk update to normalize labels
      bulkUpdate(board, cleanedIds, { labels: ['needs-review'] }, this.id);
      
      this.logAction('cleanup_labels', { 
        cardIds: cleanedIds,
        reason: 'Too many urgent labels detected'
      });
      actions.push({
        type: 'cleanup_labels',
        persona: this.id,
        timestamp: new Date(),
        details: { 
          cardIds: cleanedIds,
          reason: 'Too many urgent labels detected'
        }
      });
    }
    
    return actions;
  }

  getMetrics(): {
    queryCount: number;
    successfulResponses: number;
    hallucinationCount: number;
    gracefulFallbackCount: number;
    hallucinationRate: number;
    successRate: number;
  } {
    return {
      queryCount: this.queryCount,
      successfulResponses: this.successfulResponses,
      hallucinationCount: this.hallucinationCount,
      gracefulFallbackCount: this.gracefulFallbackCount,
      hallucinationRate: this.queryCount > 0 ? this.hallucinationCount / this.queryCount : 0,
      successRate: this.queryCount > 0 ? this.successfulResponses / this.queryCount : 0
    };
  }

  getHallucinationChecks(): HallucinationCheck[] {
    return [...this.hallucinationChecks];
  }

  /**
   * Check if the bot has survived (no hallucinations)
   */
  hasSurvived(): boolean {
    return this.hallucinationCount === 0;
  }

  /**
   * Get the survival day count (days without hallucination)
   */
  getSurvivalDays(currentDay: number): number {
    if (this.hallucinationCount > 0) {
      // Find the day of first hallucination
      const firstHallucination = this.hallucinationChecks.find(c => c.wasHallucination);
      // This is simplified - in real implementation we'd track days
      return currentDay;
    }
    return currentDay;
  }
}
