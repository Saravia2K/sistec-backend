import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';

@Injectable()
export class RepairsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRepairDto) {
    return this.prisma.repair.create({ data });
  }

  async findAll() {
    return this.prisma.repair.findMany({
      include: {
        supportTicket: true,
        usedComponents: true,
      },
    });
  }

  async findOne(id: number) {
    const repair = await this.prisma.repair.findUnique({
      where: { id },
      include: {
        supportTicket: true,
        usedComponents: true,
      },
    });
    if (!repair) throw new NotFoundException('Reparación no encontrada');
    return repair;
  }

  async update(id: number, data: UpdateRepairDto) {
    return this.prisma.repair.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.repair.delete({
      where: { id },
    });
  }
}
