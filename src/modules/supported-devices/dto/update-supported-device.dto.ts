import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportedDeviceDto } from './create-supported-device.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSupportedDeviceDto extends PartialType(
  CreateSupportedDeviceDto,
) {
  @ApiPropertyOptional({
    example: 'Laptop',
    description: 'Nuevo nombre del dispositivo',
  })
  name?: string;
}
