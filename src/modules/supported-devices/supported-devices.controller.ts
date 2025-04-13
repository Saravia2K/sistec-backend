import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SupportedDevicesService } from './supported-devices.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SupportedDeviceResponseDto } from './dto/supported-device-response.dto';
import { CreateSupportedDeviceDto } from './dto/create-supported-device.dto';
import { UpdateSupportedDeviceDto } from './dto/update-supported-device.dto';

@ApiTags('Supported Devices')
@ApiBearerAuth()
@Controller('supported-devices')
export class SupportedDevicesController {
  constructor(
    private readonly supportedDevicesService: SupportedDevicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de dispositivo soportado' })
  @ApiResponse({
    status: 201,
    description: 'Dispositivo creado',
    type: SupportedDeviceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateSupportedDeviceDto })
  create(@Body() createSupportedDeviceDto: CreateSupportedDeviceDto) {
    return this.supportedDevicesService.create(createSupportedDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los dispositivos soportados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de dispositivos',
    type: [SupportedDeviceResponseDto],
  })
  findAll() {
    return this.supportedDevicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un dispositivo por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del dispositivo' })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo encontrado',
    type: SupportedDeviceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.supportedDevicesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un dispositivo' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del dispositivo' })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo actualizado',
    type: SupportedDeviceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  @ApiBody({ type: UpdateSupportedDeviceDto })
  update(
    @Param('id') id: string,
    @Body() updateSupportedDeviceDto: UpdateSupportedDeviceDto,
  ) {
    return this.supportedDevicesService.update(+id, updateSupportedDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un dispositivo' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del dispositivo' })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo eliminado',
    type: SupportedDeviceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  remove(@Param('id') id: string) {
    return this.supportedDevicesService.remove(+id);
  }
}
