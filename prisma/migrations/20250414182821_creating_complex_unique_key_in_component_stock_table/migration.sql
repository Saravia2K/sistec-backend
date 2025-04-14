/*
  Warnings:

  - A unique constraint covering the columns `[componentId,supplierId,unitPrice]` on the table `ComponentStock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ComponentStock_componentId_supplierId_unitPrice_key" ON "ComponentStock"("componentId", "supplierId", "unitPrice");
