import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Repairs')
@ApiBearerAuth()
@Controller('repairs')
export class RepairsController {
  constructor(private readonly service: RepairsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear reparación' })
  create(@Body() body: CreateRepairDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reparaciones' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reparación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':supportTicketId')
  @ApiOperation({ summary: 'Actualizar información de reparación' })
  async updateRepair(
    @Param('supportTicketId', ParseIntPipe) supportTicketId: number,
    @Body() updateRepairDto: UpdateRepairDto,
  ) {
    return this.service.updateRepair(supportTicketId, updateRepairDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reparación' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
