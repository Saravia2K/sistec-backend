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
  import { TicketsService } from './tickets.service';
  import { CreateTicketDto } from './dto/create-ticket.dto';
  import { UpdateTicketDto } from './dto/update-ticket.dto';
  import { ApiTags, ApiOperation } from '@nestjs/swagger';
  
  @ApiTags('Tickets')
  @Controller('tickets')
  export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Crear nuevo ticket' })
    create(@Body() body: CreateTicketDto) {
      return this.ticketsService.create(body);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtener todos los tickets' })
    findAll() {
      return this.ticketsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtener ticket por ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.ticketsService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar ticket por ID' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateTicketDto,
    ) {
      return this.ticketsService.update(id, body);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar ticket por ID' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.ticketsService.remove(id);
    }
  }  