import { ApiProperty } from '@nestjs/swagger';
import { Component, PurchaseStatus, Supplier } from '@prisma/client';

export class PurchaseResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la compra' })
  id: number;

  @ApiProperty({ description: 'Proveedor asociado' })
  supplier: Supplier;

  @ApiProperty({ description: 'Componente asociado' })
  component: Component;

  @ApiProperty({ example: 50, description: 'Cantidad comprada' })
  quantity: number;

  @ApiProperty({ example: 2.99, description: 'Precio unitario' })
  unitPrice: number;

  @ApiProperty({
    example: '2023-10-25T00:00:00Z',
    description: 'Fecha de compra',
  })
  purchaseDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00Z',
    description: 'Fecha de entrega',
    required: false,
  })
  deliveryDate?: Date;

  @ApiProperty({
    example: 'Compra urgente',
    description: 'Detalles adicionales',
    required: false,
  })
  details?: string;

  @ApiProperty({ enum: PurchaseStatus, example: PurchaseStatus.pending })
  status: PurchaseStatus;
}
