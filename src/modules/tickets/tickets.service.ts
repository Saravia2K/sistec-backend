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
        customer: { select: { user: { select: { name: true, email: true } } } },
        assignedTechnician: { select: { user: { select: { name: true } } } },
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
    const exists = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Ticket no encontrado');

    return this.prisma.supportTicket.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Ticket no encontrado');

    return this.prisma.supportTicket.delete({ where: { id } });
  }
}