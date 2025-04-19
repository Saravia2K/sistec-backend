import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import ReportsService from './reports.service';

@Controller('/reports')
export default class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/devices/frequent-failures')
  @ApiOperation({
    summary: 'Fallas más frecuentes por tipo de dispositivo.',
  })
  async getMostFrequentFailuresByDevice() {
    return this.reportsService.getMostFrequentFailuresByDevice();
  }

  @Get('components/most-used')
  @ApiOperation({
    summary: 'Obtiene los 5 componentes más utilizados en reparaciones',
  })
  @ApiResponse({ status: 200, description: 'Lista de componentes más usados' })
  async getMostUsedComponents() {
    return this.reportsService.getMostUsedComponents();
  }

  @Get('component-demand')
  @ApiOperation({
    summary: 'Obtiene la proyección de demanda de componentes',
  })
  @ApiResponse({ status: 200, description: 'Lista de proyección' })
  async getComponentDemandProjection() {
    return this.reportsService.getComponentDemandProjection();
  }
}
