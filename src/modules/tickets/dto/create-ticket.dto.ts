import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEnum,
    IsInt,
  } from 'class-validator';
  import { TicketPriority } from '@prisma/client';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateTicketDto {

    @ApiProperty()
    @IsInt()
    customerId: number;
  
    @ApiProperty()
    @IsOptional()
    @IsInt()
    assignedTechnicianId?: number;
  
    @ApiProperty()
    @IsInt()
    deviceTypeId: number;
  
    @ApiProperty()
    @IsString()
    brand: string;
  
    @ApiProperty()
    @IsString()
    problemDescription: string;
  
    @ApiProperty()
    @IsOptional()
    @IsEnum(TicketPriority)
    priority?: TicketPriority;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    model?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    serialNumber?: string;
  }
  