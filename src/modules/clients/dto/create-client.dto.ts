import { IsEmail, IsNotEmpty, IsOptional, IsString  } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;
    
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsOptional()
    address?: string;
}