import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @ApiPropertyOptional({
    example: PurchaseStatus.completed,
    enum: PurchaseStatus,
  })
  status?: PurchaseStatus;
}
