/*
  Warnings:

  - Added the required column `authTag` to the `SecureText` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SecureText" ADD COLUMN     "authTag" TEXT NOT NULL;
