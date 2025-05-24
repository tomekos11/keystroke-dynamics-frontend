export interface User {
    id: number | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    secretWord: string | null;
  }