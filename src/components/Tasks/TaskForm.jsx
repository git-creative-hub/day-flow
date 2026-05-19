import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await onAdd(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
        placeholder="Add a task for today…"
        className="flex-1 bg-df-surface border border-df-border text-df-text font-mono text-[0.82rem] px-3.5 py-2.5 rounded-[4px] outline-none placeholder-df-text3 focus:border-df-accent transition-colors"
      />
      <button type="submit"
        className="bg-df-accent text-df-bg font-mono text-[0.75rem] px-[18px] py-2.5 rounded-[4px] tracking-[0.06em] hover:opacity-85 transition-opacity whitespace-nowrap">
        + Add
      </button>
    </form>
  )
}
