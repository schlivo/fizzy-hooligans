/**
 * Base Agent class for agentic personas
 */

import { Board, PersonaAction } from '../models';

export interface AgentConfig {
  name: string;
  id: string;
  activityLevel: number; // 0-1, probability of acting each day
  personality: string;
  goals: string[];
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected actionLog: PersonaAction[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
  }

  get name(): string {
    return this.config.name;
  }

  get id(): string {
    return this.config.id;
  }

  get personality(): string {
    return this.config.personality;
  }

  get goals(): string[] {
    return this.config.goals;
  }

  get activityLevel(): number {
    return this.config.activityLevel;
  }

  getActionLog(): PersonaAction[] {
    return [...this.actionLog];
  }

  protected logAction(type: string, details: Record<string, unknown>, cardId?: string): void {
    this.actionLog.push({
      type,
      persona: this.config.id,
      timestamp: new Date(),
      details,
      cardId
    });
  }

  /**
   * Determine if the agent should act this day based on activity level
   */
  shouldAct(): boolean {
    return Math.random() < this.config.activityLevel;
  }

  /**
   * Execute the agent's actions for the day
   */
  abstract act(board: Board, currentDay: number): PersonaAction[];
}

/**
 * Helper to pick random items from an array
 */
export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fisher-Yates shuffle algorithm for uniform random sampling
 */
export function randomSample<T>(arr: T[], count: number): T[] {
  const result = [...arr];
  const n = result.length;
  const sampleSize = Math.min(count, n);
  
  // Fisher-Yates shuffle (partial, only shuffle as many as we need)
  for (let i = 0; i < sampleSize; i++) {
    const j = i + Math.floor(Math.random() * (n - i));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result.slice(0, sampleSize);
}
