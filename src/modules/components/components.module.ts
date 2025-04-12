import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ComponentService } from './components.service';
import { ComponentController } from './components.controller';

@Module({
  controllers: [ComponentController],
  providers: [PrismaService, ComponentService],
})
export class ComponentsModule {}
