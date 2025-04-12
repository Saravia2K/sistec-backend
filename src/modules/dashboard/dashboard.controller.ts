import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardAdminService } from './admin/dashboard.admin.service';
import { DashboardClientService } from './client/dashboard.client.service';
import { DashboardTechnicianService } from './technician/dashboard.technician.service';

import { User } from 'src/decorators/user.decorator';
import { TUser } from 'src/lib/types';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly adminService: DashboardAdminService,
    private readonly clientService: DashboardClientService,
    private readonly technicianService: DashboardTechnicianService,
  ) {}

  //#region Admin
  @Get('admin')
  @ApiOperation({ summary: 'Dashboard general de administrador' })
  getAdminDashboard() {
    return this.adminService.getAdminStats();
  }

  @Get('admin/total')
  @ApiOperation({ summary: 'Total de tickets' })
  getTotalTickets() {
    return this.adminService.totalTickets();
  }

  @Get('admin/status')
  @ApiOperation({ summary: 'Tickets por estado' })
  getStatusCounts() {
    return this.adminService.statusCounts();
  }

  @Get('admin/low-stock')
  @ApiOperation({ summary: 'Componentes con stock bajo' })
  getLowStock() {
    return this.adminService.lowStockComponents();
  }

  @Get('admin/failures')
  @ApiOperation({ summary: 'Fallas más comunes' })
  getCommonFailures() {
    return this.adminService.commonFailures();
  }

  @Get('admin/avg-times')
  @ApiOperation({ summary: 'Tiempos promedio de reparación' })
  getAverageTimes() {
    return this.adminService.getAverageRepairTimes();
  }

  @Get('admin/high-priority')
  @ApiOperation({ summary: 'Tickets con prioridad alta' })
  getHighPriorityTickets() {
    return this.adminService.highPriorityTickets();
  }
  //#endregion

  //#region Clients
  @Get('client')
  @ApiOperation({ summary: 'Dashboard completo del cliente autenticado' })
  getClientDashboard(@User() user: TUser) {
    return this.clientService.getClientStats(user.id);
  }

  @Get('client/total')
  @ApiOperation({ summary: 'Total de solicitudes del cliente' })
  async getClientTotal(@User() user: TUser) {
    const id = await this.clientService.getCustomerId(user.id);
    if (!id) return { message: 'Cliente no encontrado' };
    return this.clientService.getTotalTickets(id);
  }

  @Get('client/status')
  @ApiOperation({ summary: 'Solicitudes por estado del cliente' })
  async getClientStatus(@User() user: TUser) {
    const id = await this.clientService.getCustomerId(user.id);
    if (!id) return { message: 'Cliente no encontrado' };

    const [pending, inProgress, completed] = await Promise.all([
      this.clientService.getStatusCount(id, 'pending'),
      this.clientService.getStatusCount(id, 'in_progress'),
      this.clientService.getStatusCount(id, 'completed'),
    ]);

    return {
      pending,
      inProgress,
      completed,
    };
  }

  @Get('client/recent')
  @ApiOperation({ summary: 'Últimas 3 solicitudes del cliente' })
  async getClientRecent(@User() user: TUser) {
    const id = await this.clientService.getCustomerId(user.id);
    if (!id) return { message: 'Cliente no encontrado' };
    return this.clientService.getRecentRequests(id);
  }
  //#endregion

  //#region Technicians
  @Get('technician')
  @ApiOperation({ summary: 'Dashboard del técnico autenticado' })
  getTechnicianStats(@User() user: TUser) {
    return this.technicianService.getTechnicianStats(user.id);
  }
  //#endregion
}
