import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        Customer: true,
        Technician: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...userData } = user;

    const payload = {
      sub: user.id,
      role: user.Customer.length ? 'customer' : user.Technician.length ? 'technician' : 'none',
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token,
      user: userData,
    };
  }
}
