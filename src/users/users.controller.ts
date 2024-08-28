import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse, BaseResponseType } from 'src/common/base-response';
import {
  LocalSignInDto,
  SignInWithAppleDto,
  SignInWithGoogleDto,
  SignInWithKakaoDto,
  TestSignInDto,
} from './dto/sign-in.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { AuthTokenPayload } from 'src/auth/dto/validate-user.dto';
import {
  LocalSendEmailDto,
  LocalSignUpDto,
  LocalVerifyEmailDto,
} from './dto/sign-up.dto';
import {
  ChangeNameDto,
  ChangePasswordDto,
  FindPasswordDto,
} from './dto/user.dto';

@ApiTags('User')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private service: UsersService) {}

  @ApiOperation({
    summary: '카카오톡 소셜 로그인 API',
    description:
      '카카오톡 인증 서버에서 발급받은 카카오 유저 access token을 이용하여 로그인한다.',
  })
  @Post('/sign-in/kakao')
  async signInWithKakao(
    @Body() dto: SignInWithKakaoDto,
  ): Promise<BaseResponse> {
    try {
      const data = await this.service.signInWithKakao(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        code: 'U0002',
        message: '로그인 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        code: 'U0003',
        message: '카카오 로그인 실패 😢',
      };
    }
  }

  @ApiOperation({ summary: '구글 소셜 로그인 API' })
  @Post('/sign-in/google')
  async signInWithGoogle(
    @Body() dto: SignInWithGoogleDto,
  ): Promise<BaseResponse> {
    try {
      const data = await this.service.signInWithGoogle(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '로그인 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: '구글 로그인 실패 😢',
      };
    }
  }

  @ApiOperation({ summary: '애플 소셜 로그인 API' })
  @Post('/sign-in/apple')
  async signInWithApple(
    @Body() dto: SignInWithAppleDto,
  ): Promise<BaseResponse> {
    try {
      const data = await this.service.signInWithApple(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '로그인 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: '애플 로그인 실패 😢',
      };
    }
  }

  @ApiOperation({ summary: '로컬 회원가입 이메일 인증코드 발송 API' })
  @ApiBody({ type: LocalSendEmailDto })
  @Post('/sign-up/local/send-email')
  async sendEmail(@Body() dto: LocalSendEmailDto): Promise<BaseResponse> {
    try {
      await this.service.sendEmail(dto);
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

  @ApiOperation({ summary: '로컬 회원가입 이메일 인증 API' })
  @ApiBody({ type: LocalVerifyEmailDto })
  @Post('/sign-up/local/verify-email')
  async verifyEmail(@Body() dto: LocalVerifyEmailDto): Promise<BaseResponse> {
    try {
      await this.service.verifyEmail(dto);
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

  @ApiOperation({ summary: '로컬 회원가입 API' })
  @ApiBody({ type: LocalSignUpDto })
  @Post('/sign-up/local')
  async signUpLocal(@Body() dto: LocalSignUpDto): Promise<BaseResponse> {
    try {
      const data = await this.service.signUpLocal(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '회원가입 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '로컬 로그인 API' })
  @ApiBody({ type: LocalSignInDto })
  @Post('/sign-in/local')
  async signInLocal(@Body() dto: LocalSignInDto): Promise<BaseResponse> {
    try {
      const data = await this.service.signInLocal(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        code: 'U0001',
        message: '로그인 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,

        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '회원 탈퇴 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteUser(@User() user: AuthTokenPayload): Promise<BaseResponse> {
    try {
      await this.service.deleteUser(user.id);
      return {
        type: BaseResponseType.SUCCESS,
        message: '회원 탈퇴 성공 😭',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @Post('/test-login')
  async testLogin(@Body() dto: TestSignInDto): Promise<BaseResponse> {
    try {
      const data = await this.service.testLogin(dto);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        code: 'U0003',
        message: '테스트 로그인 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/test-decode')
  async testDecodeToken(@User() user: AuthTokenPayload): Promise<BaseResponse> {
    try {
      return {
        type: BaseResponseType.SUCCESS,
        data: user,
        code: 'U0004',
        message: '토큰 디코드 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '닉네임 변경 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: ChangeNameDto })
  @Patch('/name')
  async changeName(
    @Body() dto: ChangeNameDto,
    @User() user: AuthTokenPayload,
  ): Promise<BaseResponse> {
    try {
      await this.service.changeName(user.id, dto.name);
      return {
        type: BaseResponseType.SUCCESS,
        message: '닉네임 변경 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({
    summary: '비밀번호 찾기 API(로컬 계정에서만 사용 가능)',
    description: '이메일로 임시 비밀번호를 발급받는다.',
  })
  @ApiBody({ type: FindPasswordDto })
  @Post('/reset-password')
  async findPassword(@Body() dto: FindPasswordDto): Promise<BaseResponse> {
    try {
      await this.service.findPassword(dto.email);
      return {
        type: BaseResponseType.SUCCESS,
        message: `임시 비밀번호가 발송되었습니다.\n 로그인 후 비밀번호를 변경해주시기 바랍니다.`,
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '비밀번호 변경 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: ChangePasswordDto })
  @Patch('/password')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @User() user: AuthTokenPayload,
  ): Promise<BaseResponse> {
    try {
      await this.service.changePassword(user.id, dto.password);
      return {
        type: BaseResponseType.SUCCESS,
        message: '비밀번호 변경 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }
}
