export type QuizAttemptNotification = {
  id: string
  type: 'quiz_attempt'
  takerName: string
  quizTitle: string
  quizId: string
  score: number
  createdAt: string
}

export type AccessRequestNotification = {
  id: string
  type: 'access_request'
  requestId: string
  requesterName: string
  quizTitle: string
  quizId: string
  createdAt: string
}

export type AppNotification = QuizAttemptNotification | AccessRequestNotification

export type TopicStat = {
  topic: string
  attempts: number
  avgScore: number
  bestScore: number
  improvement: number | null // best minus first across all attempts in topic
}
