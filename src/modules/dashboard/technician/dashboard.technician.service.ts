import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class DashboardTechnicianService {
  constructor(private prisma: PrismaService) {}

  private async getTechnicianId(userId: number): Promise<number | null> {
    const tech = await this.prisma.technician.findFirst({
      where: { userId },
      select: { id: true },
    });
    return tech?.id ?? null;
  }

  async getTechnicianStats(userId: number) {
    const technicianId = await this.getTechnicianId(userId);
    if (!technicianId) return { message: 'Técnico no encontrado' };

    const [total, pending, inProgress, completed, recent] = await Promise.all([
      this.getTotalTickets(technicianId),
      this.getStatusCount(technicianId, TicketStatus.pending),
      this.getStatusCount(technicianId, TicketStatus.in_progress),
      this.getStatusCount(technicianId, TicketStatus.completed),
      this.getRecentTickets(technicianId),
    ]);

    return {
      totalTickets: total,
      byStatus: { pending, inProgress, completed },
      recentAssignedTickets: recent,
    };
  }

  async getTotalTickets(technicianId: number) {
    return this.prisma.supportTicket.count({
      where: { assignedTechnicianId: technicianId },
    });
  }

  async getStatusCount(technicianId: number, status: TicketStatus) {
    return this.prisma.supportTicket.count({
      where: {
        assignedTechnicianId: technicianId,
        status,
      },
    });
  }

  async getRecentTickets(technicianId: number) {
    const tickets = await this.prisma.supportTicket.findMany({
      where: { assignedTechnicianId: technicianId },
      orderBy: { id: 'asc' },
      take: 5,
      select: {
        id: true,
        requestDate: true,
        status: true,
        priority: true,
        customer: {
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
      customerName: t.customer.user.name,
      requestDate: t.requestDate,
      status: t.status,
      priority: t.priority,
    }));
  }
}
