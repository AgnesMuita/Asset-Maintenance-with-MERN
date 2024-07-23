-- CreateTable
CREATE TABLE "ItemCount" (
    "id" TEXT NOT NULL,
    "cases" INTEGER NOT NULL,
    "users" INTEGER NOT NULL,
    "assets" INTEGER NOT NULL,
    "articles" INTEGER NOT NULL,
    "documents" INTEGER NOT NULL,
    "logs" INTEGER NOT NULL,
    "announcements" INTEGER NOT NULL,
    "news" INTEGER NOT NULL,
    "events" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ItemCount_pkey" PRIMARY KEY ("id")
);
