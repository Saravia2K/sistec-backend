import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateComponentStockDto } from './dto/create-component-stock.dto';
import { UpdateComponentStockDto } from './dto/update-component-stock.dto';

@Injectable()
export class ComponentStockService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateComponentStockDto) {
    return this.prisma.componentStock.create({ data });
  }

  async findAll() {
    return this.prisma.componentStock.findMany({
      include: {
        component: true,
        supplier: true,
      },
      orderBy: {
        component: {
          name: 'asc',
        },
      },
    });
  }

  async findOne(id: number) {
    const found = await this.prisma.componentStock.findUnique({
      where: { id },
      include: {
        component: true,
        supplier: true,
      },
    });
    if (!found) throw new NotFoundException('ComponentStock no encontrado');
    return found;
  }

  async update(id: number, data: UpdateComponentStockDto) {
    return this.prisma.componentStock.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.componentStock.delete({
      where: { id },
    });
  }
}
