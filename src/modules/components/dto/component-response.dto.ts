import { ApiProperty } from '@nestjs/swagger';

export class ComponentResponseDto {
  @ApiProperty({ example: 1, description: 'ID del componente' })
  id: number;

  @ApiProperty({
    example: 'Capacitor 100µF',
    description: 'Nombre del componente',
  })
  name: string;

  @ApiProperty({
    example: 'Capacitor electrolítico 16V',
    description: 'Descripción del componente',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: true, description: 'Visibilidad en el catálogo' })
  visible: boolean;
}
