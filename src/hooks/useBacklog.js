import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const today = () => new Date().toISOString().slice(0, 10)

export function useBacklog(refreshSignal) {
  const { user } = useAuth()
  const [backlog, setBacklog] = useState([])

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .lt('date', today())
      .neq('status', 'done')
      .order('date', { ascending: false })
    setBacklog(data ?? [])
  }, [user])

  useEffect(() => { fetch() }, [fetch, refreshSignal])

  async function addToToday(task) {
    const todayStr = today()
    await supabase.from('tasks').insert({
      user_id: task.user_id,
      title: task.title,
      notes: task.notes,
      date: todayStr,
      status: 'pending',
      rolled_over: true,
      original_date: task.original_date ?? task.date,
    })
    // mark original as done so it leaves the backlog
    await supabase.from('tasks').update({ status: 'done' }).eq('id', task.id)
    await fetch()
  }

  return { backlog, addToToday, refresh: fetch }
}
