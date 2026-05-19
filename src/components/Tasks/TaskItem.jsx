export default function TaskItem({ task, onUpdate, onDelete, readonly }) {
  const done = task.status === 'done'

  function toggle() {
    if (readonly) return
    onUpdate(task.id, { status: done ? 'pending' : 'done' })
  }

  return (
    <div className={`flex items-center gap-3 px-3.5 py-[11px] border border-df-border rounded-[5px] mb-[7px] bg-df-surface transition-all hover:border-df-surface2 hover:bg-df-surface2 ${done ? 'opacity-45' : ''}`}>
      {/* check circle */}
      <button onClick={toggle} disabled={readonly}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all text-[0.7rem]
          ${done ? 'bg-df-accent2 border-df-accent2 text-df-bg' : 'border-df-border hover:border-df-accent2'}`}>
        {done && '✓'}
      </button>

      {/* label */}
      <div className={`flex-1 text-[0.8rem] ${done ? 'line-through text-df-text3' : 'text-df-text'}`}>
        {task.title}
      </div>

      {/* tag */}
      <span className={`text-[0.6rem] px-2 py-0.5 rounded-[10px] tracking-[0.06em] border
        ${task.rolled_over
          ? 'bg-[rgba(122,159,192,0.15)] text-df-rollover border-[rgba(122,159,192,0.25)]'
          : 'bg-[rgba(212,168,67,0.15)] text-df-accent border-[rgba(212,168,67,0.25)]'}`}>
        {task.rolled_over ? 'rolled' : 'today'}
      </span>

      {/* delete */}
      {!readonly && (
        <button onClick={() => onDelete(task.id)}
          className="text-df-text3 hover:text-df-danger text-[0.8rem] px-1 rounded-[3px] transition-colors">
          ✕
        </button>
      )}
    </div>
  )
}
