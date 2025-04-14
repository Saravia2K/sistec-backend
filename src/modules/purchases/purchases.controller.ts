import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PurchaseResponseDto } from './dto/purchase-response.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';

@ApiTags('Purchases')
@ApiBearerAuth()
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva compra' })
  @ApiResponse({
    status: 201,
    description: 'Compra creada',
    type: PurchaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreatePurchaseDto })
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create(createPurchaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las compras (con relaciones)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras',
    type: [PurchaseResponseDto],
  })
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compra por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la compra' })
  @ApiResponse({
    status: 200,
    description: 'Compra encontrada',
    type: PurchaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una compra' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la compra' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la compra actualizado',
    type: PurchaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseStatusDto,
  ) {
    return this.purchasesService.updatePurchaseStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una compra' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la compra' })
  @ApiResponse({
    status: 200,
    description: 'Compra eliminada',
    type: PurchaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(+id);
  }
}
