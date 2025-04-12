import { PartialType } from '@nestjs/mapped-types';
import { CreateComponentDto } from './create-component.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
  @ApiPropertyOptional({
    example: false,
    description: 'Actualizar visibilidad',
  })
  visible?: boolean;
}
