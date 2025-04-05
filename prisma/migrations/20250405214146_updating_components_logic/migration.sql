/*
  Warnings:

  - You are about to drop the column `brand` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `minimumStock` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the `ComponentType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Component` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_typeId_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "brand",
DROP COLUMN "minimumStock",
DROP COLUMN "stock",
DROP COLUMN "typeId",
DROP COLUMN "unitPrice",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "UsedComponent" ADD COLUMN     "componentStockId" INTEGER;

-- DropTable
DROP TABLE "ComponentType";

-- CreateTable
CREATE TABLE "ComponentStock" (
    "id" SERIAL NOT NULL,
    "componentId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 5,
    "unitPrice" DOUBLE PRECISION,

    CONSTRAINT "ComponentStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- AddForeignKey
ALTER TABLE "ComponentStock" ADD CONSTRAINT "ComponentStock_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedComponent" ADD CONSTRAINT "UsedComponent_componentStockId_fkey" FOREIGN KEY ("componentStockId") REFERENCES "ComponentStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
