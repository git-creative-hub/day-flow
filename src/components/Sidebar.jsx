import CalendarView from './Timeline/CalendarView'
import { useBacklog } from '../hooks/useBacklog'

export default function Sidebar({ selectedDay, onSelectDay, taskRefreshSignal, onBacklogAdd }) {
  const { backlog, addToToday } = useBacklog(taskRefreshSignal)

  async function handleAdd(task) {
    await addToToday(task)
    onBacklogAdd()
  }

  return (
    <aside className="w-[280px] flex-shrink-0 border-r border-df-border bg-df-surface flex flex-col overflow-y-auto">
      <CalendarView selectedDay={selectedDay} onSelectDay={onSelectDay} />

      {/* backlog */}
      <div className="border-t border-df-border px-3.5 py-3.5 flex-1">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[0.65rem] uppercase tracking-[0.12em] text-df-text3">Weekly Backlog</span>
          <span className="bg-df-rollover text-df-bg text-[0.6rem] rounded-[10px] px-[7px] py-[1px]">
            {backlog.length}
          </span>
        </div>

        {backlog.length === 0 ? (
          <p className="text-[0.68rem] text-df-text3 px-0.5">All clear — no rolled tasks.</p>
        ) : (
          backlog.map(task => (
            <div key={task.id}
              className="flex items-center justify-between gap-1.5 px-2.5 py-[7px] border border-df-border rounded-[4px] mb-[5px] bg-df-surface2">
              <div className="flex-1 min-w-0">
                <div className="text-[0.7rem] text-df-text2 truncate">{task.title}</div>
                <div className="text-[0.6rem] text-df-rollover">
                  from {task.date.slice(5).replace('-', '/')}
                </div>
              </div>
              <button
                onClick={() => handleAdd(task)}
                className="flex-shrink-0 bg-df-rollover text-df-bg text-[0.65rem] px-2 py-0.5 rounded-[3px] font-mono whitespace-nowrap hover:opacity-80 transition-opacity">
                → Today
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
