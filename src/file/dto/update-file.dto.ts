import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto.js';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
