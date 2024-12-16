/*
  Warnings:

  - You are about to drop the column `endpoint` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `typeAction` on the `ActionReaction` table. All the data in the column will be lost.
  - You are about to drop the column `typeReaction` on the `ActionReaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ActionReaction` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Service` table. All the data in the column will be lost.
  - Added the required column `actionId` to the `ActionReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reactionId` to the `ActionReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `ActionReaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActionReaction" DROP CONSTRAINT "ActionReaction_userId_fkey";

-- DropIndex
DROP INDEX "Service_logo_key";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "endpoint";

-- AlterTable
ALTER TABLE "ActionReaction" DROP COLUMN "typeAction",
DROP COLUMN "typeReaction",
DROP COLUMN "userId",
ADD COLUMN     "actionId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "reactionId" INTEGER NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "logo";

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "ActionReaction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "ActionReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
