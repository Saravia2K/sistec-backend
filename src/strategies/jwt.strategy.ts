import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJWTPayload } from 'src/lib/types';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecreto',
    });
  }

  async validate(payload: TJWTPayload) {
    if (payload.role == 'admin') {
      return {
        id: 0,
        name: 'Admin',
        email: 'admin@email.com',
        firstLogin: false,
        phone: '00000000',
        password: '',
        customer: null,
        technician: null,
      };
    }

    return await this.prismaService.user.findFirst({
      where: { id: payload.sub },
      include: {
        customer: true,
        technician: true,
      },
    });
  }
}
