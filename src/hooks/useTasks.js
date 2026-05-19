import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useTasks(date) {
  const { user } = useAuth()
  const [tasks, setTasks]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('created_at', { ascending: true })
    setTasks(data ?? [])
    setLoading(false)
  }, [user, date])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function addTask(title, notes = '') {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: user.id, title, notes, date, status: 'pending', rolled_over: false })
      .select().single()
    if (!error) setTasks(prev => [...prev, data])
  }

  async function updateTask(id, updates) {
    const extra = updates.status === 'done' ? { completed_at: new Date().toISOString() } : {}
    const { data, error } = await supabase
      .from('tasks').update({ ...updates, ...extra }).eq('id', id).select().single()
    if (!error) setTasks(prev => prev.map(t => t.id === id ? data : t))
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return { tasks, loading, addTask, updateTask, deleteTask, refresh: fetchTasks }
}
