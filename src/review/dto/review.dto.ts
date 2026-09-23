import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto.js';
import { Review } from '../entities/review.entity.js';

export class ReviewDto extends OmitType(Review, ['user'] as const) {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}
