import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTechnicianDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashed,
        technician: {
          create: {
            specialty: data.specialty,
            active: data.active,
          },
        },
      },
      include: { technician: true },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { technician: { isNot: null } },
      include: { technician: true },
      orderBy: {
        id: 'asc',
      },
    });

    return users.map(({ password, ...rest }) => {
      const { technician, id: idUser, ...user } = rest;
      const { id, active, specialty } = technician;

      return {
        id,
        idUser,
        ...user,
        active,
        specialty,
      };
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { technician: true },
    });

    if (!user || !user.technician)
      throw new NotFoundException('Técnico no encontrado');

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, data: UpdateTechnicianDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { technician: true },
    });

    if (!user || !user.technician)
      throw new NotFoundException('Técnico no encontrado');

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
        firstLogin: !!data.password,
        technician: {
          update: {
            specialty: data.specialty,
            active: data.active,
          },
        },
      },
      include: { technician: true },
    });

    const { password, ...result } = updated;
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { technician: true },
    });

    if (!user || !user.technician)
      throw new NotFoundException('Técnico no encontrado');

    await this.prisma.technician.delete({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'Técnico eliminado correctamente' };
  }
}
