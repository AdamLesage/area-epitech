/*
  Warnings:

  - A unique constraint covering the columns `[authToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `authToken` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "authToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_authToken_key" ON "User"("authToken");
