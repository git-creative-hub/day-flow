import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useJournal(date) {
  const { user } = useAuth()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchEntry = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .maybeSingle()
    setEntry(data)
    setLoading(false)
  }, [user, date])

  useEffect(() => { fetchEntry() }, [fetchEntry])

  async function saveContent(content) {
    if (!user) return
    if (entry) {
      const { data } = await supabase
        .from('journal_entries')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single()
      setEntry(data)
    } else {
      const { data } = await supabase
        .from('journal_entries')
        .insert({ user_id: user.id, date, content })
        .select()
        .single()
      setEntry(data)
    }
  }

  async function saveSummary(ai_summary) {
    if (!entry) return
    const { data } = await supabase
      .from('journal_entries')
      .update({ ai_summary })
      .eq('id', entry.id)
      .select()
      .single()
    setEntry(data)
  }

  return { entry, loading, saveContent, saveSummary }
}
