/**
 * MCP-style tools for card manipulation
 * These tools are used by agentic personas to interact with the board
 */

import { 
  Card, 
  Board, 
  Comment, 
  Attachment, 
  CardStatus, 
  CardHistory,
  CardPriority 
} from '../models';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function addHistory(card: Card, action: string, actor: string, details: Record<string, unknown>): void {
  card.history.push({
    timestamp: new Date(),
    action,
    actor,
    details
  });
  card.updatedAt = new Date();
}

/**
 * Move a card to a different status column
 */
export function moveCard(
  board: Board, 
  cardId: string, 
  newStatus: CardStatus, 
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const oldStatus = card.status;
  card.status = newStatus;
  addHistory(card, 'move_card', actor, { from: oldStatus, to: newStatus });
  return true;
}

/**
 * Add a comment to a card
 */
export function addComment(
  board: Board,
  cardId: string,
  authorId: string,
  authorName: string,
  content: string
): Comment | null {
  const card = board.cards.get(cardId);
  if (!card) return null;
  
  const comment: Comment = {
    id: generateId(),
    cardId,
    authorId,
    authorName,
    content,
    timestamp: new Date()
  };
  
  card.comments.push(comment);
  addHistory(card, 'add_comment', authorId, { commentId: comment.id, preview: content.substring(0, 50) });
  return comment;
}

/**
 * Set due date on a card
 */
export function setDueDate(
  board: Board,
  cardId: string,
  dueDate: Date,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const oldDueDate = card.dueDate;
  card.dueDate = dueDate;
  addHistory(card, 'set_due_date', actor, { 
    oldDueDate: oldDueDate?.toISOString(), 
    newDueDate: dueDate.toISOString() 
  });
  return true;
}

/**
 * Create a blocker link between two cards
 */
export function createBlockerLink(
  board: Board,
  blockedCardId: string,
  blockingCardId: string,
  actor: string,
  reason?: string
): boolean {
  const blockedCard = board.cards.get(blockedCardId);
  const blockingCard = board.cards.get(blockingCardId);
  
  if (!blockedCard || !blockingCard) return false;
  
  if (!blockedCard.blockedBy.includes(blockingCardId)) {
    blockedCard.blockedBy.push(blockingCardId);
  }
  if (!blockingCard.blocking.includes(blockedCardId)) {
    blockingCard.blocking.push(blockedCardId);
  }
  
  addHistory(blockedCard, 'add_blocker', actor, { blockingCardId, reason });
  addHistory(blockingCard, 'now_blocking', actor, { blockedCardId, reason });
  
  return true;
}

/**
 * Add a label to a card
 */
export function addLabel(
  board: Board,
  cardId: string,
  label: string,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  if (!card.labels.includes(label)) {
    card.labels.push(label);
    addHistory(card, 'add_label', actor, { label });
  }
  return true;
}

/**
 * Remove a label from a card
 */
export function removeLabel(
  board: Board,
  cardId: string,
  label: string,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const index = card.labels.indexOf(label);
  if (index > -1) {
    card.labels.splice(index, 1);
    addHistory(card, 'remove_label', actor, { label });
    return true;
  }
  return false;
}

/**
 * Assign a card to a team member
 */
export function assignTo(
  board: Board,
  cardId: string,
  assignee: string,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const oldAssignee = card.assignee;
  card.assignee = assignee;
  addHistory(card, 'assign', actor, { oldAssignee, newAssignee: assignee });
  return true;
}

/**
 * Rename a card
 */
export function renameCard(
  board: Board,
  cardId: string,
  newTitle: string,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const oldTitle = card.title;
  card.title = newTitle;
  addHistory(card, 'rename', actor, { oldTitle, newTitle });
  return true;
}

/**
 * Upload an attachment to a card
 */
export function uploadAttachment(
  board: Board,
  cardId: string,
  filename: string,
  uploadedBy: string
): Attachment | null {
  const card = board.cards.get(cardId);
  if (!card) return null;
  
  const attachment: Attachment = {
    id: generateId(),
    cardId,
    filename,
    uploadedBy,
    uploadedAt: new Date()
  };
  
  card.attachments.push(attachment);
  addHistory(card, 'upload_attachment', uploadedBy, { filename, attachmentId: attachment.id });
  return attachment;
}

/**
 * Set card priority
 */
export function setPriority(
  board: Board,
  cardId: string,
  priority: CardPriority,
  actor: string
): boolean {
  const card = board.cards.get(cardId);
  if (!card) return false;
  
  const oldPriority = card.priority;
  card.priority = priority;
  addHistory(card, 'set_priority', actor, { oldPriority, newPriority: priority });
  return true;
}

/**
 * Bulk update multiple cards (for AI Janitor Bot)
 */
