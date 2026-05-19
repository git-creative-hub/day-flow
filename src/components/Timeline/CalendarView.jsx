import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
function firstDayOfMonth(y, m) { return new Date(y, m, 1).getDay() }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const today = new Date().toISOString().slice(0, 10)

export default function CalendarView({ selectedDay, onSelectDay }) {
  const { user } = useAuth()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [activeDates, setActiveDates] = useState(new Set())

  useEffect(() => {
    if (!user) return
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const end   = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth(year, month)).padStart(2, '0')}`
    supabase.from('tasks').select('date').eq('user_id', user.id).gte('date', start).lte('date', end)
      .then(({ data }) => setActiveDates(new Set((data ?? []).map(r => r.date))))
  }, [user, year, month])

  function prevMonth() { month === 0 ? (setYear(y => y - 1), setMonth(11)) : setMonth(m => m - 1) }
  function nextMonth() { month === 11 ? (setYear(y => y + 1), setMonth(0)) : setMonth(m => m + 1) }

  const totalDays = daysInMonth(year, month)
  const startDay  = firstDayOfMonth(year, month)
  const cells = [...Array(startDay).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)]

  return (
    <div>
      {/* month nav */}
      <div className="flex items-center justify-between px-[18px] py-4">
        <span className="font-serif text-[1.05rem] text-df-text">{MONTHS[month]} {year}</span>
        <div className="flex gap-1.5">
          {['‹', '›'].map((ch, i) => (
            <button key={ch} onClick={i === 0 ? prevMonth : nextMonth}
              className="w-[26px] h-[26px] border border-df-border text-df-text2 text-sm rounded-[3px] hover:border-df-accent hover:text-df-accent transition-all">
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="px-2.5 pb-2.5">
        <div className="grid grid-cols-7 mb-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center text-[0.62rem] text-df-text3 uppercase tracking-[0.1em] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday    = dateStr === today
            const isSelected = dateStr === selectedDay
            const hasData    = activeDates.has(dateStr)

            return (
              <button key={dateStr} onClick={() => onSelectDay(dateStr)}
                className={`relative aspect-square flex items-center justify-center text-[0.75rem] rounded-[4px] transition-all border
                  ${isSelected
                    ? 'bg-df-accent border-df-accent text-df-bg font-medium'
                    : isToday
                      ? 'border-df-accent text-df-accent font-medium'
                      : 'border-transparent text-df-text2 hover:bg-df-surface2 hover:text-df-text'
                  }`}>
                {day}
                {hasData && !isSelected && (
                  <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-df-accent2" />
                )}
                {hasData && isSelected && (
                  <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-df-bg" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
