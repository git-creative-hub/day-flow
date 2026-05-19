import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

export default function TaskList({ tasks, loading, onAdd, onUpdate, onDelete, readonly, date }) {
  const pending = tasks.filter(t => t.status !== 'done')
  const done    = tasks.filter(t => t.status === 'done')

  const label = loading
    ? 'Loading…'
    : tasks.length
      ? `${pending.length} remaining · ${done.length} done`
      : 'No tasks yet'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!readonly && <TaskForm onAdd={onAdd} />}

      <div className="text-[0.62rem] uppercase tracking-[0.14em] text-df-text3 mb-2.5">{label}</div>

      <div className="flex-1 overflow-y-auto">
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 text-df-text3">
            <div className="text-3xl mb-3 opacity-40">◦</div>
            <p className="text-[0.78rem] leading-relaxed">
              {readonly ? 'No tasks this day.' : 'No tasks yet.\nAdd something above.'}
            </p>
          </div>
        )}

        {[...pending, ...done].map(task => (
          <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} readonly={readonly} />
        ))}
      </div>
    </div>
  )
}
