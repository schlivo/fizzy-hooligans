import { generateLiveJunk } from '../src/generator';
import { 
  moveCard, 
  addComment, 
  setDueDate, 
  createBlockerLink,
  addLabel,
  removeLabel,
  assignTo,
  renameCard,
  uploadAttachment,
  setPriority,
  bulkUpdate,
  askFizzy,
  summarizeCycle
} from '../src/tools';

describe('Card Tools', () => {
  describe('moveCard', () => {
    it('should move a card to a new status', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = moveCard(board, card.id, 'Done', 'test-actor');
      
      expect(result).toBe(true);
      expect(board.cards.get(card.id)?.status).toBe('Done');
    });

    it('should record history for status changes', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      const initialHistoryLength = card.history.length;
      
      moveCard(board, card.id, 'Review', 'test-actor');
      
      expect(card.history.length).toBe(initialHistoryLength + 1);
      expect(card.history[card.history.length - 1].action).toBe('move_card');
    });

    it('should return false for non-existent card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      
      const result = moveCard(board, 'non-existent-id', 'Done', 'test-actor');
      
      expect(result).toBe(false);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      const initialCommentCount = card.comments.length;
      
      const comment = addComment(board, card.id, 'author-1', 'Author Name', 'Test comment');
      
      expect(comment).not.toBeNull();
      expect(card.comments.length).toBe(initialCommentCount + 1);
      expect(card.comments[card.comments.length - 1].content).toBe('Test comment');
    });

    it('should return null for non-existent card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      
      const result = addComment(board, 'non-existent-id', 'author', 'Author', 'Comment');
      
      expect(result).toBeNull();
    });
  });

  describe('setDueDate', () => {
    it('should set the due date on a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      const dueDate = new Date('2025-12-31');
      
      const result = setDueDate(board, card.id, dueDate, 'test-actor');
      
      expect(result).toBe(true);
      expect(card.dueDate).toEqual(dueDate);
    });
  });

  describe('createBlockerLink', () => {
    it('should create a blocker link between two cards', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const cards = Array.from(board.cards.values());
      const blockedCard = cards[0];
      const blockingCard = cards[1];
      
      // Clear existing blockers for clean test
      blockedCard.blockedBy = [];
      blockingCard.blocking = [];
      
      const result = createBlockerLink(board, blockedCard.id, blockingCard.id, 'test-actor');
      
      expect(result).toBe(true);
      expect(blockedCard.blockedBy).toContain(blockingCard.id);
      expect(blockingCard.blocking).toContain(blockedCard.id);
    });
  });

  describe('addLabel', () => {
    it('should add a label to a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = addLabel(board, card.id, 'test-label', 'test-actor');
      
      expect(result).toBe(true);
      expect(card.labels).toContain('test-label');
    });

    it('should not duplicate labels', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      addLabel(board, card.id, 'test-label', 'test-actor');
      addLabel(board, card.id, 'test-label', 'test-actor');
      
      const labelCount = card.labels.filter(l => l === 'test-label').length;
      expect(labelCount).toBe(1);
    });
  });

  describe('removeLabel', () => {
    it('should remove a label from a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      card.labels.push('remove-me');
      
      const result = removeLabel(board, card.id, 'remove-me', 'test-actor');
      
      expect(result).toBe(true);
      expect(card.labels).not.toContain('remove-me');
    });

    it('should return false if label does not exist', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = removeLabel(board, card.id, 'non-existent-label', 'test-actor');
      
      expect(result).toBe(false);
    });
  });

  describe('assignTo', () => {
    it('should assign a card to a user', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = assignTo(board, card.id, 'new-assignee', 'test-actor');
      
      expect(result).toBe(true);
      expect(card.assignee).toBe('new-assignee');
    });
  });

  describe('renameCard', () => {
    it('should rename a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = renameCard(board, card.id, 'New Title', 'test-actor');
      
      expect(result).toBe(true);
      expect(card.title).toBe('New Title');
    });
  });

  describe('uploadAttachment', () => {
    it('should upload an attachment to a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      const initialAttachmentCount = card.attachments.length;
      
      const attachment = uploadAttachment(board, card.id, 'test-file.zip', 'uploader');
      
      expect(attachment).not.toBeNull();
      expect(card.attachments.length).toBe(initialAttachmentCount + 1);
      expect(attachment?.filename).toBe('test-file.zip');
    });
  });

  describe('setPriority', () => {
    it('should set priority on a card', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const card = Array.from(board.cards.values())[0];
      
      const result = setPriority(board, card.id, 'P0', 'test-actor');
      
      expect(result).toBe(true);
      expect(card.priority).toBe('P0');
    });
  });

  describe('bulkUpdate', () => {
    it('should update multiple cards at once', () => {
      const board = generateLiveJunk({ minCards: 10, maxCards: 20 });
      const cardIds = Array.from(board.cards.keys()).slice(0, 5);
      
      const count = bulkUpdate(board, cardIds, { status: 'Done', priority: 'P3' }, 'test-actor');
      
      expect(count).toBe(5);
      for (const cardId of cardIds) {
        const card = board.cards.get(cardId);
        expect(card?.status).toBe('Done');
        expect(card?.priority).toBe('P3');
      }
    });
  });

  describe('askFizzy', () => {
    it('should return blocker information', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100, blockerDensity: 0.5 });
      
      const result = askFizzy(board, 'show me all real blockers');
      
      expect(result.success).toBe(true);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.data).toHaveProperty('blockedCards');
    });

    it('should return status distribution', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      const result = askFizzy(board, 'show me status column distribution');
      
      expect(result.success).toBe(true);
      expect(result.confidence).toBe(1.0);
    });

    it('should return ownership with graceful fallback for chaotic assignments', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      
      // Simulate many reassignments on some cards (more than 5 to trigger fallback)
      const cards = Array.from(board.cards.values()).slice(0, 10);
      for (const card of cards) {
        // Add more than 5 assign events to trigger the uncertain ownership detection
        for (let i = 0; i < 10; i++) {
          card.history.push({
            timestamp: new Date(),
            action: 'assign',
            actor: 'greg',
            details: { newAssignee: `person-${i}` }
          });
        }
      }
      
      // Use query that matches the 'owner' or 'assign' pattern
      const result = askFizzy(board, 'show me card assignments');
      
      expect(result.success).toBe(true);
      // When there are uncertain ownership cards, data should include uncertainOwnership
      // and a fallbackMessage should be present
      const data = result.data as { cardsByAssignee?: Record<string, string[]>; uncertainOwnership?: unknown[] };
      expect(data.uncertainOwnership).toBeDefined();
      expect(data.uncertainOwnership?.length).toBeGreaterThan(0);
      expect(result.fallbackMessage).toBeDefined();
    });
  });

  describe('summarizeCycle', () => {
    it('should return board summary', () => {
      const board = generateLiveJunk({ minCards: 50, maxCards: 100 });
      board.currentDay = 30;
      
      const summary = summarizeCycle(board);
      
      expect(summary).toHaveProperty('totalCards');
      expect(summary).toHaveProperty('statusDistribution');
      expect(summary).toHaveProperty('priorityDistribution');
      expect(summary).toHaveProperty('totalComments');
      expect(summary).toHaveProperty('currentDay');
      expect(summary.currentDay).toBe(30);
    });
  });
});
