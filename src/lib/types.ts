import { Customer, Technician, User } from '@prisma/client';

export type TJWTPayload = {
  sub: number;
  role: 'admin' | 'customer' | 'technician';
};

export type TUser = User & {
  customer: Customer | null;
  technician: Technician | null;
};
