import { OmitType } from '@nestjs/swagger';
import { Color } from '../entities/color.entity.js';

export class ColorDto extends OmitType(Color, ['products'] as const) {}
