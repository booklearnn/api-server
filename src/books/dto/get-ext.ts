import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetExtDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsNumber()
  @IsEmpty()
  maxResults?: number = 18;

  @IsNumber()
  @IsEmpty()
  start?: number = 1;
}
