import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepairDto {
  @ApiProperty()
  @IsInt()
  supportTicketId: number;

  @ApiProperty()
  @IsString()
  diagnosis: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  appliedSolution?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;
}
