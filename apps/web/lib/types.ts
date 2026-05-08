export type AppNotification = {
  id: string
  type: 'quiz_attempt'
  takerName: string
  quizTitle: string
  quizId: string
  score: number
  createdAt: string
}

export type TopicStat = {
  topic: string
  attempts: number
  avgScore: number
  bestScore: number
  improvement: number | null // best minus first across all attempts in topic
}
