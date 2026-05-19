import { useEffect, useState } from 'react'

export default function JournalEntry({ entry, loading, onSave, readonly }) {
  const [content, setContent] = useState('')
  const [saved, setSaved]     = useState(false)

  useEffect(() => { if (!loading) setContent(entry?.content ?? '') }, [entry, loading])

  async function handleBlur() {
    if (readonly) return
    await onSave(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-df-surface border border-df-border rounded-[5px] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[0.62rem] uppercase tracking-[0.14em] text-df-text3">Journal</span>
        {saved && <span className="text-[0.62rem] text-df-accent2">Saved</span>}
      </div>
      {loading ? (
        <div className="h-24 bg-df-surface2 rounded animate-pulse" />
      ) : (
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onBlur={handleBlur}
          readOnly={readonly}
          rows={4}
          placeholder="How's the day going? What are you working on?"
          className="w-full bg-transparent text-[0.8rem] text-df-text placeholder-df-text3 outline-none resize-none leading-relaxed font-mono"
        />
      )}
    </div>
  )
}
