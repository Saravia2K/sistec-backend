import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.supportTicket.findMany({
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        assignedTechnician: { include: { user: { select: { name: true } } } },
        deviceType: true,
      },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        customer: { select: { user: { select: { name: true, email: true } } } },
        assignedTechnician: { select: { user: { select: { name: true } } } },
        deviceType: true,
      },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }

  async update(id: number, data: UpdateTicketDto) {
    const exists = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Ticket no encontrado');

    return this.prisma.supportTicket.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Ticket no encontrado');

    return this.prisma.supportTicket.delete({ where: { id } });
  }

  async findTicketsByCustomer(customerId: number) {
    // Verificar si el cliente existe
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.prisma.supportTicket.findMany({
      where: { customerId },
      include: {
        deviceType: true,
        assignedTechnician: {
          include: {
            user: true,
          },
        },
        repair: true,
      },
      orderBy: {
        requestDate: 'desc', // Ordenar por fecha más reciente
      },
    });
  }

  async findTicketsByTechnician(technicianId: number) {
    // Verificar si el técnico existe
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException(
        `Technician with ID ${technicianId} not found`,
      );
    }

    return this.prisma.supportTicket.findMany({
      where: { assignedTechnicianId: technicianId },
      include: {
        deviceType: true,
        customer: {
          include: {
            user: true, // Para obtener datos del cliente
          },
        },
        repair: true,
      },
      orderBy: [
        { priority: 'desc' }, // Ordenar por prioridad (high primero)
        { requestDate: 'asc' }, // Luego por fecha más antigua
      ],
    });
  }
}
