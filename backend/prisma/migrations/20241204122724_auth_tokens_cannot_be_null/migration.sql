/*
  Warnings:

  - A unique constraint covering the columns `[googleAccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubAccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "authToken" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleAccessToken_key" ON "User"("googleAccessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubAccessToken_key" ON "User"("githubAccessToken");
