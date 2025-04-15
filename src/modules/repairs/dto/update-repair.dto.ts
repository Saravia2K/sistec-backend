import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class UsedComponentDto {
  @ApiProperty({ example: 1, description: 'ID del inventario de componente' })
  @IsNumber()
  componentStockId: number;

  @ApiProperty({ example: 2, description: 'Cantidad utilizada' })
  @IsNumber()
  quantity: number;
}

export class UpdateRepairDto {
  @ApiProperty({ required: false, example: 'Falla en la placa madre' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ required: false, example: 'Reemplazo de componente' })
  @IsOptional()
  @IsString()
  appliedSolution?: string;

  @ApiProperty({ required: false, example: 150.75 })
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiProperty({ required: false, example: '2023-11-15T14:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ type: [UsedComponentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsedComponentDto)
  usedComponents?: UsedComponentDto[];
}
