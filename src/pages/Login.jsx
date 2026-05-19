import { useState } from 'react'
import LoginForm from '../components/Auth/LoginForm'
import SignupForm from '../components/Auth/SignupForm'

export default function Login() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-df-bg px-4">
      <div className="bg-df-surface border border-df-border rounded-[6px] p-8 w-full max-w-sm">
        <div className="text-center mb-7">
          <h1 className="font-serif text-[2rem] text-df-accent tracking-[0.02em]">DayFlow</h1>
          <p className="text-df-text3 text-[0.7rem] mt-1 uppercase tracking-[0.1em]">personal planner</p>
        </div>
        {mode === 'login'
          ? <LoginForm onSwitch={() => setMode('signup')} />
          : <SignupForm onSwitch={() => setMode('login')} />
        }
      </div>
    </div>
  )
}
