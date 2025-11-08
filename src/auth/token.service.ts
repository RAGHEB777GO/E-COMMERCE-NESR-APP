import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: any): string {
    const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET')!;
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRES')!;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  generateRefreshToken(payload: any): string {
    const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET')!;
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES')!;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  generateTokens(payload: any) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, secret: string): any {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET')!;
    return this.verifyToken(refreshToken, secret);
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
