import { PartialType } from '@nestjs/swagger';
import { CreateStatisticDto } from './create-statistic.dto.js';

export class UpdateStatisticDto extends PartialType(CreateStatisticDto) {}
