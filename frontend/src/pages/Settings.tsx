import { useState } from 'react'
import { Bell, Database, CheckCircle2, Save, Loader2, Cpu, Globe } from 'lucide-react'

export default function Settings() {
  const [region, setRegion] = useState('Lower Shabelle (Afgooye / Wanlaweyn)')
  const [language, setLanguage] = useState('English')
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true)
  const [weatherAlerts, setWeatherAlerts] = useState(true)
  const [pestAlerts, setPestAlerts] = useState(true)

  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  function handleSaveSettings() {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    }, 400)
  }

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Platform Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure regional preferences, AI Agronomist guardrails, and notification channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Save Preferences</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Settings saved successfully! Regional & AI guardrail preferences updated.</span>
        </div>
      )}

      {/* General Regional Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe size={18} className="text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-900">Regional & Localization Preferences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Primary Agricultural Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
            >
              <option value="Lower Shabelle (Afgooye / Wanlaweyn)">Lower Shabelle (Afgooye / Wanlaweyn)</option>
              <option value="Middle Shabelle (Jowhar)">Middle Shabelle (Jowhar)</option>
              <option value="Bay & Bakool (Baidoa)">Bay & Bakool (Baidoa)</option>
              <option value="Hiiraan (Beledweyne)">Hiiraan (Beledweyne)</option>
              <option value="Middle Juba (Bu'ale)">Middle Juba (Bu'ale)</option>
              <option value="Puntland / Somaliland Plateau">Puntland / Somaliland Plateau</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Interface Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
            >
              <option value="English">English</option>
              <option value="Somali / Af-Soomaali">Somali / Af-Soomaali (Beta)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Agronomist & Gemini Configuration */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Cpu size={18} className="text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-900">AI Agronomist & Gemini Engine Settings</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-900">Strict Somali Agriculture System Guardrails</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Restricts AI queries exclusively to Horn of Africa crops, camel/goat disease treatment, and soil health.
              </p>
            </div>
            <input
              type="checkbox"
              checked={guardrailsEnabled}
              onChange={(e) => setGuardrailsEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-gray-900">Active Model Candidate</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Google Gemini API (`gemini-2.5-flash` via Express Proxy backend on http://localhost:5000)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} /> Active & Connected
            </span>
          </div>
        </div>
      </div>

      {/* Notifications & Hazard Alerts */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell size={18} className="text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-900">Hazard Alerts & Push Notifications</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-900">Severe Weather & Gu Rainfall Forecast Alerts</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Instant notifications for river flooding and drought periods.</p>
            </div>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-gray-900">Regional Pest Outbreak Warnings</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Alerts for Fall Armyworm and Desert Locust swarms.</p>
            </div>
            <input
              type="checkbox"
              checked={pestAlerts}
              onChange={(e) => setPestAlerts(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Infrastructure & Database Health */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Database size={18} className="text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-900">Database & Monorepo Health</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-500">Supabase Cloud Database</p>
            <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Connected (PostgreSQL)
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-500">Express Backend Proxy</p>
            <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Running (Port 5000)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
