import { FizzyTeamSimulator, SimulationResult } from '../src/simulation';

describe('FizzyTeamSimulator', () => {
  describe('constructor', () => {
    it('should create a simulator with default config', () => {
      const simulator = new FizzyTeamSimulator();
      
      expect(simulator.getBoard()).toBeDefined();
      expect(simulator.getBoard().cards.size).toBeGreaterThan(0);
    });

    it('should create a simulator with custom config', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 30,
        generatorConfig: {
          minCards: 100,
          maxCards: 200
        }
      });
      
      const board = simulator.getBoard();
      expect(board.cards.size).toBeGreaterThanOrEqual(100);
      expect(board.cards.size).toBeLessThanOrEqual(200);
    });

    it('should initialize all agents', () => {
      const simulator = new FizzyTeamSimulator();
      
      const agents = simulator.getAgents();
      expect(agents.length).toBe(5); // sarah, greg, alex, maya, chris
    });

    it('should initialize AI Janitor Bot', () => {
      const simulator = new FizzyTeamSimulator();
      
      const janitor = simulator.getAIJanitor();
      expect(janitor).toBeDefined();
      expect(janitor.name).toBe('AI Janitor Bot');
    });

    it('should support enabling specific agents', () => {
      const simulator = new FizzyTeamSimulator({
        enabledAgents: ['sarah', 'greg']
      });
      
      const agents = simulator.getAgents();
      expect(agents.length).toBe(2);
    });
  });

  describe('run', () => {
    it('should run a short simulation', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 5,
        generatorConfig: {
          minCards: 50,
          maxCards: 100
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      expect(result.durationDays).toBe(5);
      expect(result.dailyMetrics.length).toBe(5);
    });

    it('should track agent actions', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 5,
        generatorConfig: {
          minCards: 50,
          maxCards: 100
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      expect(result.agentActions.size).toBeGreaterThan(0);
      
      // AI Janitor should always have actions
      const janitorActions = result.agentActions.get('ai_janitor');
      expect(janitorActions).toBeDefined();
      expect(janitorActions?.length).toBeGreaterThan(0);
    });

    it('should track AI Janitor metrics', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 5,
        generatorConfig: {
          minCards: 50,
          maxCards: 100
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      expect(result.aiJanitorMetrics).toBeDefined();
      expect(result.aiJanitorMetrics.queryCount).toBeGreaterThan(0);
      expect(typeof result.aiJanitorMetrics.survived).toBe('boolean');
      expect(result.aiJanitorMetrics.survivalDays).toBeGreaterThanOrEqual(0);
    });

    it('should update board state over time', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 10,
        generatorConfig: {
          minCards: 100,
          maxCards: 200
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      // currentDay gets incremented one more time due to evolveBoard call after each day
      expect(simulator.getBoard().currentDay).toBeGreaterThanOrEqual(10);
      expect(result.finalBoardState.totalComments).toBeGreaterThan(0);
    });

    it('should track cards by status in final state', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 10,
        generatorConfig: {
          minCards: 100,
          maxCards: 200
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      const totalFromStatus = Object.values(result.finalBoardState.cardsByStatus)
        .reduce((sum, count) => sum + count, 0);
      expect(totalFromStatus).toBe(result.totalCards);
    });

    it('should collect daily metrics', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 7,
        generatorConfig: {
          minCards: 50,
          maxCards: 100
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      expect(result.dailyMetrics.length).toBe(7);
      for (let i = 0; i < result.dailyMetrics.length; i++) {
        expect(result.dailyMetrics[i].day).toBe(i + 1);
        expect(result.dailyMetrics[i].totalCards).toBeGreaterThan(0);
      }
    });
  });

  describe('stress test simulation', () => {
    it('should handle larger board sizes', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 10,
        generatorConfig: {
          minCards: 500,
          maxCards: 1000,
          chaosLevel: 0.7
        },
        verbose: false
      });
      
      const result = simulator.run();
      
      expect(result.totalCards).toBeGreaterThanOrEqual(500);
      expect(result.aiJanitorMetrics.queryCount).toBeGreaterThan(0);
    });

    it('should survive chaos without crashing', () => {
      const simulator = new FizzyTeamSimulator({
        durationDays: 15,
        generatorConfig: {
          minCards: 200,
          maxCards: 400,
          chaosLevel: 0.9,
          blockerDensity: 0.3,
          commentDensity: 0.6
        },
        verbose: false
      });
      
      // Should not throw
      expect(() => simulator.run()).not.toThrow();
    });
  });
});
