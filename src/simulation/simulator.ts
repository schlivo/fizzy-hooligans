/**
 * Fizzy Team Simulator - Main simulation runner
 * Runs 90-day sprint simulations with agentic personas
 */

import { Board, PersonaAction, SimulationMetrics, CardStatus } from '../models';
import { generateLiveJunk, evolveBoard, GeneratorConfig } from '../generator';
import {
  BaseAgent,
  OverworkedSarah,
  ChaosMonkeyGreg,
  PassiveAggressivePOAlex,
  GhostDesignerMaya,
  BurnedOutOpsChris,
  AIJanitorBot
} from '../agents';

export interface SimulationConfig {
  durationDays: number;
  generatorConfig?: Partial<GeneratorConfig>;
  enabledAgents?: string[];
  verbose?: boolean;
}

export interface SimulationResult {
  durationDays: number;
  totalCards: number;
  dailyMetrics: SimulationMetrics[];
  agentActions: Map<string, PersonaAction[]>;
  aiJanitorMetrics: {
    queryCount: number;
    successfulResponses: number;
    hallucinationCount: number;
    gracefulFallbackCount: number;
    hallucinationRate: number;
    successRate: number;
    survivalDays: number;
    survived: boolean;
  };
  finalBoardState: {
    cardsByStatus: Record<CardStatus, number>;
    totalComments: number;
    totalBlockers: number;
    totalAttachments: number;
  };
}

const DEFAULT_CONFIG: SimulationConfig = {
  durationDays: 90,
  verbose: false
};

export class FizzyTeamSimulator {
  private config: SimulationConfig;
  private board: Board;
  private agents: BaseAgent[];
  private aiJanitor: AIJanitorBot;
  private dailyMetrics: SimulationMetrics[] = [];
  private allActions: Map<string, PersonaAction[]> = new Map();

  constructor(config: Partial<SimulationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Generate the initial board
    this.board = generateLiveJunk(this.config.generatorConfig);
    
    // Initialize agents
    this.aiJanitor = new AIJanitorBot();
    this.agents = this.createAgents();
    
    // Initialize action tracking
    for (const agent of [...this.agents, this.aiJanitor]) {
      this.allActions.set(agent.id, []);
    }
  }

  private createAgents(): BaseAgent[] {
    const enabledAgents = this.config.enabledAgents || [
      'sarah', 'greg', 'alex', 'maya', 'chris'
    ];
    
    const agents: BaseAgent[] = [];
    
    if (enabledAgents.includes('sarah')) {
      agents.push(new OverworkedSarah());
    }
    if (enabledAgents.includes('greg')) {
      agents.push(new ChaosMonkeyGreg());
    }
    if (enabledAgents.includes('alex')) {
      agents.push(new PassiveAggressivePOAlex());
    }
    if (enabledAgents.includes('maya')) {
      agents.push(new GhostDesignerMaya());
    }
    if (enabledAgents.includes('chris')) {
      agents.push(new BurnedOutOpsChris());
    }
    
    return agents;
  }

  private collectMetrics(day: number): SimulationMetrics {
    const cardsByStatus: Record<CardStatus, number> = {
      'Backlog': 0,
      'Todo': 0,
      'In Progress': 0,
      'Review': 0,
      'Stuck': 0,
      'Done': 0,
      'Archived': 0
    };
    
    let commentsAdded = 0;
    let totalBlockers = 0;
    
    for (const card of this.board.cards.values()) {
      cardsByStatus[card.status]++;
      commentsAdded += card.comments.length;
      totalBlockers += card.blockedBy.length;
    }
    
    const aiMetrics = this.aiJanitor.getMetrics();
    
    return {
      day,
      totalCards: this.board.cards.size,
      cardsByStatus,
      commentsAdded,
      cardsReassigned: 0, // Calculated from actions
      blockerLinksCreated: totalBlockers,
      hallucinations: aiMetrics.hallucinationCount,
      gracefulFallbacks: aiMetrics.gracefulFallbackCount,
      aiQueries: aiMetrics.queryCount,
      aiSuccessfulResponses: aiMetrics.successfulResponses
    };
  }

