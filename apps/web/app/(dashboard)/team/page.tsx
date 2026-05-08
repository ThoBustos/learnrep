import { LockIcon } from '@/components/icons/LockIcon'
import { PeopleIcon } from '@/components/icons/PeopleIcon'
import { TrophyIcon } from '@/components/icons/TrophyIcon'
import { EyesIcon } from '@/components/icons/EyesIcon'

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6 p-5 lg:p-8">
      {/* Heading */}
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Collaborate</p>
        <h1 className="text-4xl font-black tracking-[-0.05em]">Team</h1>
      </div>

      {/* Coming soon card */}
      <div className="flex flex-col items-center gap-6 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 py-16 px-8 shadow-[6px_6px_0_#151515]">
        {/* Icon area */}
        <div className="flex size-20 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515]">
          <PeopleIcon size={48} />
        </div>

        {/* Badge */}
        <div className="rounded-[0.9rem] border-[3px] border-[#0d5c75] bg-[#7bd8ef] px-5 py-2">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-[#0d5c75]">Coming soon</p>
        </div>

        {/* Description */}
        <div className="text-center">
          <p className="text-2xl font-black">Quiz together, grow together</p>
          <p className="mt-3 max-w-sm font-mono text-xs leading-relaxed text-[#67606a]">
            Invite teammates, see their quizzes in your feed, and compete on a shared leaderboard.
            Learning is more fun with others.
          </p>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: '📨', label: 'Invite by email or link' },
            { icon: <TrophyIcon size={22} />, label: 'Shared team leaderboard' },
            { icon: <EyesIcon size={22} />, label: 'See teammates\' activity' },
            { icon: <LockIcon size={22} />, label: 'Private team quizzes' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#151515] bg-[#ffd426]/30 px-4 py-3"
            >
              <span className="flex items-center text-xl">{item.icon}</span>
              <span className="text-sm font-black">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
