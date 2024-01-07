/*
  Warnings:

  - Added the required column `realDuration` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realPrice` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `realDuration` DOUBLE NOT NULL,
    ADD COLUMN `realPrice` DOUBLE NOT NULL,
    ADD COLUMN `serviceId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Book_serviceId_idx` ON `Book`(`serviceId`);
