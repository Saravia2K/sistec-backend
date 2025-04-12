import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({
    example: 'Resistor 10kΩ',
    description: 'Nombre único del componente',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Resistor de carbón 1/4W',
    description: 'Descripción detallada del componente',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el componente es visible en el catálogo',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  visible?: boolean = true;
}
