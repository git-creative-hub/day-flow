import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm({ onSwitch }) {
  const { signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try { await signIn(email, password) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const inputClass = "w-full bg-df-surface2 border border-df-border text-df-text font-mono text-[0.82rem] px-3.5 py-2.5 rounded-[4px] outline-none placeholder-df-text3 focus:border-df-accent transition-colors"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[0.65rem] uppercase tracking-[0.1em] text-df-text3 mb-1.5">Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com" className={inputClass} />
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-[0.1em] text-df-text3 mb-1.5">Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
          placeholder="••••••••" className={inputClass} />
      </div>
      {error && <p className="text-[0.75rem] text-df-danger">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-df-accent text-df-bg font-mono text-[0.78rem] tracking-[0.08em] rounded-[4px] hover:opacity-85 transition-opacity disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-[0.72rem] text-df-text3">
        No account?{' '}
        <button type="button" onClick={onSwitch} className="text-df-accent hover:underline">Sign up</button>
      </p>
    </form>
  )
}
