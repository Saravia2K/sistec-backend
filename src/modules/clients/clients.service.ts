import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('El correo ya existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        customer: {
          create: {
            address: data.address,
          },
        },
      },
      include: {
        customer: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, data: UpdateClientDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!user || !user.customer)
      throw new NotFoundException('Cliente no encontrado');

    const updateData: any = {
      name: data.name,
      phone: data.phone,
      email: data.email,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        customer: {
          update: {
            address: data.address,
          },
        },
      },
      include: { customer: true },
    });

    const { password, ...result } = updated;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany ({
        where: {customer: { isNot: null }},
        include: { customer: true },
    })

    return users.map(({password, ...rest}) => rest);
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!user || !user.customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    await this.prisma.customer.delete({
      where: { userId: id },
    });

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Cliente eliminado correctamente' };
  }

}
