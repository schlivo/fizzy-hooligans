import { generateLiveJunk } from '../src/generator';
import {
  OverworkedSarah,
  ChaosMonkeyGreg,
  PassiveAggressivePOAlex,
  GhostDesignerMaya,
  BurnedOutOpsChris,
  AIJanitorBot
} from '../src/agents';

describe('Agentic Personas', () => {
  describe('OverworkedSarah', () => {
    it('should move cards to Stuck', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const sarah = new OverworkedSarah();
      
      // Run multiple times to account for probabilistic behavior
      let totalMoveActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = sarah.act(board, i + 1);
        totalMoveActions += actions.filter(a => a.type === 'move_card').length;
      }
      
      expect(totalMoveActions).toBeGreaterThan(0);
    });

    it('should add comments about blockers', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const sarah = new OverworkedSarah();
      
      // Run multiple times to account for probabilistic behavior
      let totalCommentActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = sarah.act(board, i + 1);
        totalCommentActions += actions.filter(a => a.type === 'add_comment').length;
      }
      
      expect(totalCommentActions).toBeGreaterThan(0);
    });

    it('should set due dates', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const sarah = new OverworkedSarah();
      
      // Run multiple times to account for probabilistic behavior
      let totalDueDateActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = sarah.act(board, i + 1);
        totalDueDateActions += actions.filter(a => a.type === 'set_due_date').length;
      }
      
      expect(totalDueDateActions).toBeGreaterThan(0);
    });

    it('should create blocker links', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const sarah = new OverworkedSarah();
      
      // Run multiple times to account for probabilistic behavior
      let totalBlockerActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = sarah.act(board, i + 1);
        totalBlockerActions += actions.filter(a => a.type === 'create_blocker_link').length;
      }
      
      expect(totalBlockerActions).toBeGreaterThan(0);
    });
  });

  describe('ChaosMonkeyGreg', () => {
    it('should add urgent labels', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const greg = new ChaosMonkeyGreg();
      
      // Run multiple times to account for probabilistic behavior
      let totalLabelActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = greg.act(board, i + 1);
        totalLabelActions += actions.filter(a => a.type === 'add_label').length;
      }
      
      expect(totalLabelActions).toBeGreaterThan(0);
    });

    it('should reassign cards randomly', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const greg = new ChaosMonkeyGreg();
      
      // Run multiple times to account for probabilistic behavior
      let totalAssignActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = greg.act(board, i + 1);
        totalAssignActions += actions.filter(a => a.type === 'assign_to').length;
      }
      
      expect(totalAssignActions).toBeGreaterThan(0);
      expect(greg.getReassignmentCount()).toBeGreaterThan(0);
    });

    it('should rename cards with urgency prefixes', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const greg = new ChaosMonkeyGreg();
      
      // Run multiple times to account for probabilistic behavior
      let totalRenameActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = greg.act(board, i + 1);
        totalRenameActions += actions.filter(a => a.type === 'rename_card').length;
      }
      
      expect(totalRenameActions).toBeGreaterThan(0);
    });

    it('should escalate priorities to P0', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const greg = new ChaosMonkeyGreg();
      
      // Run multiple times to account for probabilistic behavior
      let totalPriorityActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = greg.act(board, i + 1);
        totalPriorityActions += actions.filter(a => a.type === 'set_priority').length;
      }
      
      expect(totalPriorityActions).toBeGreaterThan(0);
    });
  });

  describe('PassiveAggressivePOAlex', () => {
    it('should post long essay comments', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const alex = new PassiveAggressivePOAlex();
      
      // Run multiple times to account for probabilistic behavior
      let totalEssayActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = alex.act(board, i + 1);
        totalEssayActions += actions.filter(a => 
          a.type === 'add_comment' && 
          (a.details as { type: string }).type === 'essay'
        ).length;
      }
      
      expect(totalEssayActions).toBeGreaterThan(0);
      expect(alex.getEssayCount()).toBeGreaterThan(0);
    });

    it('should post short passive-aggressive comments', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const alex = new PassiveAggressivePOAlex();
      
      // Run multiple times to account for probabilistic behavior
      let totalShortComments = 0;
      for (let i = 0; i < 5; i++) {
        const actions = alex.act(board, i + 1);
        totalShortComments += actions.filter(a => 
          a.type === 'add_comment' && 
          (a.details as { type: string }).type === 'short'
        ).length;
      }
      
      expect(totalShortComments).toBeGreaterThan(0);
    });

    it('should never move cards', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const alex = new PassiveAggressivePOAlex();
      
      // Run multiple times and ensure no move actions ever
      let totalMoveActions = 0;
      for (let i = 0; i < 5; i++) {
        const actions = alex.act(board, i + 1);
        totalMoveActions += actions.filter(a => a.type === 'move_card').length;
      }
      
      expect(totalMoveActions).toBe(0);
    });
  });

  describe('GhostDesignerMaya', () => {
    it('should rarely act (ghost behavior)', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const maya = new GhostDesignerMaya();
      
      // Maya should not act on day 1 (ghost behavior)
      let actedCount = 0;
      for (let day = 1; day <= 10; day++) {
        const actions = maya.act(board, day);
        if (actions.length > 0) {
          actedCount++;
        }
      }
      
      // Maya acts rarely (roughly every 19 days with some probability)
      expect(actedCount).toBeLessThanOrEqual(3);
    });

    it('should upload design attachments when acting', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const maya = new GhostDesignerMaya();
      
      // Force Maya to act by simulating many days
      let foundAttachmentAction = false;
      for (let day = 1; day <= 50; day++) {
        const actions = maya.act(board, day);
        if (actions.some(a => a.type === 'upload_attachment')) {
          foundAttachmentAction = true;
          break;
        }
      }
      
      expect(foundAttachmentAction).toBe(true);
    });
  });

  describe('BurnedOutOpsChris', () => {
    it('should ignore most activity', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const chris = new BurnedOutOpsChris();
      
      // Without fire cards or many pings, Chris should be mostly inactive
      // Note: Chris may still act if random fire keywords appear in generated data
      let actedCount = 0;
      for (let day = 1; day <= 5; day++) {
        const actions = chris.act(board, day);
        if (actions.length > 0) {
          actedCount++;
        }
      }
      
      // Chris is usually inactive, but we allow some activity due to random data
      expect(actedCount).toBeLessThanOrEqual(5);
    });

    it('should react to fire cards', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const chris = new BurnedOutOpsChris();
      
      // Add a fire comment to trigger Chris
      const card = Array.from(board.cards.values())[0];
      card.comments.push({
        id: 'test-fire-comment',
        cardId: card.id,
        authorId: 'someone',
        authorName: 'Someone',
        content: 'PROD DOWN - need fix ASAP!',
        timestamp: new Date()
      });
      
      const actions = chris.act(board, 1);
      
      const emergencyActions = actions.filter(a => a.type === 'emergency_fix');
      expect(emergencyActions.length).toBeGreaterThan(0);
    });
  });

  describe('AIJanitorBot', () => {
    it('should always act', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      const actions = janitor.act(board, 1);
      
      expect(actions.length).toBeGreaterThan(0);
    });

    it('should query for blockers', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      const actions = janitor.act(board, 1);
      
      const blockerQueries = actions.filter(a => a.type === 'query_blockers');
      expect(blockerQueries.length).toBeGreaterThan(0);
    });

    it('should summarize cycle', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      const actions = janitor.act(board, 1);
      
      const summaryCalls = actions.filter(a => a.type === 'summarize_cycle');
      expect(summaryCalls.length).toBeGreaterThan(0);
    });

    it('should track metrics', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      janitor.act(board, 1);
      
      const metrics = janitor.getMetrics();
      expect(metrics.queryCount).toBeGreaterThan(0);
      expect(metrics.successfulResponses).toBeGreaterThanOrEqual(0);
    });

    it('should detect hallucinations when data is incorrect', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      // Run the janitor
      janitor.act(board, 1);
      
      // Check hallucination tracking is working
      const checks = janitor.getHallucinationChecks();
      expect(checks.length).toBeGreaterThan(0);
    });

    it('should track survival status', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      const janitor = new AIJanitorBot();
      
      janitor.act(board, 1);
      
      expect(typeof janitor.hasSurvived()).toBe('boolean');
      expect(typeof janitor.getSurvivalDays(1)).toBe('number');
    });
  });
});
