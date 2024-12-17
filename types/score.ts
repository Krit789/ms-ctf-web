// server/utils/types/score.ts

export interface UserScore {
  student_id: string
  firstname: string
  lastname: string
  totalPoints: number
  latestSubmission: number
}

export interface SubmissionWithPoints {
  student_id: string
  created_on: Date
  question_id: number
  points: number
}

export interface LeaderboardResponse {
  message: string
  rankings: Array<Omit<UserScore, 'latestSubmission'>>
}

export interface ScoreResponse {
  message: string
  data: UserScore & { rank: number }
}