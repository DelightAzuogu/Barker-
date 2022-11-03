import { IsNotEmpty } from 'class-validator';

export class BarkDto {
  @IsNotEmpty()
  text: string;
}
