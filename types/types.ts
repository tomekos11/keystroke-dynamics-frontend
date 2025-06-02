export interface KeyPress {
  value: string;
  pressedAt: Date;
  releasedAt: Date;
  pressDuration: number; // ms
  waitDuration: number;  // ms
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  }
}

export interface Attempt {
    createdAt: string;
    id: number;
    isCorrect: boolean;
    keyPresses: KeyPress[]
  }
  


export interface UserWithoutAttempts {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  secretWord: string;
}

export interface SecretWordInfo {
  id: number;
  word: string;
  modelCount: number;
  attemptCount: number;
  hasActiveModel: boolean;
}

export interface ActiveSecretWordInfo extends SecretWordInfo {
  attempts: Attempt[]
}

export interface User {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  activeSecretWord: SecretWordInfo | null;
  inactiveSecretWords: SecretWordInfo[];
}

export interface Model {
  modelName: string;
  isActive: boolean;
  trainedAt: string;
  samplesUsed: number;
  loss: number;
  secretWord: string;
}

interface AttemptStats {
  similarity: number;
  success: boolean;
  error: number;
  createdAt: string;
  attackerId: number;
  attackerEmail: string;
  word: string;
  wordId: number;
}

interface Attacker {
  attackerId: number;
  attackerEmail: string;
  attemptsCount: number;
  successCount: number;
  avgError: number;
  avgSimilarity: number;
  isMine: boolean;
  attempts: AttemptStats[];
}

interface AttackOnMe {
  secretWordId: number;
  secretWord: string;
  attackers: Attacker[];
}

interface WordAttack {
  secretWordId: number;
  secretWord: string;
  attemptsCount: number;
  successCount: number;
  avgError: number;
  avgSimilarity: number;
  isMine: boolean;
  attempts: AttemptStats[];
}

interface AttackByMe {
  attackerId: number;
  attackerEmail: string;
  words: WordAttack[];
}

export interface StatsResponse {
  attacksOnMe: AttackOnMe[];
  attacksByMe: AttackByMe[];
}