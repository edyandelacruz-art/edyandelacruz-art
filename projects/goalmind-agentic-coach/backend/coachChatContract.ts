// GoalMind Coach persistent conversation primitives.
// Runtime wiring belongs in backend/index.ts during AppDeploy reconciliation.

export type CoachChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  turnId: string;
  createdAt: string;
};

export type CoachConversation = {
  conversationId: string;
  guestId: string;
  createdAt: string;
  updatedAt: string;
  messages: CoachChatMessage[];
  normalizedGoal?: string;
  readyToBuild?: boolean;
};

export type CoachChatRequest = {
  guestId?: string;
  conversationId?: string;
  requestId?: string;
  message?: string;
};

const SAFE_ID = /^[a-zA-Z0-9_-]{12,96}$/;

export function normalizeOpaqueId(value: unknown): string {
  const id = String(value || '').trim();
  return SAFE_ID.test(id) ? id : '';
}

export function normalizeCoachMessage(value: unknown): string {
  return String(value || '')
    .replace(/\u0000/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1600);
}

export function conversationKey(guestId: string, conversationId: string): string {
  if (!SAFE_ID.test(guestId) || !SAFE_ID.test(conversationId)) {
    throw new Error('invalid_conversation_identity');
  }
  return `coach_conversations:${guestId}:${conversationId}`;
}

export function idempotencyKey(guestId: string, requestId: string): string {
  if (!SAFE_ID.test(guestId) || !SAFE_ID.test(requestId)) {
    throw new Error('invalid_idempotency_identity');
  }
  return `coach_chat_requests:${guestId}:${requestId}`;
}

export function trimConversation(messages: CoachChatMessage[], maxTurns = 12): CoachChatMessage[] {
  const maxMessages = Math.max(2, Math.min(40, maxTurns * 2));
  return messages.slice(-maxMessages);
}

export function publicConversationView(conversation: CoachConversation) {
  return {
    conversationId: conversation.conversationId,
    updatedAt: conversation.updatedAt,
    messages: trimConversation(conversation.messages),
    normalizedGoal: conversation.normalizedGoal || '',
    readyToBuild: Boolean(conversation.readyToBuild),
  };
}

export function validateConversationOwnership(conversation: CoachConversation | null | undefined, guestId: string): boolean {
  return Boolean(conversation && conversation.guestId === guestId);
}
