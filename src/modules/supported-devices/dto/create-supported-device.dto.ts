import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSupportedDeviceDto {
  @ApiProperty({
    example: 'Smartphone',
    description: 'Nombre único del tipo de dispositivo soportado',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
