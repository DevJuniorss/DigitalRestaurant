// src/types/auth.ts
export interface AuthFormProps {
  isSignIn: boolean;
  onToggle: () => void;
}

export interface FormData {
  email: string;
  password: string;
  name?: string;
}
