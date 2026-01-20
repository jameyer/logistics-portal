import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Compliance <span className="text-blue-600">Portal</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Tailwind v4.0 is active. Ready to build the manifest logic.
        </p>
        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Start New Entry
        </button>
      </div>
    </div>
  )
}

export default App
