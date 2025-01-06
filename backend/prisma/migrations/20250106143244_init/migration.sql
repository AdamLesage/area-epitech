/*
  Warnings:

  - Added the required column `accountEmail` to the `LinkedAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkedAccount" ADD COLUMN     "accountEmail" TEXT NOT NULL;
