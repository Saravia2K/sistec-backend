import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseStatusDto {
  @ApiProperty({
    enum: PurchaseStatus,
    example: PurchaseStatus.completed,
    description: 'Nuevo estado de la compra',
  })
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;
}
