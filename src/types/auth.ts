import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

export interface FormData {
  email: string
  password: string
  confirmPassword?: string
  fullName?: string
  rememberMe?: boolean
}

export interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  fullName?: string
  general?: string
}