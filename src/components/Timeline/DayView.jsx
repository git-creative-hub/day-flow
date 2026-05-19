import { useTasks } from '../../hooks/useTasks'
import { useJournal } from '../../hooks/useJournal'
import TaskList from '../Tasks/TaskList'
import JournalEntry from '../Journal/JournalEntry'
import AISummary from '../AI/AISummary'

const today = () => new Date().toISOString().slice(0, 10)

export default function DayView({ date }) {
  const readonly = date < today()
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(date)
  const { entry, loading: journalLoading, saveContent, saveSummary } = useJournal(date)

  const label = new Date(date + 'T12:00:00').toLocaleDateString('default', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-800">{label}</h2>
        {readonly && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Past day</span>
        )}
      </div>

      <TaskList
        tasks={tasks}
        loading={tasksLoading}
        onAdd={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        readonly={readonly}
      />

      <JournalEntry
        entry={entry}
        loading={journalLoading}
        onSave={saveContent}
        readonly={readonly}
      />

      <AISummary
        tasks={tasks}
        entry={entry}
        onSave={saveSummary}
        readonly={readonly}
      />
    </div>
  )
}
