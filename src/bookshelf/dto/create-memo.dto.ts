import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateMemoDto {
  /**
   * 페이지 번호
   */
  @IsEmpty()
  @IsNumber()
  page?: number = 0;

  /**
   * 메모 내용
   */
  @IsString()
  @IsNotEmpty()
  content: string;
}