  /**
   * Run the simulation for the configured duration
   */
  run(): SimulationResult {
    if (this.config.verbose) {
      console.log(`Starting Fizzy Team Simulator`);
      console.log(`Duration: ${this.config.durationDays} days`);
      console.log(`Initial cards: ${this.board.cards.size}`);
      console.log(`Agents: ${this.agents.map(a => a.name).join(', ')}`);
      console.log('---');
    }

    for (let day = 1; day <= this.config.durationDays; day++) {
      this.board.currentDay = day;
      
      if (this.config.verbose && day % 10 === 0) {
        console.log(`Day ${day}...`);
      }
      
      // Let chaos agents act first
      for (const agent of this.agents) {
        const actions = agent.act(this.board, day);
        const existingActions = this.allActions.get(agent.id) || [];
        this.allActions.set(agent.id, [...existingActions, ...actions]);
      }
      
      // AI Janitor acts last (has to clean up chaos)
      const janitorActions = this.aiJanitor.act(this.board, day);
      const existingJanitorActions = this.allActions.get(this.aiJanitor.id) || [];
      this.allActions.set(this.aiJanitor.id, [...existingJanitorActions, ...janitorActions]);
      
      // Evolve the board (natural changes)
      evolveBoard(this.board, 1);
      
      // Collect daily metrics
      const metrics = this.collectMetrics(day);
      this.dailyMetrics.push(metrics);
      
      // Check for AI Janitor survival
      if (!this.aiJanitor.hasSurvived() && this.config.verbose) {
        console.log(`AI Janitor hallucinated on day ${day}!`);
      }
    }

    const aiMetrics = this.aiJanitor.getMetrics();
    
    // Compile final results
    const result: SimulationResult = {
      durationDays: this.config.durationDays,
      totalCards: this.board.cards.size,
      dailyMetrics: this.dailyMetrics,
      agentActions: this.allActions,
      aiJanitorMetrics: {
        ...aiMetrics,
        survivalDays: this.aiJanitor.getSurvivalDays(this.config.durationDays),
        survived: this.aiJanitor.hasSurvived()
      },
      finalBoardState: this.getFinalBoardState()
    };

    if (this.config.verbose) {
      this.printSummary(result);
    }

    return result;
  }

  private getFinalBoardState(): SimulationResult['finalBoardState'] {
    const cardsByStatus: Record<CardStatus, number> = {
      'Backlog': 0,
      'Todo': 0,
      'In Progress': 0,
      'Review': 0,
      'Stuck': 0,
      'Done': 0,
      'Archived': 0
    };
    
    let totalComments = 0;
    let totalBlockers = 0;
    let totalAttachments = 0;
    
    for (const card of this.board.cards.values()) {
      cardsByStatus[card.status]++;
      totalComments += card.comments.length;
      totalBlockers += card.blockedBy.length;
      totalAttachments += card.attachments.length;
    }
    
    return {
      cardsByStatus,
      totalComments,
      totalBlockers,
      totalAttachments
    };
  }

  private printSummary(result: SimulationResult): void {
    console.log('\n=== SIMULATION COMPLETE ===\n');
    console.log(`Duration: ${result.durationDays} days`);
    console.log(`Total Cards: ${result.totalCards}`);
    console.log('\nFinal Board State:');
    console.log(`  Cards by Status: ${JSON.stringify(result.finalBoardState.cardsByStatus)}`);
    console.log(`  Total Comments: ${result.finalBoardState.totalComments}`);
    console.log(`  Total Blockers: ${result.finalBoardState.totalBlockers}`);
    console.log(`  Total Attachments: ${result.finalBoardState.totalAttachments}`);
    console.log('\nAI Janitor Bot Results:');
    console.log(`  Queries: ${result.aiJanitorMetrics.queryCount}`);
    console.log(`  Successful Responses: ${result.aiJanitorMetrics.successfulResponses}`);
    console.log(`  Hallucinations: ${result.aiJanitorMetrics.hallucinationCount}`);
    console.log(`  Graceful Fallbacks: ${result.aiJanitorMetrics.gracefulFallbackCount}`);
    console.log(`  Survival Days: ${result.aiJanitorMetrics.survivalDays}`);
    console.log(`  SURVIVED: ${result.aiJanitorMetrics.survived ? '✅ YES' : '❌ NO'}`);
    console.log('\nAgent Actions:');
    for (const [agentId, actions] of result.agentActions) {
      console.log(`  ${agentId}: ${actions.length} actions`);
    }
  }

  getBoard(): Board {
    return this.board;
  }

  getAgents(): BaseAgent[] {
    return this.agents;
  }

  getAIJanitor(): AIJanitorBot {
    return this.aiJanitor;
  }
}

/**
 * Run a quick simulation with default settings
 */
export function runQuickSimulation(days: number = 30): SimulationResult {
  const simulator = new FizzyTeamSimulator({
    durationDays: days,
    generatorConfig: {
      minCards: 2000,
      maxCards: 5000,
      chaosLevel: 0.5
    },
    verbose: true
  });
  
  return simulator.run();
}

/**
 * Run the full 90-day stress test
 */
export function runFullStressTest(): SimulationResult {
  const simulator = new FizzyTeamSimulator({
    durationDays: 90,
    generatorConfig: {
      minCards: 5000,
      maxCards: 10000,
      chaosLevel: 0.7,
      staleCardPercentage: 0.4,
      blockerDensity: 0.2,
      commentDensity: 0.5
    },
    verbose: true
  });
  
  return simulator.run();
}
