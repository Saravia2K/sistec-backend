import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';

@Injectable()
export class RepairsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRepairDto) {
    return this.prisma.repair.create({ data });
  }

  async findAll() {
    return this.prisma.repair.findMany({
      include: {
        supportTicket: true,
        usedComponents: true,
      },
    });
  }

  async findOne(id: number) {
    const repair = await this.prisma.repair.findUnique({
      where: { id },
      include: {
        supportTicket: true,
        usedComponents: true,
      },
    });
    if (!repair) throw new NotFoundException('Reparación no encontrada');
    return repair;
  }

  async updateRepair(
    supportTicketId: number,
    updateData: {
      diagnosis?: string;
      appliedSolution?: string;
      estimatedCost?: number;
      endDate?: Date | string;
      usedComponents?: Array<{
        componentStockId: number;
        quantity: number;
      }>;
    },
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Verificar que la reparación existe
      const repair = await prisma.repair.findUnique({
        where: { supportTicketId },
        include: {
          usedComponents: {
            include: {
              componentStock: true,
            },
          },
        },
      });

      if (!repair) {
        throw new BadRequestException(
          'Repair must be initiated by setting ticket status to in_progress first',
        );
      }

      // 2. Manejar usedComponents si se proporcionan
      if (updateData.usedComponents) {
        // Primero: Devolver al stock los componentes existentes
        for (const existingComponent of repair.usedComponents) {
          await prisma.componentStock.update({
            where: { id: existingComponent.componentStockId },
            data: {
              stock: {
                increment: existingComponent.quantity,
              },
            },
          });
        }

        // Eliminar componentes existentes
        await prisma.usedComponent.deleteMany({
          where: { repairId: repair.id },
        });

        // Crear nuevos componentes si hay
        if (updateData.usedComponents.length > 0) {
          await prisma.usedComponent.createMany({
            data: updateData.usedComponents.map((uc) => ({
              repairId: repair.id,
              componentStockId: uc.componentStockId,
              quantity: uc.quantity,
            })),
          });

          // Actualizar stocks (restar los nuevos componentes) y manejar inUse
          for (const component of updateData.usedComponents) {
            const updatedStock = await prisma.componentStock.update({
              where: { id: component.componentStockId },
              data: { stock: { decrement: component.quantity } },
              include: { component: true },
            });

            // Verificar si el stock llegó a 0
            if (updatedStock.stock <= 0) {
              // Buscar el siguiente stock disponible para el mismo componente
              const nextStock = await prisma.componentStock.findFirst({
                where: {
                  componentId: updatedStock.componentId,
                  id: { not: updatedStock.id },
                  stock: { gt: 0 },
                },
                orderBy: { unitPrice: 'asc' }, // Priorizar el más económico
              });

              if (nextStock) {
                // Actualizar los flags inUse
                await Promise.all([
                  prisma.componentStock.update({
                    where: { id: updatedStock.id },
                    data: { inUse: false },
                  }),
                  prisma.componentStock.update({
                    where: { id: nextStock.id },
                    data: { inUse: true },
                  }),
                ]);
              } else {
                // No hay más stock disponible, solo marcar este como no usable
                await prisma.componentStock.update({
                  where: { id: updatedStock.id },
                  data: { inUse: false },
                });
              }
            }
          }
        }
      }

      // 3. Actualizar datos básicos de la reparación
      const updatedRepair = await prisma.repair.update({
        where: { supportTicketId },
        data: {
          diagnosis: updateData.diagnosis,
          appliedSolution: updateData.appliedSolution,
          estimatedCost: updateData.estimatedCost,
          ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
        },
        include: {
          supportTicket: true,
          usedComponents: {
            include: {
              componentStock: {
                include: {
                  component: true,
                  supplier: true,
                },
              },
            },
          },
        },
      });

      return updatedRepair;
    });
  }

  async remove(id: number) {
    return this.prisma.repair.delete({
      where: { id },
    });
  }
}
