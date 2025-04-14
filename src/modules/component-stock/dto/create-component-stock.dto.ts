import { IsInt, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentStockDto {
  @ApiProperty({ example: 1, description: 'ID del componente' })
  @IsInt()
  componentId: number;

  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  @IsInt()
  supplierId: number;

  @ApiProperty({ example: 50, description: 'Cantidad en stock' })
  @IsInt()
  stock: number;

  @ApiProperty({ example: 10, description: 'Cantidad mínima en stock' })
  @IsInt()
  minimumStock: number;

  @ApiProperty({ example: 2.99, description: 'Precio unitario' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que creó el registro',
  })
  @IsBoolean()
  inUse: boolean;
}
