import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @ApiOperation({ summary: 'Dashboard resumen completo' })
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('total-tickets')
  @ApiOperation({ summary: 'Total de solicitudes' })
  getTotalTickets() {
    return this.dashboardService.totalTickets();
  }

  @Get('status-counts')
  @ApiOperation({ summary: 'Solicitudes por estado' })
  getStatusCounts() {
    return this.dashboardService.statusCounts();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Piezas con stock bajo' })
  getLowStock() {
    return this.dashboardService.lowStockComponents();
  }

  @Get('common-failures')
  @ApiOperation({ summary: 'Fallas más comunes' })
  getCommonFailures() {
    return this.dashboardService.commonFailures();
  }

  @Get('avg-repair-times')
  @ApiOperation({ summary: 'Tiempo promedio de reparación' })
  getAvgRepairTimes() {
    return this.dashboardService.avgRepairTimes();
  }

  @Get('high-priority')
  @ApiOperation({ summary: 'Tickets con prioridad alta' })
  getHighPriority() {
    return this.dashboardService.highPriorityTickets();
  }
}

