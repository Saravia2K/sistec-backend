import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class UpdateTicketDto {
  @ApiProperty({
    required: false,
    example: 2,
    description: 'ID del técnico asignado (null para desasignar)',
  })
  @IsOptional()
  @IsInt()
  assignedTechnicianId?: number | null;

  @ApiProperty({
    enum: TicketStatus,
    example: TicketStatus.in_progress,
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({
    enum: TicketPriority,
    example: TicketPriority.high,
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority | null;

  @ApiProperty({
    required: false,
    example: 'Problema con la placa madre',
  })
  @IsOptional()
  @IsString()
  problemDescription?: string;

  @ApiProperty({ required: false, example: 'Dell' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ required: false, example: 'XPS 15' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false, example: 'SN123456789' })
  @IsOptional()
  @IsString()
  serialNumber?: string | null;
}
