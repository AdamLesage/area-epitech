-- CreateTable
CREATE TABLE "ActionReaction" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "typeAction" TEXT NOT NULL,
    "typeReaction" TEXT NOT NULL,
    "reactionData" JSONB NOT NULL,
    "actionData" JSONB NOT NULL,
    "userId" INTEGER,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ActionReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_uuid_key" ON "ActionReaction"("uuid");

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "ActionReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
