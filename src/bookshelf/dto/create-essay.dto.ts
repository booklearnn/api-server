import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEssayDto {
  /**
   * 에세이 내용
   */
  @IsString()
  @IsNotEmpty()
  content: string;
}
