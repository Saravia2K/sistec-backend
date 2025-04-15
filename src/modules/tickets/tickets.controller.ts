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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Actualizar información de un ticket' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del ticket' })
  @ApiResponse({ status: 404, description: 'Ticket o técnico no encontrado' })
  @ApiBody({ type: UpdateTicketDto })
  async updateTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ticket por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Obtener todos los tickets de un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lista de tickets del cliente',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getCustomerTickets(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return await this.ticketsService.findTicketsByCustomer(customerId);
  }

  @Get('technician/:technicianId')
  @ApiOperation({
    summary:
      'Obtener todos los tickets asignados a un técnico (ordenados por prioridad)',
  })
  @ApiParam({ name: 'technicianId', description: 'ID del técnico', example: 1 })
  @ApiResponse({ status: 404, description: 'Técnico no encontrado' })
  async getTechnicianTickets(
    @Param('technicianId', ParseIntPipe) technicianId: number,
  ) {
    return (
      await this.ticketsService.findTicketsByTechnician(technicianId)
    ).map((ticket) => {
      const { customer, ...rest } = ticket;
      const { user, ...restCustomer } = customer;
      return {
        ...rest,
        customer: {
          ...user,
          ...restCustomer,
        },
      };
    });
  }
}
