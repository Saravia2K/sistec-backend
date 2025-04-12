import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ComponentResponseDto } from './dto/component-response.dto';
import { ComponentService } from './components.service';

@ApiTags('Components') // Agrupa endpoints en Swagger UI
@ApiBearerAuth() // Si usas autenticación
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo componente' })
  @ApiResponse({
    status: 201,
    description: 'Componente creado',
    type: ComponentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateComponentDto })
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentService.create(createComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los componentes visibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de componentes',
    type: [ComponentResponseDto],
  })
  findAll() {
    return this.componentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un componente por ID' })
  @ApiParam({ name: 'id', description: 'ID del componente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Componente encontrado',
    type: ComponentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un componente' })
  @ApiParam({ name: 'id', description: 'ID del componente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Componente actualizado',
    type: ComponentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  @ApiBody({ type: UpdateComponentDto })
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    return this.componentService.update(+id, updateComponentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (ocultar) un componente' })
  @ApiParam({ name: 'id', description: 'ID del componente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Componente marcado como no visible',
    type: ComponentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  remove(@Param('id') id: string) {
    return this.componentService.remove(+id);
  }
}
