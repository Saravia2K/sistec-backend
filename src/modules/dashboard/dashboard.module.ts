import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { DashboardAdminService } from './admin/dashboard.admin.service';
import { DashboardClientService } from './client/dashboard.client.service';

@Module({
  controllers: [DashboardController],
  providers: [
    PrismaService,
    DashboardAdminService,
    DashboardClientService,
  ],
})
export class DashboardModule {}
