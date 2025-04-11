import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async totalTickets() {
    return this.prisma.supportTicket.count();
  }

  async statusCounts() {
    const [pending, inProgress, completed] = await Promise.all([
      this.prisma.supportTicket.count({ where: { status: 'pending' } }),
      this.prisma.supportTicket.count({ where: { status: 'in_progress' } }),
      this.prisma.supportTicket.count({ where: { status: 'completed' } }),
    ]);
    return { pending, inProgress, completed };
  }

  async lowStockComponents() {
    const stocks = await this.prisma.componentStock.findMany({
      where: { stock: { lte: 5 } },
      select: {
        id: true,
        component: { select: { name: true } },
        stock: true,
      },
    });
    return stocks.map(cs => ({
      id: cs.id,
      name: cs.component.name,
      stock: cs.stock,
    }));
  }

  async commonFailures() {
    const tickets = await this.prisma.supportTicket.findMany({
      select: { problemDescription: true },
    });

    const map = {};
    tickets.forEach(t => {
      const key = t.problemDescription.trim();
      if (key) map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  async avgRepairTimes() {
    const repairs = await this.prisma.repair.findMany({
      where: { endDate: { not: null } },
      select: { startDate: true, endDate: true },
    });

    const map = {};
    repairs.forEach(r => {
      const days = Math.round(
        (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      map[`${days} días`] = (map[`${days} días`] || 0) + 1;
    });

    return map;
  }

  async highPriorityTickets() {
    return this.prisma.supportTicket.findMany({
      where: { priority: 'high' },
      select: { id: true, requestDate: true },
    });
  }

  async getAdminStats() {
    const [totalTickets, byStatus, lowStock, failures, avgTimes, highPriority] = await Promise.all([
      this.totalTickets(),
      this.statusCounts(),
      this.lowStockComponents(),
      this.commonFailures(),
      this.avgRepairTimes(),
      this.highPriorityTickets(),
    ]);

    return {
      totalTickets,
      byStatus,
      lowStockComponents: lowStock,
      commonFailures: failures,
      avgRepairTimes: avgTimes,
      highPriorityTickets: highPriority,
    };
  }
}
