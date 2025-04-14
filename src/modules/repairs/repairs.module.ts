import { Module } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Module({
  controllers: [RepairsController],
  providers: [RepairsService, PrismaService],
})
export class RepairsModule {}
