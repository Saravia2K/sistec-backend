import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketPriority, TicketStatus } from '@prisma/client';

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
      orderBy: {
        requestDate: 'desc',
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
        repair: {
          include: {
            usedComponents: {
              include: {
                componentStock: {
                  include: {
                    component: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }

  async updateTicket(id: number, updateData: UpdateTicketDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Verificar si el ticket existe
      const existingTicket = await prisma.supportTicket.findUnique({
        where: { id },
        include: {
          assignedTechnician: true,
          repair: true, // Incluimos la reparación en la consulta
        },
      });

      if (!existingTicket) {
        throw new NotFoundException(`Support ticket with ID ${id} not found`);
      }

      // Validar técnico asignado (si se proporciona)
      if (updateData.assignedTechnicianId !== undefined) {
        if (updateData.assignedTechnicianId !== null) {
          const technician = await prisma.technician.findUnique({
            where: { id: updateData.assignedTechnicianId },
          });
          if (!technician) {
            throw new NotFoundException(
              `Technician with ID ${updateData.assignedTechnicianId} not found`,
            );
          }
        }
      }

      // Crear reparación si el estado cambia a in_progress y no existe
      if (
        updateData.status === TicketStatus.in_progress &&
        !existingTicket.repair
      ) {
        await prisma.repair.create({
          data: {
            supportTicketId: id,
            startDate: new Date(),
          },
        });
      }

      // Actualizar el ticket
      return prisma.supportTicket.update({
        where: { id },
        data: {
          assignedTechnicianId: updateData.assignedTechnicianId,
          status: updateData.status,
          priority: updateData.priority,
          problemDescription: updateData.problemDescription,
          brand: updateData.brand,
          model: updateData.model,
          serialNumber: updateData.serialNumber,
          // Si el estado cambia a "completed", establecer fecha de cierre
          ...(updateData.status === TicketStatus.completed &&
            !existingTicket.closeDate && {
              closeDate: new Date(),
            }),
        },
        include: {
          deviceType: true,
          assignedTechnician: {
            include: {
              user: true,
            },
          },
          customer: {
            include: {
              user: true,
            },
          },
          repair: true, // Incluimos la reparación en la respuesta
        },
      });
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
