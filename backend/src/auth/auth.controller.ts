import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      await this.authService.validateUser(loginDto.email, loginDto.password),
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    const userId = await this.authService.validateRefreshToken(refreshToken);

    const newAccessToken = await this.authService.generateAccessToken(userId);

    return { access_token: newAccessToken };
  }
}
