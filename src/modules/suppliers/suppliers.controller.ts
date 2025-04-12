import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo proveedor y su usuario' })
  create(@Body() body: CreateSupplierDto) {
    return this.suppliersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar proveedor por ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar proveedor por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.remove(id);
  }
}
