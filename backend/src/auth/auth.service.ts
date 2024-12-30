import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId };

    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId, tokenType: 'refresh' };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    await this.cacheManager.set(`user:${userId}:refresh_token`, refreshToken, {
      ttl: 2 * 60 * 60,
    });

    return refreshToken;
  }

  async validateRefreshToken(refreshToken: string): Promise<string | null> {
    const decoded = this.jwtService.verify(refreshToken);
    const userId = decoded?.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.cacheManager.get<string>(
      `user:${userId}:refresh_token`,
    );

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return userId;
  }
}
