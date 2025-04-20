import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';

@Injectable()
export class DashboardAdminService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats() {
    const [
      totalTickets,
      pending,
      inProgress,
      completed,
      lowStockComponents,
      commonFailures,
      avgRepairTimes,
      highPriorityTickets,
    ] = await Promise.all([
      this.totalTickets(),
      this.statusCounts(),
      this.statusCounts('in_progress'),
      this.statusCounts('completed'),
      this.lowStockComponents(),
      this.commonFailures(),
      this.getAverageRepairTimes(),
      this.highPriorityTickets(),
    ]);

    return {
      totalTickets,
      byStatus: {
        pending,
        inProgress,
        completed,
      },
      lowStockComponents,
      commonFailures,
      avgRepairTimes,
      highPriorityTickets,
    };
  }

  async totalTickets() {
    return this.prisma.supportTicket.count();
  }

  async statusCounts(
    status: 'pending' | 'in_progress' | 'completed' = 'pending',
  ) {
    return this.prisma.supportTicket.count({ where: { status } });
  }

  async lowStockComponents() {
    return this.prisma.$queryRaw`
      SELECT
        CS.ID,
        C."name" AS component,
        S."name" AS supplier,
        CS.STOCK,
        CS."minimumStock",
        CS."unitPrice"
      FROM "ComponentStock" CS
      JOIN "Component" C ON cs."componentId" = c.ID
      JOIN "Supplier" S ON cs."supplierId" = s.ID
      WHERE cs.STOCK < cs."minimumStock"
    `;
  }

  async commonFailures() {
    const tickets = await this.prisma.supportTicket.findMany({
      select: { problemDescription: true },
    });

    const failureMap = {};

    tickets.forEach((t) => {
      const key = t.problemDescription.trim();
      if (key) failureMap[key] = (failureMap[key] || 0) + 1;
    });

    return failureMap;
  }

  async getAverageRepairTimes() {
    const repairs = await this.prisma.repair.findMany({
      where: { endDate: { not: null } },
      select: { startDate: true, endDate: true },
    });

    const repairMap = {};

    repairs.forEach((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const diff = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      repairMap[`${diff} días`] = (repairMap[`${diff} días`] || 0) + 1;
    });

    return repairMap;
  }

  async highPriorityTickets() {
    return this.prisma.supportTicket.findMany({
      where: { priority: 'high' },
      select: {
        id: true,
        requestDate: true,
      },
    });
  }
}
