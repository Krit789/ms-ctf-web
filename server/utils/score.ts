// server/utils/score.ts

import type { UserScore } from '~/types/score'

export const calculatePointsForSubmission = (basePoints: number | null, submissionOrder: number): number => {
  if (!basePoints) return 0

  switch (submissionOrder) {
    case 1:
      return basePoints
    case 2:
      return basePoints - 10
    case 3:
      return basePoints - 15
    case 4:
      return basePoints - 20
    default:
      return basePoints - 20 - (submissionOrder - 4)
  }
}

export const sortUserScores = (scores: UserScore[]): UserScore[] => {
  return [...scores].sort((a, b) =>
    b.totalPoints === a.totalPoints
      ? b.latestSubmission - a.latestSubmission
      : b.totalPoints - a.totalPoints
  )
}

export const calculateUserStats = (
  submissions: { points: number; created_on: Date }[]
): { totalPoints: number; latestSubmission: number } => {
  return submissions.reduce(
    (acc, submission) => ({
      totalPoints: acc.totalPoints + submission.points,
      latestSubmission: Math.max(acc.latestSubmission, submission.created_on.getTime())
    }),
    { totalPoints: 0, latestSubmission: Date.now() }
  )
}