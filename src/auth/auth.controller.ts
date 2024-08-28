import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponseType } from 'src/common/base-response';
import {
  LocalSendEmailDto,
  LocalVerifyEmailDto,
} from 'src/users/dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';
import { AuthTokenPayload } from './dto/validate-user.dto';
import { TokenPayload } from './types';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@User() user: AuthTokenPayload) {
    try {
      const data = await this.userService.getProfile(user.id);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '내 정보 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '비밀번호 초기화 - 메일 전송' })
  @ApiBody({ type: LocalSendEmailDto })
  @Post('send-email')
  async sendEmail(@Body() dto: LocalSendEmailDto) {
    try {
      await this.userService.sendEmail(dto);
      return {
        type: BaseResponseType.SUCCESS,
        message: '이메일 발송 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '비밀번호 초기화 - 메일 인증' })
  @ApiBody({ type: LocalVerifyEmailDto })
  @Post('verify-email')
  async verifyEmail(@Body() dto: LocalVerifyEmailDto) {
    try {
      await this.userService.verifyEmail(dto);
      return {
        type: BaseResponseType.SUCCESS,
        message: '이메일 인증 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refresh(@User() user: TokenPayload) {
    try {
      const accessToken = await this.authService.refreshAccessToken(user.id);
      return {
        type: BaseResponseType.SUCCESS,
        data: { accessToken },
        message: '토큰 갱신 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }
}
