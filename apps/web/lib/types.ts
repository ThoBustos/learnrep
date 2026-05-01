export type AppNotification = {
  id: string
  type: 'quiz_attempt'
  takerName: string
  quizTitle: string
  quizId: string
  score: number
  createdAt: string
}
