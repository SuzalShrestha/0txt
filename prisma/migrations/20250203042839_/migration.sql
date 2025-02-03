-- CreateTable
CREATE TABLE "SecureText" (
    "id" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL,
    "encryptedText" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SecureText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecureText_urlPath_key" ON "SecureText"("urlPath");

-- CreateIndex
CREATE INDEX "SecureText_urlPath_idx" ON "SecureText"("urlPath");

-- CreateIndex
CREATE INDEX "AccessLog_textId_idx" ON "AccessLog"("textId");

-- CreateIndex
CREATE INDEX "AccessLog_timestamp_idx" ON "AccessLog"("timestamp");
