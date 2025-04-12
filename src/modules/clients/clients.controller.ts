import { Body, Controller, Patch, Post, Param, Get, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateClientDto } from './dto/update-client.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cliente' })
  create(@Body() body: CreateClientDto) {
    return this.clientsService.create(body);
  }

  @Patch(':id_usuario')
  @ApiOperation({ summary: 'Actualizar cliente por ID de usuario' })
  update(
    @Param('id_usuario', ParseIntPipe) id: number,
    @Body() body: UpdateClientDto,
  ) {
    return this.clientsService.update(id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Delete(':id')
    @ApiOperation({ summary: 'Eliminar cliente por ID' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.clientsService.remove(id);
    }

}
