import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './providers/prisma/prisma.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { ClientsService } from './modules/clients/clients.service';
import { SuppliersModule } from './modules/suppliers/suppliers.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DashboardModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    TechniciansModule,
    SuppliersModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
