import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class ComponentService {
  constructor(private prisma: PrismaService) {}

  async create(createComponentDto: CreateComponentDto) {
    return this.prisma.component.create({
      data: createComponentDto,
    });
  }

  async findAll() {
    return this.prisma.component.findMany();
  }

  async findOne(id: number) {
    const component = await this.prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return component;
  }

  async update(id: number, updateComponentDto: UpdateComponentDto) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.component.update({
      where: { id },
      data: updateComponentDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Eliminación lógica (mejor que borrado físico)
    return this.prisma.component.update({
      where: { id },
      data: { visible: false },
    });
  }
}
