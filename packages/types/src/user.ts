export type UserRole = 'user' | 'admin';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  googleId?: string;
  isEmailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}
