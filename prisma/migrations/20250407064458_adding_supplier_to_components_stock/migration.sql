/*
  Warnings:

  - Added the required column `supplierId` to the `ComponentStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComponentStock" ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ComponentStock" ADD CONSTRAINT "ComponentStock_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
