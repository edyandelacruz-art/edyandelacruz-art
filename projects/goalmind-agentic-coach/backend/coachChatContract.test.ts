import {
  conversationKey,
  idempotencyKey,
  normalizeCoachMessage,
  normalizeOpaqueId,
  publicConversationView,
  trimConversation,
  validateConversationOwnership,
  type CoachChatMessage,
  type CoachConversation,
} from './coachChatContract';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function message(index: number): CoachChatMessage {
  return {
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: `turn-${index}`,
    turnId: `turn_0000000${String(index).padStart(2, '0')}`,
    createdAt: new Date(2026, 8, 30, 12, index).toISOString(),
  };
}

export function runCoachChatContractTests() {
  const guestA = 'guest_123456789012';
  const guestB = 'guest_987654321098';
  const conversationId = 'conv_1234567890123';
  const requestId = 'req_12345678901234';

  assert(normalizeOpaqueId(guestA) === guestA, 'valid opaque id must survive normalization');
  assert(normalizeOpaqueId('short') === '', 'short ids must be rejected');
  assert(normalizeOpaqueId('../guest_123456789012') === '', 'path-like ids must be rejected');

  assert(
    conversationKey(guestA, conversationId) !== conversationKey(guestB, conversationId),
    'conversation storage must be isolated by guest',
  );
  assert(
    idempotencyKey(guestA, requestId) === idempotencyKey(guestA, requestId),
    'same request id must resolve to the same idempotency key',
  );
  assert(
    idempotencyKey(guestA, requestId) !== idempotencyKey(guestB, requestId),
    'idempotency keys must be isolated by guest',
  );

  const dirty = `  Hola\u0000   Coach,   quiero   practicar   cinemática.  `;
  assert(
    normalizeCoachMessage(dirty) === 'Hola Coach, quiero practicar cinemática.',
    'messages must remove NULs and collapse whitespace',
  );
  assert(normalizeCoachMessage('x'.repeat(2000)).length === 1600, 'messages must be bounded');

  const messages = Array.from({ length: 30 }, (_, index) => message(index));
  const trimmed = trimConversation(messages, 6);
  assert(trimmed.length === 12, 'six turns must expose at most twelve messages');
  assert(trimmed[0].content === 'turn-18', 'trim must preserve the newest window');
  assert(trimmed[11].content === 'turn-29', 'trim must retain the latest message');

  const conversation: CoachConversation = {
    conversationId,
    guestId: guestA,
    createdAt: '2026-09-30T12:00:00.000Z',
    updatedAt: '2026-09-30T12:10:00.000Z',
    messages,
    normalizedGoal: 'Practicar cinemática',
    readyToBuild: true,
  };

  assert(validateConversationOwnership(conversation, guestA), 'owner must access conversation');
  assert(!validateConversationOwnership(conversation, guestB), 'another guest must not access conversation');

  const publicView = publicConversationView(conversation);
  assert(publicView.conversationId === conversationId, 'public view must preserve conversation id');
  assert(publicView.messages.length === 24, 'public view must expose at most twelve turns');
  assert(publicView.messages[0].content === 'turn-6', 'public view must retain the newest twelve-turn window');
  assert(publicView.messages[23].content === 'turn-29', 'public view must retain the latest message');
  assert(!('guestId' in publicView), 'public view must not leak guest identity');
  assert(!('createdAt' in publicView), 'public view must not expose internal creation metadata');

  return { passed: 18 };
}
