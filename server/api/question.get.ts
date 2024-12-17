// server/api/question.get.ts

import db from "~/db";
import { calculatePointsForSubmission } from '~/server/utils/score'
import type { H3Event } from 'h3'

interface Question {
  question_id: number
  question_title: string
  question_description: string
  points: number
  created_on: Date
}

interface Submission {
  question_id: number
  correct: boolean
  created_on: Date
  submission_rank?: number
}

interface QuestionWithSubmission extends Question {
  submission: {
    correct: boolean
    created_on: Date | null
    submission_rank: number
    points_with_bonus: number
  }
}

interface QuestionResponse {
  message: string
  questionWithSubmission: QuestionWithSubmission[]
}

async function getSubmissionRanks(submissions: Submission[]): Promise<Record<number, number>> {
  // Get all correct submissions to calculate ranks
  const allSubmissions = await db
    .selectFrom("Submissions")
    .select(['question_id', 'student_id', 'created_on'])
    .where("correct", "=", true)
    .orderBy("created_on", "asc")
    .execute();

  // Group submissions by question
  const submissionsByQuestion = new Map<number, typeof allSubmissions>()
  
  for (const submission of allSubmissions) {
    const questionId = submission.question_id
    if (!submissionsByQuestion.has(questionId)) {
      submissionsByQuestion.set(questionId, [])
    }
    submissionsByQuestion.get(questionId)!.push(submission)
  }

  // Calculate ranks for user's submissions
  const ranks: Record<number, number> = {}
  
  for (const submission of submissions) {
    const questionSubmissions = submissionsByQuestion.get(submission.question_id) || []
    if (submission.correct) {
      const rank = questionSubmissions.findIndex(
        s => s.created_on.getTime() === submission.created_on.getTime()
      ) + 1
      ranks[submission.question_id] = rank
    }
  }

  return ranks
}

function mapSubmissionsToQuestions(
  questions: Question[],
  submissions: Submission[] | undefined,
  submissionRanks: Record<number, number>
): QuestionWithSubmission[] {
  // Return early for no submissions, preserving original question order
  if (!submissions || submissions.length === 0) {
    return questions.map((q) => ({
      ...q,
      submission: {
        correct: false,
        created_on: null,
        submission_rank: -1,
        points_with_bonus: 0
      },
    }))
  }

  const submissionMap = new Map<number, Submission>()
  submissions.forEach((sub) => {
    submissionMap.set(sub.question_id, sub)
  })

  // Maps over questions array in original order
  return questions.map((q) => {
    const hasSubmission = submissionMap.has(q.question_id)
    const submission = hasSubmission ? submissionMap.get(q.question_id)! : null
    const rank = hasSubmission ? submissionRanks[q.question_id] || -1 : -1
    
    const points_with_bonus = (hasSubmission && submission?.correct) 
      ? calculatePointsForSubmission(q.points, rank)
      : 0

    return {
      ...q,
      submission: {
        correct: hasSubmission ? submission!.correct : false,
        created_on: hasSubmission ? submission!.created_on : new Date(),
        submission_rank: rank,
        points_with_bonus
      },
    }
  })
}

export default defineEventHandler(async (event: H3Event): Promise<QuestionResponse> => {
  // Get all questions
  const questions = await db
    .selectFrom("Questions")
    .select([
      "question_id",
      "question_title",
      "question_description",
      "points",
      "created_on",
    ])
    .orderBy("question_id", "asc")
    .execute()

  if (!questions.length) {
    return { 
      message: "No questions found", 
      questionWithSubmission: [] 
    }
  }

  // Get user's submissions if not admin
  let submissions: Submission[] = []
  let submissionRanks: Record<number, number> = {}
  
  if (event.context.role !== "ADMIN") {
    submissions = await db
      .selectFrom("Submissions")
      .select(['question_id', 'correct', 'created_on'])
      .where("student_id", "=", event.context.user_id)
      .execute()

    // Calculate submission ranks for correct submissions
    submissionRanks = await getSubmissionRanks(submissions)
  }

  const questionWithSubmission = mapSubmissionsToQuestions(
    questions,
    submissions,
    submissionRanks
  )

  return {
    message: "Success",
    questionWithSubmission,
  }
})