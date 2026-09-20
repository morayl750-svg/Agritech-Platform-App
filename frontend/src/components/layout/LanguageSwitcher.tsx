import { useState, useRef, useEffect } from 'react'
import { Languages, Check, ChevronDown } from 'lucide-react'
import { useLanguage, LANGUAGES } from '@/context/LanguageContext'
import { cn } from '@/lib/cn'

export function LanguageSwitcher() {
  const { language, setLanguage, currentLang, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('common_language')}
        title={t('common_language')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
          isOpen
            ? 'bg-gray-100 border-gray-300 text-gray-900'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="hidden sm:inline tracking-wide">{currentLang.nativeName}</span>
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200 text-gray-400', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Languages size={13} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900">{t('common_language')}</p>
              <p className="text-[9px] text-gray-400">Select your preferred language</p>
            </div>
          </div>

          {/* Language options */}
          <div className="p-1.5 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer',
                    isActive
                      ? 'bg-emerald-50 border border-emerald-200/80'
                      : 'hover:bg-gray-50 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Flag */}
                    <span className="text-xl leading-none" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <div>
                      <p
                        className={cn(
                          'text-xs font-bold leading-tight',
                          isActive ? 'text-emerald-800' : 'text-gray-800'
                        )}
                      >
                        {lang.nativeName}
                      </p>
                      <p className="text-[10px] text-gray-400">{lang.label}</p>
                    </div>
                  </div>

                  {isActive && (
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
