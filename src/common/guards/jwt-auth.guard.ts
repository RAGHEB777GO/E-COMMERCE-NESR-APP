import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.warn('⚠️ JWT validation failed:', info?.message || err?.message);
      return null; 
    }
    console.log('✅ JWT validation success for user:', user.email || user._id);
    return user;
  }
}
