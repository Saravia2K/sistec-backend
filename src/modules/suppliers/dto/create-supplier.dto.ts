import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  address?: string;
}
