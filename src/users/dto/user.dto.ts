import { ApiProperty } from '@nestjs/swagger';

export class ChangeNameDto {
  @ApiProperty({ description: '이름' })
  name: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

export class FindPasswordDto {
  @ApiProperty({ description: '이메일' })
  email: string;
}
