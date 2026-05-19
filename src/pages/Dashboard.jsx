import { useState, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { useJournal } from '../hooks/useJournal'
import Sidebar from '../components/Sidebar'
import TaskList from '../components/Tasks/TaskList'
import JournalEntry from '../components/Journal/JournalEntry'
import AISummary from '../components/AI/AISummary'
import StatsBar from '../components/StatsBar'
import WeekView from '../components/Timeline/WeekView'

const DOW    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const todayStr = new Date().toISOString().slice(0, 10)

export default function Dashboard() {
  const { signOut } = useAuth()
  const [selectedDay, setSelectedDay] = useState(todayStr)
  const [view, setView]               = useState('day') // 'day' | 'week'
  const [backlogSignal, setBacklogSignal] = useState(0)

  const readonly = selectedDay < todayStr
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(selectedDay)
  const { entry, loading: journalLoading, saveContent, saveSummary }     = useJournal(selectedDay)

  // bump signal so sidebar backlog refreshes when tasks change
  const handleTaskChange = useCallback(() => setBacklogSignal(s => s + 1), [])

  function handleSelectDay(day) {
    setSelectedDay(day)
    setView('day')
  }

  const d = new Date(selectedDay + 'T12:00:00')
  const dateLabel = `${DOW[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  const isToday   = selectedDay === todayStr

  return (
    <div className="min-h-screen flex flex-col bg-df-bg font-mono" style={{ height: '100vh' }}>
      {/* ── header ── */}
      <header className="flex items-center justify-between px-7 py-[18px] border-b border-df-border bg-df-surface flex-shrink-0">
        <div>
          <span className="font-serif text-[1.4rem] text-df-accent tracking-[0.02em]">DayFlow</span>
          <span className="text-df-text2 text-[0.75rem] ml-2.5">personal planner</span>
        </div>
        <div className="flex items-center gap-1">
          {['Today', 'Week'].map((label, i) => {
            const v = i === 0 ? 'day' : 'week'
            return (
              <button key={v} onClick={() => setView(v)}
                className={`px-3.5 py-1.5 border text-[0.72rem] uppercase tracking-[0.08em] rounded-[3px] transition-all font-mono
                  ${view === v
                    ? 'bg-df-accent border-df-accent text-df-bg'
                    : 'border-df-border text-df-text2 hover:border-df-accent hover:text-df-accent'}`}>
                {label}
              </button>
            )
          })}
          <button onClick={signOut}
            className="ml-4 text-[0.72rem] text-df-text3 hover:text-df-text2 uppercase tracking-[0.08em] transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* ── body ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          taskRefreshSignal={backlogSignal}
          onBacklogAdd={handleTaskChange}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {view === 'week' ? (
            <WeekView selectedDay={selectedDay} onSelectDay={handleSelectDay} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
                {/* day header */}
                <div>
                  <h1 className="font-serif text-[2rem] text-df-text leading-tight">{dateLabel}</h1>
                  <p className="text-[0.7rem] text-df-text3 mt-1 uppercase tracking-[0.1em]">
                    {isToday ? 'Today' : selectedDay > todayStr ? 'Future day' : 'Past day'}
                  </p>
                </div>

                <TaskList
                  tasks={tasks}
                  loading={tasksLoading}
                  onAdd={async (title) => { await addTask(title); handleTaskChange() }}
                  onUpdate={async (id, u) => { await updateTask(id, u); handleTaskChange() }}
                  onDelete={async (id) => { await deleteTask(id); handleTaskChange() }}
                  readonly={readonly}
                />

                <JournalEntry entry={entry} loading={journalLoading} onSave={saveContent} readonly={readonly} />

                <AISummary tasks={tasks} entry={entry} onSave={saveSummary} readonly={readonly} />
              </div>

              <StatsBar tasks={tasks} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
