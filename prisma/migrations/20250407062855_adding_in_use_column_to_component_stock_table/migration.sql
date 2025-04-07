/*
  Warnings:

  - Added the required column `inUse` to the `ComponentStock` table without a default value. This is not possible if the table is not empty.
  - Made the column `unitPrice` on table `ComponentStock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ComponentStock" ADD COLUMN     "inUse" BOOLEAN NOT NULL,
ALTER COLUMN "unitPrice" SET NOT NULL;
