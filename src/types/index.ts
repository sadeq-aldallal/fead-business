export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'training';
  instagramAccount: string;
  responseTime: number;
  conversationsHandled: number;
  lastActive: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  isConnected: boolean;
  followerCount: number;
  profilePicture: string;
}

export interface Language {
  code: 'en' | 'ar';
  name: string;
  flag: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}