/*
  Warnings:

  - You are about to drop the column `contacts` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `contacts`;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromId` VARCHAR(191) NOT NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `friends` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Contact_contactId_key`(`contactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
