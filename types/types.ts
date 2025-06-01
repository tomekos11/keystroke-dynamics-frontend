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

