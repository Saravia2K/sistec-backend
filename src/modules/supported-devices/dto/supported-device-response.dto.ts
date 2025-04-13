import { ApiProperty } from '@nestjs/swagger';

export class SupportedDeviceResponseDto {
  @ApiProperty({ example: 1, description: 'ID del dispositivo' })
  id: number;

  @ApiProperty({ example: 'Smartphone', description: 'Nombre del dispositivo' })
  name: string;
}
