import { Module } from '@nestjs/common';
import ReportsController from './reports.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import ReportsService from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [PrismaService, ReportsService],
})
export class ReportsModule {}
