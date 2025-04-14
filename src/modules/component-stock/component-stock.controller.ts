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
import { ComponentStockService } from './component-stock.service';
import { CreateComponentStockDto } from './dto/create-component-stock.dto';
import { UpdateComponentStockDto } from './dto/update-component-stock.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ComponentStock')
@Controller('component-stock')
export class ComponentStockController {
  constructor(private readonly service: ComponentStockService) {}

  @Post()
  @ApiOperation({ summary: 'Crear stock de componente' })
  create(@Body() body: CreateComponentStockDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar stock de componentes' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener stock de componente por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar stock de componente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateComponentStockDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar stock de componente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
