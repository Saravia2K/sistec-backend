import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Technicians')
@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post()
  @ApiOperation({ summary: 'Crear técnico con su usuario' })
  create(@Body() body: CreateTechnicianDto) {
    return this.techniciansService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los técnicos' })
  findAll() {
    return this.techniciansService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar técnico por ID de usuario' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTechnicianDto,
  ) {
    return this.techniciansService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar técnico por ID de usuario' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.techniciansService.remove(id);
  }
}
