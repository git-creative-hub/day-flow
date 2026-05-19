import { useState } from 'react'
import { generateDaySummary } from '../../lib/claude'

export default function AISummary({ tasks, entry, onSave, readonly }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const summary = entry?.ai_summary

  async function handleGenerate() {
    setError('')
    setLoading(true)
    try {
      const text = await generateDaySummary(tasks, entry?.content ?? '')
      await onSave(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-df-surface border border-df-border rounded-[5px] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[0.62rem] uppercase tracking-[0.14em] text-df-text3">AI Summary</span>
        {!readonly && (
          <button onClick={handleGenerate} disabled={loading}
            className="text-[0.65rem] px-3 py-0.5 bg-df-accent text-df-bg rounded-[3px] hover:opacity-85 transition-opacity disabled:opacity-50 font-mono tracking-[0.06em]">
            {loading ? 'Generating…' : summary ? 'Regenerate' : 'Generate'}
          </button>
        )}
      </div>
      {error && <p className="text-[0.7rem] text-df-danger mb-2">{error}</p>}
      {summary
        ? <p className="text-[0.8rem] text-df-text2 leading-relaxed">{summary}</p>
        : <p className="text-[0.75rem] text-df-text3 italic">
            {readonly ? 'No summary generated.' : 'Click Generate to summarise your day with AI.'}
          </p>
      }
    </div>
  )
}
