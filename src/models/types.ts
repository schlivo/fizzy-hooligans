/**
 * Core data models for the Fizzy Team Simulator
 * Represents Kanban cards, boards, and related entities
 */

export interface Comment {
  id: string;
  cardId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  cardId: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface BlockerLink {
  id: string;
  blockedCardId: string;
  blockingCardId: string;
  createdBy: string;
  createdAt: Date;
  reason?: string;
}

export interface CardHistory {
  timestamp: Date;
  action: string;
  actor: string;
  details: Record<string, unknown>;
}

export type CardStatus = 
  | 'Backlog'
  | 'Todo'
  | 'In Progress'
  | 'Review'
  | 'Stuck'
  | 'Done'
  | 'Archived';

export type CardPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export interface Card {
  id: string;
  title: string;
  description: string;
  status: CardStatus;
  priority: CardPriority;
  labels: string[];
  assignee?: string;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  comments: Comment[];
  attachments: Attachment[];
  blockedBy: string[]; // Card IDs blocking this card
  blocking: string[];  // Card IDs this card is blocking
  history: CardHistory[];
  storyPoints?: number;
  sprint?: string;
}

export interface Board {
  id: string;
  name: string;
  cards: Map<string, Card>;
  columns: CardStatus[];
  teamMembers: string[];
  sprints: Sprint[];
  currentDay: number;
}

export interface Sprint {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  cards: string[]; // Card IDs
}

export interface SimulationMetrics {
  day: number;
  totalCards: number;
  cardsByStatus: Record<CardStatus, number>;
  commentsAdded: number;
  cardsReassigned: number;
  blockerLinksCreated: number;
  hallucinations: number;
  gracefulFallbacks: number;
  aiQueries: number;
  aiSuccessfulResponses: number;
}

export interface PersonaAction {
  type: string;
  persona: string;
  timestamp: Date;
  details: Record<string, unknown>;
  cardId?: string;
}
