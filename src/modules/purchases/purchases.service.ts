import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Purchase, PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  //#region Public fuinctions
  async create(createPurchaseDto: CreatePurchaseDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Crear la compra
      const purchase = await prisma.purchase.create({
        data: {
          ...createPurchaseDto,
          purchaseDate: new Date(createPurchaseDto.purchaseDate),
          deliveryDate:
            createPurchaseDto.status == PurchaseStatus.completed
              ? new Date()
              : null,
        },
      });

      if (purchase.status == PurchaseStatus.completed)
        this.updateStockOnCompletedPurchase(purchase);

      return purchase;
    });
  }

  async findAll() {
    const purchases = await this.prisma.purchase.findMany({
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
      orderBy: {
        id: 'desc',
      },
    });

    return Promise.all(
      purchases.map(async (p) => {
        const componentsUsed = await this.prisma.usedComponent.findFirst({
          where: {
            componentStock: {
              componentId: p.component.id,
              supplierId: p.supplier.id,
              unitPrice: p.unitPrice,
            },
          },
        });

        return {
          ...p,
          used: componentsUsed != null,
        };
      }),
    );
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

  async updatePurchaseStatus(id: number, status: PurchaseStatus) {
    return this.prisma.$transaction(async (prisma) => {
      // Obtener la compra actual
      const purchase = await prisma.purchase.findUnique({
        where: { id },
        include: { component: true, supplier: true },
      });

      if (!purchase) {
        throw new NotFoundException(`Purchase with ID ${id} not found`);
      }

      // Actualizar el estado
      const updatedPurchase = await prisma.purchase.update({
        where: { id },
        data: {
          status,
          // Si el nuevo estado es "completed", establecer fecha de entrega
          ...(status === PurchaseStatus.completed && {
            deliveryDate: new Date(),
          }),
        },
      });

      // Si se completó la compra, actualizar el stock
      if (status === PurchaseStatus.completed) {
        await this.updateStockOnCompletedPurchase(purchase);
      }

      if (
        status == PurchaseStatus.returned &&
        purchase.status == PurchaseStatus.completed
      ) {
        await this.updateComponentStockOnReturnedPurchase(purchase);
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
  //#endregion

  //#region Private functions
  private async updateStockOnCompletedPurchase(purchase: Purchase) {
    // Verificar si hay algún ComponentStock del mismo componente con inUse: true
    const hasStockInUse = await this.prisma.componentStock.findFirst({
      where: {
        componentId: purchase.componentId,
        supplierId: purchase.supplierId,
        inUse: true,
      },
    });

    // Incrementamos el stock si ya existe uno. Caso contrario, lo creamos
    await this.prisma.componentStock.upsert({
      where: {
        stock_combo: {
          componentId: purchase.componentId,
          unitPrice: purchase.unitPrice,
          supplierId: purchase.supplierId,
        },
      },
      update: {
        stock: {
          increment: purchase.quantity,
        },
      },
      create: {
        componentId: purchase.componentId,
        supplierId: purchase.supplierId,
        stock: purchase.quantity,
        unitPrice: purchase.unitPrice,
        minimumStock: 5, // Valor por defecto
        inUse: !hasStockInUse && purchase.status == 'completed', // true si no hay ningún stock en uso
      },
    });
  }

  private async updateComponentStockOnReturnedPurchase(purchase: Purchase) {
    // TODO: Validar que tire error si el componente ya ha sido usado

    await this.prisma.componentStock.update({
      where: {
        stock_combo: {
          componentId: purchase.componentId,
          supplierId: purchase.supplierId,
          unitPrice: purchase.unitPrice,
        },
      },
      data: {
        stock: {
          decrement: purchase.quantity,
        },
      },
    });
  }
  //#endregion
}
