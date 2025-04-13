import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PurchasesService } from './purchases.service';

@Module({
  controllers: [PurchasesController],
  providers: [PrismaService, PurchasesService],
})
export class PurchasesModule {}
