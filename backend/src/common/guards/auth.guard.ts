import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'bookhaven_secret_key_2025';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET) as IJwtPayload;
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    return true;
  }
}
