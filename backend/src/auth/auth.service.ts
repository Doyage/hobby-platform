import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { User } from 'src/user/entities/user.entity';
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

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, tokenType: 'refresh' };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    await this.cacheManager.set(`user:${user.id}:refresh_token`, refreshToken, {
      ttl: 2 * 60 * 60,
    });

    return refreshToken;
  }

  async validateRefreshToken(refreshToken: string): Promise<number | null> {
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
