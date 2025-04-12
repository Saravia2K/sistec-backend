import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from '../../providers/prisma/prisma.service';



@Module({
    controllers: [ClientsController],
    providers: [ClientsService, PrismaService],
    exports: [ClientsService],
    imports: [],
})
export class ClientsModule {}
