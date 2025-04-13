import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { SupportedDevicesService } from './supported-devices.service';
import { SupportedDevicesController } from './supported-devices.controller';

@Module({
  controllers: [SupportedDevicesController],
  providers: [PrismaService, SupportedDevicesService],
})
export class SupportedDevicesModule {}
