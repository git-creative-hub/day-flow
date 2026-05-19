import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const DOW    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const today  = new Date().toISOString().slice(0, 10)

function weekStart(date) {
  const d = new Date(date + 'T12:00:00')
  d.setDate(d.getDate() - d.getDay())
  return d
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function WeekView({ selectedDay, onSelectDay }) {
  const { user } = useAuth()
  const [weekTasks, setWeekTasks] = useState({})

  const start = weekStart(selectedDay)
  const days  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  useEffect(() => {
    if (!user) return
    const startStr = dateKey(days[0])
    const endStr   = dateKey(days[6])
    supabase.from('tasks').select('*').eq('user_id', user.id).gte('date', startStr).lte('date', endStr)
      .then(({ data }) => {
        const grouped = {}
        ;(data ?? []).forEach(t => { if (!grouped[t.date]) grouped[t.date] = []; grouped[t.date].push(t) })
        setWeekTasks(grouped)
      })
  }, [user, selectedDay])

  const weekLabel = `Week of ${MONTHS[start.getMonth()]} ${start.getDate()}`

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <div className="mb-5">
        <h2 className="font-serif text-[1.4rem] text-df-text">{weekLabel}</h2>
        <p className="text-[0.68rem] text-df-text3 mt-0.5 uppercase tracking-[0.1em]">Click any day to open it</p>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map(d => {
          const key   = dateKey(d)
          const tasks = weekTasks[key] ?? []
          const isToday = key === today

          return (
            <div key={key} onClick={() => onSelectDay(key)}
              className={`bg-df-surface border rounded-[6px] p-3 min-h-[160px] cursor-pointer transition-all hover:border-df-accent
                ${isToday ? 'border-[rgba(212,168,67,0.4)]' : 'border-df-border'}`}>
              <div className="mb-2.5">
                <div className="text-[0.6rem] uppercase tracking-[0.1em] text-df-text3">{DOW[d.getDay()].slice(0,3)}</div>
                <div className={`font-serif text-[1.3rem] leading-tight ${isToday ? 'text-df-accent' : 'text-df-text'}`}>
                  {d.getDate()}
                </div>
              </div>
              {tasks.slice(0, 4).map(t => (
                <div key={t.id}
                  className={`text-[0.62rem] px-[7px] py-1 rounded-[3px] mb-1 border border-df-border bg-df-surface2 text-df-text2 truncate
                    ${t.status === 'done' ? 'line-through opacity-40' : ''}`}>
                  {t.title}
                </div>
              ))}
              {tasks.length > 4 && (
                <div className="text-[0.6rem] text-df-text3 mt-0.5">+{tasks.length - 4} more</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
