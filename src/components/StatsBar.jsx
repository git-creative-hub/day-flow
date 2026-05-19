export default function StatsBar({ tasks }) {
  const total  = tasks.length
  const done   = tasks.filter(t => t.status === 'done').length
  const rolled = tasks.filter(t => t.rolled_over).length
  const pct    = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="border-t border-df-border px-8 py-2.5 flex items-center gap-6 bg-df-surface flex-shrink-0">
      <div className="text-[0.65rem] text-df-text3">
        Total <strong className="text-df-accent font-medium">{total}</strong>
      </div>
      <div className="text-[0.65rem] text-df-text3">
        Done <strong className="text-df-accent2 font-medium">{done}</strong>
      </div>
      <div className="text-[0.65rem] text-df-text3">
        Rolled <strong className="text-df-rollover font-medium">{rolled}</strong>
      </div>
      <div className="flex-1 h-[3px] bg-df-border rounded-full overflow-hidden">
        <div className="h-full bg-df-accent2 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
