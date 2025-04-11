import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardAdminService } from './admin/dashboard.admin.service';
import { DashboardClientService } from './client/dashboard.client.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly adminService: DashboardAdminService,
    private readonly clientService: DashboardClientService,
  ) {}

  // admin
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

  // client
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('client')
  @ApiOperation({ summary: 'Dashboard completo del cliente autenticado' })
  getClientDashboard(@Request() req) {
    return this.clientService.getClientStats(req.user.id);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('client/total')
  @ApiOperation({ summary: 'Total de solicitudes del cliente' })
  async getClientTotal(@Request() req) {
    const id = await this.clientService.getCustomerId(req.user.id);
    if (!id) return { message: 'Cliente no encontrado' };
    return this.clientService.getTotalTickets(id);
  }
  
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('client/status')
  @ApiOperation({ summary: 'Solicitudes por estado del cliente' })
  async getClientStatus(@Request() req) {
    const id = await this.clientService.getCustomerId(req.user.id);
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
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('client/recent')
  @ApiOperation({ summary: 'Últimas 3 solicitudes del cliente' })
  async getClientRecent(@Request() req) {
    const id = await this.clientService.getCustomerId(req.user.id);
    if (!id) return { message: 'Cliente no encontrado' };
    return this.clientService.getRecentRequests(id);
  }
  
  
}
