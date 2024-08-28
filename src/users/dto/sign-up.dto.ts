import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LocalSendEmailDto {
  @IsString()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isSignUp: boolean;
}

export class LocalVerifyEmailDto {
  @IsString()
  email: string;

  @IsString()
  code: string;
}

export class LocalSignUpDto {
  /**
   * 이메일
   */
  @IsString()
  email: string;

  /**
   * 비밀번호
   */
  @IsString()
  password: string;

  /**
   * 닉네임
   */
  @IsString()
  name?: string;
}

export class SupportDto {
  @IsString()
  category: string;

  @IsString()
  content: string;
}
