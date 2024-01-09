/*
  Warnings:

  - You are about to alter the column `realDuration` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `realDuration` VARCHAR(191) NOT NULL;
