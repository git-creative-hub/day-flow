import { useState } from 'react'
import { Link } from 'react-router-dom'
import CalendarView from '../components/Timeline/CalendarView'
import DayView from '../components/Timeline/DayView'

const today = new Date().toISOString().slice(0, 10)

export default function Timeline() {
  const [selectedDay, setSelectedDay] = useState(today)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-brand-600">Dayflow</span>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 transition">Today</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h1>
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
          <CalendarView onSelectDay={setSelectedDay} selectedDay={selectedDay} />
          <DayView date={selectedDay} />
        </div>
      </div>
    </div>
  )
}
