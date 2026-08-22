import { useNavigate } from 'react-router-dom'
import { Construction, ArrowLeft, Sparkles } from 'lucide-react'

interface ComingSoonProps {
  title?: string
  description?: string
}

export default function ComingSoon({
  title = 'Module',
  description = 'This feature is currently under active development as part of the AgriSmart roadmap.',
}: ComingSoonProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6 max-w-lg mx-auto">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6 shadow-xs">
        <Construction size={32} />
      </div>

      {/* Status Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-3">
        <Sparkles size={12} className="text-emerald-600" /> AgriSmart Roadmap
      </div>

      {/* Heading & Description */}
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        {title} is Coming Soon
      </h1>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  )
}
