import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { PurchaseStatus } from '@prisma/client';

export class CreatePurchaseDto {
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  @IsInt()
  supplierId: number;

  @ApiProperty({ example: 1, description: 'ID del componente' })
  @IsInt()
  componentId: number;

  @ApiProperty({ example: 50, description: 'Cantidad comprada' })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 2.99, description: 'Precio unitario' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: '2023-10-25T00:00:00Z',
    description: 'Fecha de compra (ISO8601)',
  })
  @IsISO8601({ strict: true })
  purchaseDate: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00Z',
    description: 'Fecha de entrega estimada (ISO8601)',
    required: false,
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  deliveryDate?: string;

  @ApiProperty({
    example: 'Compra de resistencias',
    description: 'Detalles adicionales',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    enum: PurchaseStatus,
    example: PurchaseStatus.pending,
    required: false,
  })
  @IsEnum(PurchaseStatus)
  @IsOptional()
  status?: PurchaseStatus;
}
