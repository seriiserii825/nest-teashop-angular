import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto.js';

export class AuthResponseDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({
    description: 'JWT access token. The refresh token is set as an httpOnly cookie.',
  })
  accessToken: string;
}
