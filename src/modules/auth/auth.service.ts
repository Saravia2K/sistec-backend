import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Customer, Technician, User } from '@prisma/client';
import { TJWTPayload } from 'src/lib/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginAuthDto) {
    let hash = process.env.ADMIN_PASSWORD;
    let user: User & {
      customer: Customer | null;
      technician: Technician | null;
    };
    const isAdmin = email == 'admin@email.com';
    if (isAdmin) {
      user = {
        id: 0,
        name: 'Admin',
        email: 'admin@email.com',
        firstLogin: false,
        phone: '00000000',
        password: '',
        customer: null,
        technician: null,
      };
    } else {
      user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          customer: true,
          technician: true,
        },
      });

      if (!user) throw new UnauthorizedException('Credenciales inválidas');

      hash = user.password;
    }

    const passwordMatch = await bcrypt.compare(password, hash);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...userData } = user;

    const payload: TJWTPayload = {
      sub: user.id,
      role: isAdmin
        ? 'admin'
        : user.customer != null
          ? 'customer'
          : 'technician',
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token,
      user: userData,
    };
  }
}
