/**
 * Passive-Aggressive PO Alex - Loves process, hates direct confrontation
 * Tools: add_comment("Per our last retro…")
 * Chaos: Posts 400-word essays disguised as comments, never actually moves cards
 */

import { Board, PersonaAction } from '../models';
import { BaseAgent, AgentConfig, randomChoice, randomInt, randomSample } from './baseAgent';
import { addComment } from '../tools';

const ESSAY_OPENERS = [
  "Per our last retro, ",
  "As we discussed in the all-hands, ",
  "Following up on our Slack conversation, ",
  "I wanted to loop back on this - ",
  "Just circling back on this item - ",
  "As per my previous email, ",
  "To build on what we discussed offline, ",
  "I've been thinking about this and wanted to share some thoughts: ",
  "Revisiting this based on stakeholder feedback, "
];

const ESSAY_MIDDLES = [
  "I think we should consider the broader implications of this work item in the context of our quarterly objectives and key results. " +
  "While I appreciate the urgency expressed by some team members, it's important that we maintain alignment with our strategic priorities. " +
  "I'd recommend we schedule a sync to discuss the trade-offs involved.",
  
  "I've noticed this has been sitting in the backlog for some time now. While I understand everyone is busy, " +
  "it might be worth revisiting our prioritization framework to ensure we're tackling the most impactful items first. " +
  "Perhaps we could dedicate some time in our next planning session to discuss?",
  
  "Looking at this from a customer perspective, I wonder if we're fully capturing the problem statement here. " +
  "The acceptance criteria seem a bit vague, and I'd hate for us to spend engineering cycles on something that doesn't fully address the user need. " +
  "Could we perhaps get some additional context from the design team?",
  
  "I want to be respectful of everyone's time, but I'm concerned about the scope creep I'm seeing on this ticket. " +
  "What started as a small enhancement seems to have grown significantly. " +
  "Maybe we should break this down into smaller, more manageable chunks?",
  
  "While I appreciate the enthusiasm to get this shipped, I think we might be skipping some important steps in our process. " +
  "Our definition of done clearly states that we need design review and QA sign-off before moving to done. " +
  "Let's make sure we're following our agreed-upon workflow.",
  
  "I've been reflecting on our velocity trends, and I'm wondering if our estimation practices need some refinement. " +
  "This particular item has been through several sprints now, which suggests we might have underestimated the complexity. " +
  "Perhaps a technical spike would help us better understand the work involved?"
];

const ESSAY_CLOSERS = [
  " Thoughts? Let's discuss in our next 1:1.",
  " I'm happy to discuss further if anyone has questions.",
  " Would love to hear other perspectives on this.",
  " Let me know if you'd like to schedule a sync.",
  " I'll leave this here for the team to consider.",
  " Feel free to reach out if you want to chat about this.",
  " No pressure to respond immediately - just wanted to share my thoughts.",
  " I've also added this to our retro board for discussion."
];

const SHORT_COMMENTS = [
  "Per our last retro...",
  "Interesting. Let's discuss.",
  "I have some thoughts on this. Let's sync.",
  "Worth considering the customer impact here.",
  "Let's make sure we're aligned on priorities.",
  "Following our process is important.",
  "Have we considered all the edge cases?",
  "Just want to make sure we're on the same page.",
  "Let's not rush this.",
  "Quality over speed, team."
];

const DEFAULT_CONFIG: AgentConfig = {
  name: 'Passive-Aggressive PO Alex',
  id: 'alex',
  activityLevel: 0.75,
  personality: 'Loves process, hates direct confrontation',
  goals: [
    'Ensure process is followed',
    'Maintain alignment with stakeholders',
    'Document everything (via comments)'
  ]
};

export class PassiveAggressivePOAlex extends BaseAgent {
  private essayCount: number = 0;

  constructor(config: Partial<AgentConfig> = {}) {
    super({ ...DEFAULT_CONFIG, ...config });
  }

  private generateEssay(): string {
    const opener = randomChoice(ESSAY_OPENERS);
    const middle = randomChoice(ESSAY_MIDDLES);
    const closer = randomChoice(ESSAY_CLOSERS);
    return opener + middle + closer;
  }

  act(board: Board, currentDay: number): PersonaAction[] {
    const actions: PersonaAction[] = [];
    
    if (!this.shouldAct()) {
      return actions;
    }

    const cards = Array.from(board.cards.values());
    const activeCards = cards.filter(c => 
      c.status !== 'Done' && c.status !== 'Archived'
    );
    
    // Post essays on random cards
    const essayCount = randomInt(2, 6);
    const cardsForEssays = randomSample(activeCards, essayCount);
    
    for (const card of cardsForEssays) {
      const essay = this.generateEssay();
      addComment(board, card.id, this.id, this.name, essay);
      this.essayCount++;
      this.logAction('add_comment', { cardId: card.id, type: 'essay', length: essay.length }, card.id);
      actions.push({
        type: 'add_comment',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, type: 'essay', length: essay.length },
        cardId: card.id
      });
    }
    
    // Post shorter passive-aggressive comments
    const shortCommentCount = randomInt(5, 15);
    const cardsForShortComments = randomSample(activeCards, shortCommentCount);
    
    for (const card of cardsForShortComments) {
      const comment = randomChoice(SHORT_COMMENTS);
      addComment(board, card.id, this.id, this.name, comment);
      this.logAction('add_comment', { cardId: card.id, type: 'short', comment }, card.id);
      actions.push({
        type: 'add_comment',
        persona: this.id,
        timestamp: new Date(),
        details: { cardId: card.id, type: 'short', comment },
        cardId: card.id
      });
    }
    
    // Note: Alex NEVER moves cards - that's part of the chaos
    
    return actions;
  }

  getEssayCount(): number {
    return this.essayCount;
  }
}
