import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = (req.headers['authorization'] ?? '').replace('Bearer ', '');
    const username = this.auth.userFor(token);
    if (!username) {
      throw new UnauthorizedException(
        "Epic sadface: You can only access '/inventory' when you are logged in.",
      );
    }
    req.user = { username, token };
    return true;
  }
}
