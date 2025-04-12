/*
  Warnings:

  - You are about to drop the column `supportedDevicesId` on the `SupportTicket` table. All the data in the column will be lost.
  - Added the required column `deviceTypeId` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupportTicket" DROP CONSTRAINT "SupportTicket_supportedDevicesId_fkey";

-- AlterTable
ALTER TABLE "SupportTicket" DROP COLUMN "supportedDevicesId",
ADD COLUMN     "deviceTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "SupportedDevices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
