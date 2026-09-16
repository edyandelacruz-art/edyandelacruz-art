export type AvatarId = 'owl' | 'robot' | 'fox' | 'astronaut' | 'cat' | 'gamer';

export interface LearnerProfile {
  name: string;
  avatarId: AvatarId;
  createdAt: string;
}

export interface AvatarDefinition {
  id: AvatarId;
  name: string;
  trait: string;
  emoji: string;
  accent: string;
}

export const AVATARS: AvatarDefinition[] = [
  { id: 'owl', name: 'Búho', trait: 'Sabiduría', emoji: '🦉', accent: 'amber' },
  { id: 'robot', name: 'Robot', trait: 'Enfoque', emoji: '🤖', accent: 'cyan' },
  { id: 'fox', name: 'Zorro', trait: 'Curiosidad', emoji: '🦊', accent: 'orange' },
  { id: 'astronaut', name: 'Astronauta', trait: 'Disciplina', emoji: '🧑‍🚀', accent: 'blue' },
  { id: 'cat', name: 'Gato', trait: 'Calma', emoji: '🐱', accent: 'violet' },
  { id: 'gamer', name: 'Gamer', trait: 'Superación', emoji: '🎮', accent: 'magenta' },
];

const PROFILE_KEY = 'focuslab.profile.v1';

export function loadProfile(): LearnerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as LearnerProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: LearnerProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function avatarFor(id: AvatarId) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[1];
}
