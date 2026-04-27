interface CountdownTimerProps {
  days: number
  hours: number
  minutes: number
  label?: string
}

export function CountdownTimer({ days, hours, minutes, label }: CountdownTimerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <TimeBlock value={days} unit="Days" />
        <Separator />
        <TimeBlock value={hours} unit="Hours" />
        <Separator />
        <TimeBlock value={minutes} unit="Mins" />
      </div>
    </div>
  )
}

function TimeBlock({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center border-2 border-foreground bg-card rounded-xl px-4 py-2 shadow-hard-sm min-w-[56px]">
      <span className="font-black tabular-nums text-2xl leading-none text-foreground">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{unit}</span>
    </div>
  )
}

function Separator() {
  return <span className="font-black text-xl text-foreground pb-3">:</span>
}
