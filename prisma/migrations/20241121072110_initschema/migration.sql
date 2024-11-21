/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("student_id");

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Question" (
    "question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "question_description" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submission_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "flag" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "firstblood" BOOLEAN NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
