import { UserRole } from '../entities/user.entity';

export interface JwtRefreshPayload {
  sub: number;
}

export interface JwtStrategyPayload {
  sub: number;
  name: string;
  role: string;
}

export interface RequestWithUser {
  user?: {
    role: UserRole;
    sub: number;
    name: string;
  };
}
