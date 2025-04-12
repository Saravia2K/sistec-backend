/*
  Warnings:

  - You are about to drop the column `componentId` on the `UsedComponent` table. All the data in the column will be lost.
  - Made the column `componentStockId` on table `UsedComponent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UsedComponent" DROP CONSTRAINT "UsedComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "UsedComponent" DROP CONSTRAINT "UsedComponent_componentStockId_fkey";

-- AlterTable
ALTER TABLE "UsedComponent" DROP COLUMN "componentId",
ALTER COLUMN "componentStockId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UsedComponent" ADD CONSTRAINT "UsedComponent_componentStockId_fkey" FOREIGN KEY ("componentStockId") REFERENCES "ComponentStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
