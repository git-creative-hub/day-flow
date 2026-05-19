import Anthropic from '@anthropic-ai/sdk'

export async function generateDaySummary(tasks, journalContent) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_KEY in .env.local')

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const completed = tasks.filter(t => t.status === 'done').map(t => t.title)
  const pending = tasks.filter(t => t.status !== 'done').map(t => t.title)

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Summarize this workday in 2-3 sentences. Be specific and encouraging.\n\nCompleted tasks: ${completed.length ? completed.join(', ') : 'none'}\nStill pending: ${pending.length ? pending.join(', ') : 'none'}\nJournal notes: ${journalContent || 'none'}`,
      },
    ],
  })

  return msg.content[0].text
}
