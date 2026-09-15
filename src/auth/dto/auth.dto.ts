import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@mail.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @MinLength(6)
  @IsString()
  password: string;
}
