export function AttemptCount({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="text-caption text-muted-foreground">
      {count} {count === 1 ? 'attempt' : 'attempts'}
    </span>
  )
}
