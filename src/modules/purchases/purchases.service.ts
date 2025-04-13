import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Crear la compra
      const purchase = await prisma.purchase.create({
        data: {
          ...createPurchaseDto,
          purchaseDate: new Date(createPurchaseDto.purchaseDate),
          deliveryDate: createPurchaseDto.deliveryDate
            ? new Date(createPurchaseDto.deliveryDate)
            : null,
        },
      });

      // 2. Buscar ComponentStock existente con mismo componentId y unitPrice
      const existingStock = await prisma.componentStock.findFirst({
        where: {
          componentId: createPurchaseDto.componentId,
          unitPrice: createPurchaseDto.unitPrice,
        },
      });

      // 3. Verificar si hay algún ComponentStock del mismo componente con inUse: true
      const componentHasInUseStock = await prisma.componentStock.findFirst({
        where: {
          componentId: createPurchaseDto.componentId,
          inUse: true,
        },
      });

      if (existingStock) {
        // Actualizar stock existente
        await prisma.componentStock.update({
          where: { id: existingStock.id },
          data: {
            stock: existingStock.stock + createPurchaseDto.quantity,
            // Mantener el mismo inUse que ya tenía
          },
        });
      } else {
        // Crear nuevo ComponentStock
        await prisma.componentStock.create({
          data: {
            componentId: createPurchaseDto.componentId,
            supplierId: createPurchaseDto.supplierId,
            stock: createPurchaseDto.quantity,
            unitPrice: createPurchaseDto.unitPrice,
            minimumStock: 5, // Valor por defecto
            inUse: !componentHasInUseStock, // true si no hay ningún stock en uso
          },
        });
      }

      return purchase;
    });
  }

  async findAll() {
    return this.prisma.purchase.findMany({
      select: {
        id: true,
        supplier: true,
        component: true,
        quantity: true,
        unitPrice: true,
        purchaseDate: true,
        deliveryDate: true,
        details: true,
        status: true,
      },
    });
  }

  async findOne(id: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return purchase;
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Obtener la compra original
      const originalPurchase = await prisma.purchase.findUnique({
        where: { id },
      });

      if (!originalPurchase) {
        throw new NotFoundException(`Purchase with ID ${id} not found`);
      }

      // 2. Actualizar la compra
      const updatedPurchase = await prisma.purchase.update({
        where: { id },
        data: {
          ...updatePurchaseDto,
          deliveryDate:
            updatePurchaseDto.status == PurchaseStatus.completed
              ? new Date()
              : undefined,
        },
      });

      // 3. Si cambió la cantidad o el componente/precio, actualizar stocks
      if (
        updatePurchaseDto.quantity !== undefined ||
        updatePurchaseDto.componentId !== undefined ||
        updatePurchaseDto.unitPrice !== undefined
      ) {
        const newQuantity =
          updatePurchaseDto.quantity ?? originalPurchase.quantity;
        const newComponentId =
          updatePurchaseDto.componentId ?? originalPurchase.componentId;
        const newUnitPrice =
          updatePurchaseDto.unitPrice ?? originalPurchase.unitPrice;

        // Restar del stock original
        if (originalPurchase.componentId && originalPurchase.unitPrice) {
          const originalStock = await prisma.componentStock.findFirst({
            where: {
              componentId: originalPurchase.componentId,
              unitPrice: originalPurchase.unitPrice,
            },
          });

          if (originalStock) {
            await prisma.componentStock.update({
              where: { id: originalStock.id },
              data: {
                stock: originalStock.stock - originalPurchase.quantity,
              },
            });
          }
        }

        // Sumar al nuevo stock
        const newStock = await prisma.componentStock.findFirst({
          where: {
            componentId: newComponentId,
            unitPrice: newUnitPrice,
          },
        });

        if (newStock) {
          await prisma.componentStock.update({
            where: { id: newStock.id },
            data: {
              stock: newStock.stock + newQuantity,
            },
          });
        } else {
          // Verificar si hay algún ComponentStock del mismo componente con inUse: true
          const componentHasInUseStock = await prisma.componentStock.findFirst({
            where: {
              componentId: newComponentId,
              inUse: true,
            },
          });

          await prisma.componentStock.create({
            data: {
              componentId: newComponentId,
              supplierId: originalPurchase.supplierId,
              stock: newQuantity,
              unitPrice: newUnitPrice,
              minimumStock: 5,
              inUse: !componentHasInUseStock,
            },
          });
        }
      }

      return updatedPurchase;
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      const purchase = await prisma.purchase.findUnique({
        where: { id },
      });

      if (!purchase) {
        throw new NotFoundException(`Purchase with ID ${id} not found`);
      }

      // Restar del stock asociado
      const componentStock = await prisma.componentStock.findFirst({
        where: {
          componentId: purchase.componentId,
          unitPrice: purchase.unitPrice,
        },
      });

      if (componentStock) {
        await prisma.componentStock.update({
          where: { id: componentStock.id },
          data: {
            stock: componentStock.stock - purchase.quantity,
          },
        });
      }

      // Eliminar la compra
      return prisma.purchase.delete({
        where: { id },
      });
    });
  }
}
