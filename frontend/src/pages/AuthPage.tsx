import React, { useState } from 'react'
import {
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { UserProfile } from '@/types/auth'

interface AuthPageProps {
  onSuccess?: () => void
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const { login, signup, allUsers, switchUser, isLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)

  // Login Form state
  const [loginEmailOrUsername, setLoginEmailOrUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup Form state
  const [signupFullName, setSignupFullName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupCity, setSignupCity] = useState('Muqdisho')
  const [signupDistrict, setSignupDistrict] = useState('')
  const [signupRegion, setSignupRegion] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')

  // UI status messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick Select User Action
  const handleSelectUser = (selectedUser: UserProfile) => {
    switchUser(selectedUser)
    setSuccessMessage(`Waad soo gashay sida ${selectedUser.full_name}!`)
    if (onSuccess) onSuccess()
  }

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!loginEmailOrUsername.trim()) {
      setErrorMessage('Fadlan geli Email-kaaga, Gmail-kaaga ama Username-kaaga.')
      return
    }

    setIsSubmitting(true)
    const res = await login(loginEmailOrUsername, loginPassword || 'razaan12')
    setIsSubmitting(false)

    if (res.success) {
      setSuccessMessage('Soo galitaanku waa uu ku guuleystay!')
      if (onSuccess) onSuccess()
    } else {
      setErrorMessage(res.error || 'Geli aqoonsigaaga saxda ah.')
    }
  }

  // Submit Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!signupFullName.trim()) {
      setErrorMessage('Fadlan geli magacaaga oo dhameystiran.')
      return
    }
    if (!signupUsername.trim()) {
      setErrorMessage('Fadlan sameey Username gaar ah.')
      return
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Fadlan geli Gmail ama Email sax ah.')
      return
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Nambarka sirta ah waa in uu ka koobnaadaa ugu yaraan 6 xaraf/nambar.')
      return
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Nambarrada sirta ah (passwords) ma isku mid aha.')
      return
    }

    setIsSubmitting(true)
    const res = await signup({
      email: signupEmail,
      username: signupUsername,
      full_name: signupFullName,
      password: signupPassword,
      phone: signupPhone,
      city: signupCity,
      district: signupDistrict,
      region: signupRegion || (signupCity ? `${signupCity}, ${signupDistrict}` : ''),
    })
    setIsSubmitting(false)

    if (res.success) {
      setSuccessMessage('Koontadaada waa la sameeyay si ammaan ah! Hada waad soo gashay.')
      if (onSuccess) onSuccess()
    } else {
      setErrorMessage(res.error || 'Khalad ayaa dhacay intii ay socotay diiwaangelintu.')
    }
  }

  // Calculate Password Strength for Signup
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 10) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) return { score: 33, label: 'Laxmi / Qayb', color: 'bg-amber-500' }
    if (score <= 4) return { score: 66, label: 'Dhexdhexaad / Waan wanaagsan yahay', color: 'bg-blue-500' }
    return { score: 100, label: 'Aad u ammaan badan', color: 'bg-emerald-600' }
  }

  const passStrength = getPasswordStrength(signupPassword)

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Container Box */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all">
        {/* Top Header Card */}
        <div className="p-6 pb-4 bg-gradient-to-b from-emerald-50/50 to-white border-b border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md mb-3">
            <Leaf size={24} />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-gray-900">AgriSmart Platform</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Nidaamka Maamulka Aqoonsiga Isticmaalayaasha ee Soomaaliya
          </p>

          {/* Mode Switcher Tabs */}
          <div className="w-full grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl mt-5 border border-gray-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Soo Gal (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sameey Koonto Cusub (Sign Up)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Status Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <div className="space-y-4">
              {/* Quick Select Preset Users */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Users size={14} className="text-emerald-600" />
                  <span>Dooro Aqoonsi Diyaarsan (Quick Select User):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allUsers.map((u) => {
                    const initials = u.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUser(u)}
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 bg-gray-50/60 hover:bg-emerald-50/50 transition-all flex items-center gap-2.5 cursor-pointer text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 truncate">
                              {u.full_name}
                            </p>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                u.role === 'Admin'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {u.role === 'Admin' ? 'Admin' : 'User'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 truncate">@{u.username}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-medium text-gray-400">Ama Soo Gal (Manual Login)</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gmail / Email ama Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginEmailOrUsername}
                      onChange={(e) => setLoginEmailOrUsername(e.target.value)}
                      placeholder="tusaale@gmail.com ama username-kaaga"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nambarka Sirta Ah (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Soo galayaa...</span>
                  ) : (
                    <>
                      <span>Soo Gal Nidaamka</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Magacaaga Oo Dhameystiran <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="Tusaale: Mohamed Hassan"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Username Khaas Ah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="mohamed_beeraley"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gmail / Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="mohamed@gmail.com"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Telefoon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                      <Phone size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+252 61 XXX XXXX"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Magaalada aad joogto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={14} />
                    </div>
                    <select
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer"
                    >
                      <option value="Muqdisho">Muqdisho (Banaadir)</option>
                      <option value="Hargeysa">Hargeysa</option>
                      <option value="Baydhabo">Baydhabo</option>
                      <option value="Kismaayo">Kismaayo</option>
                      <option value="Garoowe">Garoowe</option>
                      <option value="Boosaaso">Boosaaso</option>
                      <option value="Jowhar">Jowhar</option>
                      <option value="Afgooye">Afgooye</option>
                      <option value="Beledweyne">Beledweyne</option>
                      <option value="Gaalkacyo">Gaalkacyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Xaafadda aad ka joogto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    placeholder="Tusaale: Hodan, Waaberi, Kaaraan..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gobolka / Beerta (Ikhtiyaar)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={14} />
                    </div>
                    <input
                      type="text"
                      value={signupRegion}
                      onChange={(e) => setSignupRegion(e.target.value)}
                      placeholder="Afgooye, Shabelle Hoose"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nambarka Sirta Ah (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Ugu yaraan 6 stigaar"
                    className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {signupPassword && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passStrength.color}`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      Ammaanka: <strong className="text-gray-800">{passStrength.label}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Xaqiiji Nambarka Sirta Ah <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Ku celi nambarka sirta ah"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>Diiwaangelinayaa...</span>
                ) : (
                  <>
                    <span>Sameey Koontada Cusub</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
          <span>Encrypted 256-Bit SSL Security & Supabase Multi-User Auth</span>
        </div>
      </div>
    </div>
  )
}
