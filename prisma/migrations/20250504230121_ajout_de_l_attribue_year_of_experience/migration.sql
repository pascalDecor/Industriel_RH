/*
  Warnings:

  - Added the required column `year_of_experience` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "year_of_experience" INTEGER NOT NULL;
