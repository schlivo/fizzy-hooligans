import { generateLiveJunk, evolveBoard, TEAM_MEMBERS, LABEL_POOL } from '../src/generator';
import { Board } from '../src/models';

describe('Live Junk Generator', () => {
  describe('generateLiveJunk', () => {
    it('should generate a board with cards within the specified range', () => {
      const board = generateLiveJunk({
        minCards: 100,
        maxCards: 200
      });
      
      expect(board.cards.size).toBeGreaterThanOrEqual(100);
      expect(board.cards.size).toBeLessThanOrEqual(200);
    });

    it('should create cards with valid statuses', () => {
      const validStatuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Stuck', 'Done', 'Archived'];
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      for (const card of board.cards.values()) {
        expect(validStatuses).toContain(card.status);
      }
    });

    it('should create cards with valid priorities', () => {
      const validPriorities = ['P0', 'P1', 'P2', 'P3', 'P4'];
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      for (const card of board.cards.values()) {
        expect(validPriorities).toContain(card.priority);
      }
    });

    it('should assign cards to team members', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      
      let assignedCount = 0;
      for (const card of board.cards.values()) {
        if (card.assignee) {
          assignedCount++;
          expect(TEAM_MEMBERS).toContain(card.assignee);
        }
      }
      
      // Most cards should be assigned
      expect(assignedCount).toBeGreaterThan(50);
    });

    it('should create blocker links based on blocker density', () => {
      const board = generateLiveJunk({
        minCards: 100,
        maxCards: 200,
        blockerDensity: 0.5
      });
      
      let blockedCount = 0;
      for (const card of board.cards.values()) {
        if (card.blockedBy.length > 0) {
          blockedCount++;
        }
      }
      
      // With 50% blocker density, we expect some blocked cards
      expect(blockedCount).toBeGreaterThan(0);
    });

    it('should add comments based on comment density', () => {
      const board = generateLiveJunk({
        minCards: 100,
        maxCards: 200,
        commentDensity: 0.8
      });
      
      let cardsWithComments = 0;
      for (const card of board.cards.values()) {
        if (card.comments.length > 0) {
          cardsWithComments++;
        }
      }
      
      // With 80% comment density, many cards should have comments
      expect(cardsWithComments).toBeGreaterThan(30);
    });

    it('should create cards with history', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      for (const card of board.cards.values()) {
        expect(card.history.length).toBeGreaterThanOrEqual(1);
        expect(card.history[0].action).toBe('created');
      }
    });

    it('should create sprints', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      expect(board.sprints.length).toBe(50);
      expect(board.sprints[0].name).toBe('Sprint 1');
    });
  });

  describe('evolveBoard', () => {
    it('should increment the current day', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      const initialDay = board.currentDay;
      
      evolveBoard(board, 5);
      
      expect(board.currentDay).toBe(initialDay + 5);
    });

    it('should potentially move cards through the pipeline', () => {
      const board = generateLiveJunk({ minCards: 100, maxCards: 200 });
      
      // Get initial done count
      let initialDoneCount = 0;
      for (const card of board.cards.values()) {
        if (card.status === 'Done') {
          initialDoneCount++;
        }
      }
      
      // Evolve for many days to see movement
      for (let i = 0; i < 100; i++) {
        evolveBoard(board, 1);
      }
      
      // Some cards should have moved to Done
      let finalDoneCount = 0;
      for (const card of board.cards.values()) {
        if (card.status === 'Done') {
          finalDoneCount++;
        }
      }
      
      // We expect some movement
      expect(finalDoneCount).toBeGreaterThanOrEqual(initialDoneCount);
    });
  });
});
