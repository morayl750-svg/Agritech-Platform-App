import { Download, X, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { usePWAInstall } from '@/hooks/usePWAInstall'

export default function PWAInstallBanner() {
  const { canInstall, isInstalled, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || isInstalled || dismissed) return null

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 ring-1 ring-emerald-500/20">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl shadow-md shrink-0">
          🌾
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white text-sm font-bold">AgriSmart Ku Shubo</p>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
              PWA
            </span>
          </div>
          <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">
            Telefoonkaaga ku kaydi — internet la'aan ayuu u shaqeynayaa
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={install}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
