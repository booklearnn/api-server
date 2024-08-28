import { IsNotEmpty, IsString } from 'class-validator';

export class SignInWithKakaoDto {
  /**
   * 카카오톡 인증 서버에서 발급받은 카카오 유저 access token
   */
  accessToken: string;
}

export class SignInWithGoogleDto {
  /**
   * 구글 인증 서버에서 발급받은 구글 유저 Identity Token
   */
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class SignInWithAppleDto {
  /**
   * 애플 인증 서버에서 발급받은 애플 유저 Identity Token
   */
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class TestSignInDto {
  userId: number;
}

export type KaKaoUserInfoRes = {
  id: number;
  connected_at: Date;
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    has_email: boolean;
    email_needs_agreement: boolean;
  };
};

export class LocalSignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
