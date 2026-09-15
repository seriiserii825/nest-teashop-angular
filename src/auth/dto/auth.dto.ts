import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

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
  @IsOptional()
  @IsString()
  password?: string;
}
