import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSupplierDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashed,
        // Si tienes relación user -> supplier puedes agregarla aquí
      },
    });

    const supplier = await this.prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
    });

    return { message: 'Proveedor y usuario creados', user, supplier };
  }

  async findAll() {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');
    return supplier;
  }

  async update(id: number, data: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');

    const updateUser: any = {
      name: data.name,
      phone: data.phone,
      email: data.email,
    };

    if (data.password) {
      const user = await this.prisma.user.findUnique({ where: { email: supplier.email } });
      if (user) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            ...updateUser,
            password: await bcrypt.hash(data.password, 10),
          },
        });
      }
    }

    return this.prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
    });
  }

  async remove(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');

    await this.prisma.supplier.delete({ where: { id } });

    // Eliminar usuario con el mismo email
    const user = await this.prisma.user.findUnique({ where: { email: supplier.email } });
    if (user) await this.prisma.user.delete({ where: { id: user.id } });

    return { message: 'Proveedor y usuario eliminados correctamente' };
  }
}
