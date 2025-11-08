import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SignupDto, LoginDto } from '../user/user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user = await this.userService.createUser(dto.name, dto.email, dto.password);
    return { message: 'User created', user: { id: (user as any)._id, email: (user as any).email } };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const valid = await this.authService.validateUser(dto.email, dto.password);
    if (!valid) return { message: 'Invalid credentials' };
    return this.authService.login(valid);
  }

  @Post('otp/generate')
  async generateOtp(@Body('email') email: string) {
    return this.authService.generateAndSaveOtp(email);
  }

  @Post('otp/resend')
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @Post('otp/confirm')
  async confirmOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.confirmOtp(body.email, body.otp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return { user: req.user };
  }
}
