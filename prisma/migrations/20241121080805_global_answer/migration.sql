/*
  Warnings:

  - Added the required column `global_answer` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'VIEWER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_for_student_id_fkey";

-- AlterTable
ALTER TABLE "Answers" ALTER COLUMN "for_student_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Questions" ADD COLUMN     "global_answer" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_for_student_id_fkey" FOREIGN KEY ("for_student_id") REFERENCES "Users"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
