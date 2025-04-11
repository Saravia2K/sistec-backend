import { Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/providers/prisma/prisma.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly prismaService : PrismaService){}

    @Post('login')
    login (){
        
    }
}