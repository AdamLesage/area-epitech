/*
  Warnings:

  - You are about to drop the column `actionData` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `reactionData` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `typeAction` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `typeReaction` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endpoint` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_userId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionData",
DROP COLUMN "creationDate",
DROP COLUMN "isActive",
DROP COLUMN "reactionData",
DROP COLUMN "title",
DROP COLUMN "typeAction",
DROP COLUMN "typeReaction",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedAccount" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "endpoint" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_uuid_key" ON "ProfilePicture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_userId_key" ON "ProfilePicture"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccount_uuid_key" ON "LinkedAccount"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedAccount" ADD CONSTRAINT "LinkedAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
