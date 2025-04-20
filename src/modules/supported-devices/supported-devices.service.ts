import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupportedDeviceDto } from './dto/create-supported-device.dto';
import { UpdateSupportedDeviceDto } from './dto/update-supported-device.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class SupportedDevicesService {
  constructor(private prisma: PrismaService) {}

  async create(createSupportedDeviceDto: CreateSupportedDeviceDto) {
    return this.prisma.supportedDevices.create({
      data: createSupportedDeviceDto,
    });
  }

  async findAll() {
    return this.prisma.supportedDevices.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const device = await this.prisma.supportedDevices.findUnique({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException(`Supported device with ID ${id} not found`);
    }
    return device;
  }

  async update(id: number, updateSupportedDeviceDto: UpdateSupportedDeviceDto) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.supportedDevices.update({
      where: { id },
      data: updateSupportedDeviceDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.supportedDevices.delete({
      where: { id },
    });
  }
}
