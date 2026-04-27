'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockQuizzes, difficultyStyles } from '@/lib/mock-data'

const savedQuizzes = mockQuizzes.filter((q) => !q.isOwner)

export default function LibraryPage() {
  const [library, setLibrary] = useState(savedQuizzes)

  function remove(id: string) {
    setLibrary((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-8">
      {/* Heading */}
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Saved from others</p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">Library</h1>
      </div>

      {library.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {library.map((quiz) => {
            const tone = difficultyStyles[quiz.difficulty]
            return (
              <div
                key={quiz.id}
                className="rounded-[1.3rem] border-[3px] border-[#151515] bg-white/80 p-4 shadow-[4px_4px_0_#151515]"
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Topic icon */}
                  <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-[0.8rem] border-[3px]', tone.border, tone.bg)}>
                    <span className={cn('font-mono text-xs font-black uppercase', tone.text)}>
                      {quiz.topic.slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black">{quiz.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold text-[#67606a]">
                      <span className={cn('rounded-full border-[2px] px-2 py-0.5 uppercase', tone.border, tone.bg, tone.text)}>
                        {tone.label}
                      </span>
                      <span>by {quiz.author}</span>
                      <span>{quiz.questionCount} questions</span>
                      {quiz.bestScore > 0 ? (
                        <span className="rounded-full border-[2px] border-[#1e6f38] bg-[#d9ff69] px-2 py-0.5 text-[#1e6f38]">
                          Best: {quiz.bestScore}%
                        </span>
                      ) : (
                        <span className="text-[#67606a]">Not attempted</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => remove(quiz.id)}
                      className="flex size-9 items-center justify-center rounded-[0.7rem] border-[3px] border-[#9c231d] bg-[#ff6b62]/20 text-[#9c231d] shadow-[2px_2px_0_#9c231d] transition-transform hover:-translate-y-0.5"
                      title="Remove from library"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <Link
                      href={`/quiz/${quiz.id}/take`}
                      className="rounded-[0.7rem] border-[3px] border-[#151515] bg-[#ffd426] px-4 py-1.5 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
                    >
                      Take it
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 py-16 shadow-[6px_6px_0_#151515]">
      <div className="flex size-16 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] text-3xl text-[#ffd426]">
        📚
      </div>
      <div className="text-center">
        <p className="text-xl font-black">Your library is empty</p>
        <p className="mt-1 font-mono text-xs text-[#67606a]">Take a public quiz to save it here</p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-[0.9rem] border-[3px] border-[#151515] bg-[#ffd426] px-5 py-2.5 font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
      >
        Browse Feed
      </Link>
    </div>
  )
}
