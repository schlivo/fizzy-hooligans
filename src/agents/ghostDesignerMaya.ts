/**
 * Ghost Designer Maya - Appears once every 19 days, drops a comment, vanishes
 * Tools: add_comment, upload_attachment("design-v17-final-REALLY.zip")
 * Chaos: Leaves cryptic "Looks good to me" on cards that have been blocked for 6 weeks
 */

import { Board, PersonaAction } from '../models';
import { BaseAgent, AgentConfig, randomChoice, randomInt, randomSample } from './baseAgent';
import { addComment, uploadAttachment } from '../tools';

const CRYPTIC_COMMENTS = [
  "Looks good to me",
  "LGTM",
  "👍",
  "Approved from design",
  "Ship it",
  "Design is done on our end",
  "This looks fine",
  "Approved",
  "Good to go",
  "Signed off",
  "Design complete",
  "✓",
  "All good here",
  "No concerns from design",
  "Works for me"
];

const DESIGN_FILE_NAMES = [
  "design-v17-final-REALLY.zip",
  "mockups-v23-FINAL-final.zip",
  "designs-updated-v2-LATEST.zip",
  "wireframes-v12-approved.zip",
  "UI-specs-final-v8.zip",
  "designs-FINAL-use-this-one.zip",
  "mockups-v47-ACTUALLY-final.zip",
  "design-assets-v6-DO-NOT-USE-OLD-VERSION.zip",
  "final-designs-v19.zip",
  "UI-v33-reviewed.zip",
  "designs-latest-v41-fixed.zip",
  "mockups-FINAL-v28-reviewed-approved.zip",
  "design-v55-THIS-ONE.zip"
];

const DEFAULT_CONFIG: AgentConfig = {
  name: 'Ghost Designer Maya',
  id: 'maya',
  activityLevel: 0.053, // Appears roughly once every 19 days (1/19 ≈ 0.053)
  personality: 'Appears rarely, drops cryptic comments, vanishes',
  goals: [
    'Provide design approval (eventually)',
    'Upload final designs (multiple versions)',
    'Unblock waiting cards (sporadically)'
  ]
};

export class GhostDesignerMaya extends BaseAgent {
  private daysSinceLastAppearance: number = 0;
  private designVersions: number = 0;

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    this.daysSinceLastAppearance++;
    
    // Maya only appears roughly every 19 days
    // But when she does appear, she's prolific
    if (this.daysSinceLastAppearance < 15 || Math.random() > 0.15) {
      return actions;
    }
    
    this.daysSinceLastAppearance = 0;
    
    const cards = Array.from(board.cards.values());
    
    // Find cards that have been waiting for design
    const blockedCards = cards.filter(c => 
      c.status === 'Stuck' || 
      c.comments.some(comment => 
        comment.content.toLowerCase().includes('design') ||
        comment.content.toLowerCase().includes('maya') ||
        comment.content.toLowerCase().includes('mockup')
      )
    );
    
    // Leave cryptic "Looks good to me" on random blocked cards
    const commentCount = randomInt(3, 12);
    const cardsToComment = randomSample(
      blockedCards.length > 0 ? blockedCards : cards,
      commentCount
    );
    
    for (const card of cardsToComment) {
      const comment = randomChoice(CRYPTIC_COMMENTS);
      addComment(board, card.id, this.id, this.name, comment);
      this.logAction('add_comment', { cardId: card.id, comment }, card.id);
      actions.push({
        type: 'add_comment',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, comment },
        cardId: card.id
      });
    }
    
    // Upload design files to random cards
    const attachmentCount = randomInt(2, 8);
    const cardsForAttachments = randomSample(cards, attachmentCount);
    
    for (const card of cardsForAttachments) {
      const filename = randomChoice(DESIGN_FILE_NAMES);
      uploadAttachment(board, card.id, filename, this.id);
      this.designVersions++;
      this.logAction('upload_attachment', { cardId: card.id, filename }, card.id);
      actions.push({
        type: 'upload_attachment',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, filename },
        cardId: card.id
      });
    }
    
    return actions;
  }

  getDesignVersionsUploaded(): number {
    return this.designVersions;
  }
}
