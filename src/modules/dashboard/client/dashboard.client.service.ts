import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { TicketStatus } from '@prisma/client'; // ✅ Importar el enum de Prisma

@Injectable()
export class DashboardClientService {
  constructor(private prisma: PrismaService) {}

  public async getCustomerId(userId: number): Promise<number | null> {

    const customer = await this.prisma.customer.findFirst({
      where: { userId },
      select: { id: true },
    });
    return customer?.id ?? null;
  }

  async getClientStats(userId: number) {
    const customerId = await this.getCustomerId(userId);
    if (!customerId) return { message: 'Cliente no encontrado' };

    const [total, pending, inProgress, completed, last3] = await Promise.all([
      this.getTotalTickets(customerId),
      this.getStatusCount(customerId, TicketStatus.pending),
      this.getStatusCount(customerId, TicketStatus.in_progress),
      this.getStatusCount(customerId, TicketStatus.completed),
      this.getRecentRequests(customerId),
    ]);

    return {
      totalTickets: total,
      byStatus: { pending, inProgress, completed },
      recentRequests: last3,
    };
  }

  async getTotalTickets(customerId: number) {
    return this.prisma.supportTicket.count({
      where: { customerId },
    });
  }

  async getStatusCount(customerId: number, status: TicketStatus) {
    return this.prisma.supportTicket.count({
      where: {
        customerId,
        status: status,
      },
    });
  }

  async getRecentRequests(customerId: number) {
    const tickets = await this.prisma.supportTicket.findMany({
      where: { customerId },
      orderBy: { id: 'desc' },
      take: 3,
      select: {
        id: true,
        requestDate: true,
        status: true,
        supportedDevices: { select: { name: true } },
        assignedTechnician: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return tickets.map((t) => ({
      id: t.id,
      deviceType: t.supportedDevices.name,
      requestDate: t.requestDate,
      assignedAgent: t.assignedTechnician?.user?.name ?? 'Sin asignar',
      status: t.status,
    }));
  }
}
