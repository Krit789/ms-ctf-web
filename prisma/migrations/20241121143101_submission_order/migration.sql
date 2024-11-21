-- AlterTable
CREATE SEQUENCE answers_answer_id_seq;
ALTER TABLE "Answers" ALTER COLUMN "answer_id" SET DEFAULT nextval('answers_answer_id_seq');
ALTER SEQUENCE answers_answer_id_seq OWNED BY "Answers"."answer_id";

-- AlterTable
CREATE SEQUENCE questions_question_id_seq;
ALTER TABLE "Questions" ALTER COLUMN "question_id" SET DEFAULT nextval('questions_question_id_seq');
ALTER SEQUENCE questions_question_id_seq OWNED BY "Questions"."question_id";

-- AlterTable
CREATE SEQUENCE submissions_submission_id_seq;
ALTER TABLE "Submissions" ALTER COLUMN "submission_id" SET DEFAULT nextval('submissions_submission_id_seq');
ALTER SEQUENCE submissions_submission_id_seq OWNED BY "Submissions"."submission_id";
