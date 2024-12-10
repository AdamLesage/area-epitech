/*
  Warnings:

  - You are about to drop the column `endpoint` on the `LinkedAccount` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `LinkedAccount` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LinkedAccount` table. All the data in the column will be lost.
  - You are about to drop the column `githubAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleAccessToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authToken]` on the table `LinkedAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authToken` to the `LinkedAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `LinkedAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_githubAccessToken_key";

-- DropIndex
DROP INDEX "User_googleAccessToken_key";

-- AlterTable
ALTER TABLE "LinkedAccount" DROP COLUMN "endpoint",
DROP COLUMN "logo",
DROP COLUMN "name",
ADD COLUMN     "authToken" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubAccessToken",
DROP COLUMN "googleAccessToken";

-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccount_authToken_key" ON "LinkedAccount"("authToken");
