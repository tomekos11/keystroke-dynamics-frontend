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
  
export interface User {
    id: number | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    secretWord: string | null;
    attempts: Attempt[] | null;
  }
