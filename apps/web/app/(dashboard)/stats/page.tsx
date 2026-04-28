export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6 p-5 lg:p-8">
      {/* Heading */}
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Performance</p>
        <h1 className="text-4xl font-black tracking-[-0.05em]">Stats</h1>
      </div>

      {/* Teaser stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TeaserCard icon="🔥" label="Current Streak" />
        <TeaserCard icon="🧠" label="Topics Mastered" />
        <TeaserCard icon="📈" label="Avg Improvement" />
      </div>

      {/* Coming soon banner */}
      <div className="flex flex-col items-center gap-5 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 py-16 px-8 shadow-[6px_6px_0_#151515]">
        <div className="rounded-[0.9rem] border-[3px] border-[#5735a7] bg-[#b995ff] px-5 py-2">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-[#5735a7]">Coming in M2</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black">Deep analytics, incoming</p>
          <p className="mt-2 max-w-sm font-mono text-xs leading-relaxed text-[#67606a]">
            Track your learning velocity, identify weak spots per topic, and see how your scores improve over time.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-black text-[#151515]">
          {[
            'Score trends over time',
            'Topic breakdown heatmap',
            'Streak history calendar',
            'Peer comparison percentiles',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full border-[2px] border-[#b995ff] bg-[#b995ff]/30 font-mono text-[9px] font-black text-[#5735a7]">
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeaserCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-[1.1rem] border-[3px] border-[#151515] bg-white/60 p-5 shadow-[4px_4px_0_#151515]">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-3xl font-black leading-none tracking-[-0.06em] text-[#151515]/30">--</p>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#67606a]">{label}</p>
        </div>
      </div>
    </div>
  )
}
