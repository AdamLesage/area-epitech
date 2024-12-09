/*
  Warnings:

  - Added the required column `containerUuid` to the `ActionReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActionReaction" ADD COLUMN     "containerUuid" TEXT NOT NULL;
