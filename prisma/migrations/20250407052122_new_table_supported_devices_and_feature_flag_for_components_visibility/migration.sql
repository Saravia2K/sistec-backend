/*
  Warnings:

  - You are about to drop the column `deviceType` on the `SupportTicket` table. All the data in the column will be lost.
  - Added the required column `supportedDevicesId` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SupportTicket" DROP COLUMN "deviceType",
ADD COLUMN     "supportedDevicesId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "DeviceType";

-- CreateTable
CREATE TABLE "SupportedDevices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SupportedDevices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportedDevices_name_key" ON "SupportedDevices"("name");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_supportedDevicesId_fkey" FOREIGN KEY ("supportedDevicesId") REFERENCES "SupportedDevices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
