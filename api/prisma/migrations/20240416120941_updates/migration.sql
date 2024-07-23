/*
  Warnings:

  - A unique constraint covering the columns `[creatorId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caseId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conversationId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_creatorId_key" ON "Conversation"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_caseId_key" ON "Conversation"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_conversationId_key" ON "Message"("conversationId");
