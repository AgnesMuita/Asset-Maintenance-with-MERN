-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseTitle" VARCHAR(255) NOT NULL,
    "caseNumber" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "Description" VARCHAR(255) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "technician" TEXT NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR NOT NULL,
    "department" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "parentAsset" TEXT NOT NULL,
    "masterAsset" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "specification" VARCHAR NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "regarding" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeArticle" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "articlePNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "content" VARCHAR NOT NULL,
    "majorVNo" INTEGER NOT NULL,
    "minorVNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
