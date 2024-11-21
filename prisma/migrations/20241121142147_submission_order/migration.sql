/*
  Warnings:

  - You are about to drop the column `firstblood` on the `Submissions` table. All the data in the column will be lost.
  - Added the required column `submission_order` to the `Submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submissions" DROP COLUMN "firstblood",
ADD COLUMN     "submission_order" INTEGER NOT NULL;
