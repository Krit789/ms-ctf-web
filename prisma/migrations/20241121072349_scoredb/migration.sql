/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_student_id_fkey";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "student_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "question_description" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Submissions" (
    "submission_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "flag" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "firstblood" BOOLEAN NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Submissions" ADD CONSTRAINT "Submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Users"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
