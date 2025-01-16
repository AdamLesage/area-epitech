-- AlterTable
ALTER TABLE "LinkedAccount" ALTER COLUMN "accountEmail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureUrl" TEXT;