export function bulkUpdate(
  board: Board,
  cardIds: string[],
  updates: Partial<Pick<Card, 'status' | 'priority' | 'assignee' | 'labels'>>,
  actor: string
): number {
  let successCount = 0;
  
  for (const cardId of cardIds) {
    const card = board.cards.get(cardId);
    if (!card) continue;
    
    if (updates.status !== undefined) {
      card.status = updates.status;
    }
    if (updates.priority !== undefined) {
      card.priority = updates.priority;
    }
    if (updates.assignee !== undefined) {
      card.assignee = updates.assignee;
    }
    if (updates.labels !== undefined) {
      card.labels = [...updates.labels];
    }
    
    addHistory(card, 'bulk_update', actor, { updates });
    successCount++;
  }
  
  return successCount;
}

/**
 * Query interface for AI Janitor Bot
 */
export interface FizzyQueryResult {
  success: boolean;
  data?: unknown;
  confidence: number;
  fallbackMessage?: string;
}

/**
 * AI Janitor Bot query tool - simulates asking Fizzy for insights
 */
export function askFizzy(
  board: Board,
  query: string
): FizzyQueryResult {
  const queryLower = query.toLowerCase();
  
  // Show all real blockers
  if (queryLower.includes('blocker') || queryLower.includes('blocked')) {
    const blockedCards = Array.from(board.cards.values())
      .filter(card => card.blockedBy.length > 0 || card.status === 'Stuck');
    
    return {
      success: true,
      data: {
        blockedCards: blockedCards.map(c => ({
          id: c.id,
          title: c.title,
          blockedBy: c.blockedBy,
          status: c.status,
          lastUpdated: c.updatedAt
        }))
      },
      confidence: 0.95
    };
  }
  
  // Summarize cycle time
  if (queryLower.includes('cycle') || queryLower.includes('time')) {
    const doneCards = Array.from(board.cards.values())
      .filter(card => card.status === 'Done');
    
    const cycleTimes = doneCards.map(card => {
      const created = card.createdAt.getTime();
      const updated = card.updatedAt.getTime();
      return (updated - created) / (1000 * 60 * 60 * 24); // Days
    });
    
    const avgCycleTime = cycleTimes.length > 0 
      ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length 
      : 0;
    
    return {
      success: true,
      data: {
        averageCycleTimeDays: avgCycleTime.toFixed(2),
        totalDoneCards: doneCards.length,
        minCycleTime: Math.min(...cycleTimes, 0).toFixed(2),
        maxCycleTime: Math.max(...cycleTimes, 0).toFixed(2)
      },
      confidence: 0.9
    };
  }
  
  // Get cards by status
  if (queryLower.includes('status') || queryLower.includes('column')) {
    const cardsByStatus: Record<string, number> = {};
    for (const card of board.cards.values()) {
      cardsByStatus[card.status] = (cardsByStatus[card.status] || 0) + 1;
    }
    
    return {
      success: true,
      data: cardsByStatus,
      confidence: 1.0
    };
  }
  
  // Get ownership info - this can be confusing with many reassignments
  if (queryLower.includes('owner') || queryLower.includes('assign')) {
    const cardsByAssignee: Record<string, string[]> = {};
    const uncertainOwnership: Array<{id: string; title: string; assignmentHistory: number}> = [];
    
    for (const card of board.cards.values()) {
      const assignee = card.assignee || 'unassigned';
      if (!cardsByAssignee[assignee]) {
        cardsByAssignee[assignee] = [];
      }
      cardsByAssignee[assignee].push(card.id);
      
      // Check for cards with many reassignments
      const assignmentChanges = card.history.filter(h => h.action === 'assign').length;
      if (assignmentChanges > 5) {
        uncertainOwnership.push({
          id: card.id,
          title: card.title,
          assignmentHistory: assignmentChanges
        });
      }
    }
    
    if (uncertainOwnership.length > 0) {
      return {
        success: true,
        data: { cardsByAssignee, uncertainOwnership },
        confidence: 0.6,
        fallbackMessage: `I'm not 100% sure who actually owns ${uncertainOwnership.length} cards—here's the raw history`
      };
    }
    
    return {
      success: true,
      data: cardsByAssignee,
      confidence: 0.9
    };
  }
  
  // Default: return board summary
  return {
    success: true,
    data: {
      totalCards: board.cards.size,
      currentDay: board.currentDay,
      teamMembers: board.teamMembers
    },
    confidence: 0.7
  };
}

/**
 * Summarize cycle metrics for the board
 */
export function summarizeCycle(board: Board): Record<string, unknown> {
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  let totalComments = 0;
  let totalBlockers = 0;
  let totalAttachments = 0;
  
  for (const card of board.cards.values()) {
    statusCounts[card.status] = (statusCounts[card.status] || 0) + 1;
    priorityCounts[card.priority] = (priorityCounts[card.priority] || 0) + 1;
    totalComments += card.comments.length;
    totalBlockers += card.blockedBy.length;
    totalAttachments += card.attachments.length;
  }
  
  return {
    totalCards: board.cards.size,
    statusDistribution: statusCounts,
    priorityDistribution: priorityCounts,
    totalComments,
    totalBlockers,
    totalAttachments,
    currentDay: board.currentDay
  };
}
