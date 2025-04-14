import { Module } from '@nestjs/common';
import { ComponentStockService } from './component-stock.service';
import { ComponentStockController } from './component-stock.controller';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Module({
  controllers: [ComponentStockController],
  providers: [ComponentStockService, PrismaService],
})
export class ComponentStockModule {}
