import {
  IsAlpha,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  bio: string;

  @IsNotEmpty()
  handle: string;
}

export class UserUpdateDto {
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  bio: string;

  @IsNotEmpty()
  handle: string;
}
