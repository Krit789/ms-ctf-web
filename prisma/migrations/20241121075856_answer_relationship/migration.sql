/*
  Warnings:

  - You are about to drop the column `answer` on the `Questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "answer";

-- CreateTable
CREATE TABLE "Answers" (
    "answer_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "for_student_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("answer_id")
);

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_for_student_id_fkey" FOREIGN KEY ("for_student_id") REFERENCES "Users"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
