import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface User {
  username: string;
  password: string;
  locked?: boolean;
}

export const USERS: User[] = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'locked_out_user', password: 'secret_sauce', locked: true },
  { username: 'problem_user', password: 'secret_sauce' },
];

@Injectable()
export class AuthService {
  private sessions = new Map<string, string>(); // token -> username

  login(username?: string, password?: string): { token: string; username: string } {
    if (!username) throw new UnauthorizedException('Epic sadface: Username is required');
    if (!password) throw new UnauthorizedException('Epic sadface: Password is required');
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) {
      throw new UnauthorizedException(
        'Epic sadface: Username and password do not match any user in this service',
      );
    }
    if (user.locked) {
      throw new ForbiddenException('Epic sadface: Sorry, this user has been locked out.');
    }
    const token = randomUUID();
    this.sessions.set(token, user.username);
    return { token, username: user.username };
  }

  logout(token: string) {
    this.sessions.delete(token);
  }

  userFor(token: string): string | undefined {
    return this.sessions.get(token);
  }

  reset() {
    this.sessions.clear();
  }
}
