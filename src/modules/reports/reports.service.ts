import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { IDeviceFailureRank, IMostUsedComponent } from './reports.interfaces';

@Injectable()
export default class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMostFrequentFailuresByDevice() {
    const ranks = await this.prisma.$queryRaw<IDeviceFailureRank[]>`
      WITH RankedFailures AS (
          SELECT 
              SD.name AS device,
              C.name AS component,
              COUNT(*) AS failure_count,
              ROW_NUMBER() OVER (PARTITION BY SD.name ORDER BY COUNT(*) DESC) AS rank
          FROM "SupportedDevices" SD
          JOIN "SupportTicket" ST ON SD.id = ST."deviceTypeId"
          JOIN "Repair" R ON ST.id = R."supportTicketId"
          JOIN "UsedComponent" UC ON R.id = UC."repairId"
          JOIN "ComponentStock" CS ON UC."componentStockId" = CS.id
          JOIN "Component" C ON CS."componentId" = C.id
          WHERE ST.status = 'completed'
          GROUP BY SD.name, C.name
      )
      SELECT 
          device,
          component,
          failure_count
      FROM RankedFailures
      WHERE rank <= 5
      ORDER BY device, failure_count DESC;
    `;

    return ranks.reduce(
      (devices, rank) => {
        const { device, component, failure_count } = rank;
        if (!devices[device]) {
          devices[device] = [];
        }

        devices[device].push({
          component,
          failure_count: Number(failure_count),
        });

        return devices;
      },
      {} as { [k: string]: { component: string; failure_count: number }[] },
    );
  }

  async getMostUsedComponents() {
    const components = await this.prisma.$queryRaw<IMostUsedComponent[]>`
      SELECT
          c.id AS component_id,
          c.name AS component_name,
          COUNT(uc.id) AS times_used,
          SUM(uc.quantity) AS total_units_used
      FROM "Component" c
      JOIN "ComponentStock" cs ON c.id = cs."componentId"
      JOIN "UsedComponent" uc ON cs.id = uc."componentStockId"
      GROUP BY c.id, c.name
      ORDER BY total_units_used DESC, times_used DESC
      LIMIT 10;
    `;

    return components.map((c) => ({
      component_id: Number(c.component_id),
      component_name: c.component_name,
      times_used: Number(c.times_used),
      total_units_used: Number(c.total_units_used),
    }));
  }

  async getComponentDemandProjection() {
    // Obtener datos históricos (últimos 6 meses)
    const historicalData = await this.prisma.$queryRaw`
      SELECT 
        c.id,
        c.name AS component_name,
        DATE_TRUNC('month', r."startDate") AS month,
        SUM(uc.quantity) AS units_used
      FROM "Component" c
      JOIN "ComponentStock" cs ON c.id = cs."componentId"
      JOIN "UsedComponent" uc ON cs.id = uc."componentStockId"
      JOIN "Repair" r ON uc."repairId" = r.id
      WHERE r."startDate" >= (NOW() - INTERVAL '6 months')
      GROUP BY c.id, c.name, DATE_TRUNC('month', r."startDate")
      ORDER BY c.name, month
    `;

    // Obtener proyección (próximos 3 meses - versión corregida)
    const projectionData = await this.prisma.$queryRaw`
      WITH monthly_avg AS (
        SELECT 
          c.id,
          c.name AS component_name,
          AVG(uc.quantity) AS avg_usage,
          COUNT(uc.id) AS repair_count
        FROM "Component" c
        JOIN "ComponentStock" cs ON c.id = cs."componentId"
        JOIN "UsedComponent" uc ON cs.id = uc."componentStockId"
        JOIN "Repair" r ON uc."repairId" = r.id
        WHERE r."startDate" >= (NOW() - INTERVAL '6 months')
        GROUP BY c.id, c.name
      )
      SELECT 
        m.id,
        m.component_name,
        DATE_TRUNC('month', NOW() + (months.month || ' months')::INTERVAL) AS month,
        (m.avg_usage * (1 + m.repair_count/100.0))::INTEGER AS projected_units
      FROM monthly_avg m
      CROSS JOIN (SELECT generate_series(1, 3) AS month) months
      ORDER BY m.component_name, month
    `;

    // Obtener stock actual
    const currentStock = await this.prisma.componentStock.findMany({
      select: {
        componentId: true,
        stock: true,
        minimumStock: true,
        component: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      historical: historicalData,
      projection: projectionData,
      stock: currentStock,
    };
  }
}
