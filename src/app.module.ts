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
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { ComponentsModule } from './modules/components/components.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { SupportedDevicesModule } from './modules/supported-devices/supported-devices.module';
import { RepairsModule } from './modules/repairs/repairs.module';
import { ComponentStockModule } from './modules/component-stock/component-stock.module';
import { ReportsModule } from './modules/reports/reports.module';

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
    TicketsModule,
    ComponentsModule,
    PurchasesModule,
    SupportedDevicesModule,
    RepairsModule,
    ComponentStockModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
