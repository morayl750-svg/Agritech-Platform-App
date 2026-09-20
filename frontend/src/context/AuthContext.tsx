import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserProfile, AuthContextType } from '@/types/auth'

const STORAGE_SESSION_KEY = 'agrismart_auth_session'
const STORAGE_USERS_KEY = 'agrismart_local_registered_users'

// Helper to verify if user is Mohamed Rayl (Admin)
export const isUserAdmin = (u: UserProfile | null | undefined): boolean => {
  if (!u) return false
  const nameMatch = u.full_name?.toLowerCase().includes('mohamed rayl')
  const usernameMatch = u.username?.toLowerCase() === 'mohamed_rayl'
  const emailMatch = u.email?.toLowerCase() === 'mohamed.rayl@agrismart.so'
  const idMatch = u.id === 'user-001'
  return Boolean(nameMatch || usernameMatch || emailMatch || idMatch)
}

// Helper to sanitize any user profile so only Mohamed Rayl is Admin and all others are User
export const sanitizeUserProfile = (u: UserProfile): UserProfile => {
  const isAdmin = isUserAdmin(u)
  return {
    ...u,
    role: isAdmin ? 'Admin' : 'User',
  }
}

// Pre-configured Test Users
export const PRESET_USERS: UserProfile[] = [
  {
    id: 'user-001',
    email: 'mohamed.rayl@agrismart.so',
    username: 'mohamed_rayl',
    full_name: 'Mohamed Rayl',
    phone: '+252 61 555 0192',
    city: 'Muqdisho',
    district: 'Hodan (KM4)',
    region: 'Lower Shabelle (Afgooye Sector)',
    farm_size: '15 Hectares (Sorghum & Sesame)',
    role: 'Admin',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-002',
    email: 'mohamed.hassan@agrismart.so',
    username: 'mohamed_beeraley',
    full_name: 'Mohamed Hassan',
    phone: '+252 61 777 4432',
    city: 'Jowhar',
    district: 'Hanti-wadaag',
    region: 'Middle Shabelle (Jowhar Sector)',
    farm_size: '25 Hectares (Maize & Vegetables)',
    role: 'User',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-003',
    email: 'foosiyo.abdi@agrismart.so',
    username: 'foosiyo_agro',
    full_name: 'Foosiyo Abdi',
    phone: '+252 61 888 1122',
    city: 'Muqdisho',
    district: 'Waaberi (21st October)',
    region: 'Banaadir (Mogadishu Market Sector)',
    farm_size: '10 Hectares (Greenhouse & Horticulture)',
    role: 'User',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-004',
    email: 'jama.warsame@agrismart.so',
    username: 'dr_jama_vet',
    full_name: 'Dr. Jama Warsame',
    phone: '+252 61 333 9988',
    city: 'Baydhabo',
    district: 'Berdaale',
    region: 'Bay & Bakool (Baidoa Livestock Sector)',
    farm_size: '30 Hectares (Livestock Rearing & Feed)',
    role: 'User',
    created_at: new Date().toISOString(),
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(PRESET_USERS)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize session and user list on mount
  useEffect(() => {
    async function initAuth() {
      try {
        setIsLoading(true)

        // Load all registered users from local storage
        const storedUsers = localStorage.getItem(STORAGE_USERS_KEY)
        if (storedUsers) {
          try {
            const parsed = JSON.parse(storedUsers)
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Merge preset users with custom registered users, sanitizing all roles
              const merged = [...PRESET_USERS]
              parsed.forEach((u) => {
                const sanitized = sanitizeUserProfile(u)
                const existingIndex = merged.findIndex(
                  (existing) => existing.email === sanitized.email || existing.username === sanitized.username
                )
                if (existingIndex === -1) {
                  merged.push(sanitized)
                } else if (!isUserAdmin(merged[existingIndex])) {
                  merged[existingIndex] = sanitized
                }
              })
              setAllUsers(merged)
              localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(merged))
            }
          } catch (e) {
            console.error('Error parsing stored users:', e)
          }
        }

        // 1. Check saved active session
        const savedSession = localStorage.getItem(STORAGE_SESSION_KEY)
        if (savedSession) {
          try {
            const parsedUser = JSON.parse(savedSession)
            if (parsedUser && parsedUser.email) {
              if (isUserAdmin(parsedUser)) {
                setUser(PRESET_USERS[0])
                localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(PRESET_USERS[0]))
                setIsLoading(false)
                return
              }
              const sanitized = sanitizeUserProfile(parsedUser)
              setUser(sanitized)
              localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sanitized))
              setIsLoading(false)
              return
            }
          } catch (e) {
            console.error('Failed to parse saved auth session:', e)
          }
        }

        // 2. Try Supabase Auth Session safely
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.getSession()
            const session = data?.session
            if (!error && session?.user) {
              const sbUser = session.user
              const rawProfile: UserProfile = {
                id: sbUser.id,
                email: sbUser.email || '',
                username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || 'user',
                full_name: sbUser.user_metadata?.full_name || 'AgriSmart User',
                phone: sbUser.user_metadata?.phone || '+252 61 000 0000',
                region: sbUser.user_metadata?.region || 'Mogadishu Sector',
                farm_size: sbUser.user_metadata?.farm_size || '10 Hectares',
                role: 'User',
                created_at: sbUser.created_at,
              }
              const userProfile = sanitizeUserProfile(rawProfile)
              setUser(userProfile)
              localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(userProfile))
              setIsLoading(false)
              return
            }
          } catch (sbErr) {
            console.warn('Supabase getSession warning:', sbErr)
          }
        }

        // 3. Fallback default active user: Mohamed Rayl
        setUser(PRESET_USERS[0])
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(PRESET_USERS[0]))
      } catch (err) {
        console.warn('Auth initialization fallback:', err)
        setUser(PRESET_USERS[0])
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Helper to save new user in local list
  const saveUserToList = (newUser: UserProfile) => {
    const sanitized = sanitizeUserProfile(newUser)
    setAllUsers((prev) => {
      const filtered = prev.filter((u) => u.email !== sanitized.email && u.username !== sanitized.username)
      const updated = [...filtered, sanitized]
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // SWITCH USER INSTANTLY
  const switchUser = (selectedUser: UserProfile) => {
    const sanitized = sanitizeUserProfile(selectedUser)
    setUser(sanitized)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sanitized))
  }

  // LOGIN FUNCTION
  const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    const cleanInput = emailOrUsername.trim().toLowerCase()

    try {
      // Check for Mohamed Rayl
      const isMohamedRayl =
        cleanInput === 'mohamed_rayl' ||
        cleanInput === 'mohamed.rayl@agrismart.so' ||
        cleanInput === 'mohamed rayl' ||
        cleanInput === 'user-001'

      if (isMohamedRayl) {
        if (password && password !== 'razaan12') {
          setIsLoading(false)
          return {
            success: false,
            error: 'Password-ka waa khalad. Fadlan geli: razaan12',
          }
        }
        setUser(PRESET_USERS[0])
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(PRESET_USERS[0]))
        setIsLoading(false)
        return { success: true }
      }

      // 1. Match against preset and registered users
      const foundUser = allUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanInput ||
          u.username.toLowerCase() === cleanInput
      )

      if (foundUser) {
        const safeUser = sanitizeUserProfile(foundUser)
        setUser(safeUser)
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser))
        setIsLoading(false)
        return { success: true }
      }

      // 2. Try Supabase Auth if input looks like an email
      if (supabase && cleanInput.includes('@')) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanInput,
            password: password,
          })

          if (!error && data?.user) {
            const sbUser = data.user
            const rawProfile: UserProfile = {
              id: sbUser.id,
              email: sbUser.email || cleanInput,
              username: sbUser.user_metadata?.username || cleanInput.split('@')[0],
              full_name: sbUser.user_metadata?.full_name || 'AgriSmart User',
              phone: sbUser.user_metadata?.phone || '+252 61 000 0000',
              region: sbUser.user_metadata?.region || 'Lower Shabelle',
              farm_size: sbUser.user_metadata?.farm_size || '10 Hectares',
              role: 'User',
              created_at: sbUser.created_at,
            }
            const userProfile = sanitizeUserProfile(rawProfile)
            saveUserToList(userProfile)
            setUser(userProfile)
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(userProfile))
            setIsLoading(false)
            return { success: true }
          }
        } catch (sbErr) {
          console.warn('Supabase signInWithPassword fallback:', sbErr)
        }
      }

      // 3. Fallback: Create dynamic user profile if logging in with new credentials
      const createdUser: UserProfile = sanitizeUserProfile({
        id: `user-${Date.now()}`,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@agrismart.so`,
        username: cleanInput.replace('@agrismart.so', ''),
        full_name: cleanInput.split('@')[0].replace('.', ' ').replace('_', ' ').toUpperCase(),
        phone: '+252 61 555 0192',
        region: 'Somalia Sector',
        farm_size: '12 Hectares',
        role: 'User',
        created_at: new Date().toISOString(),
      })
      saveUserToList(createdUser)
      setUser(createdUser)
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(createdUser))
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err?.message || 'Khalad ayaa dhacay xilliga soo galitaanka.' }
    }
  }

  // SIGNUP / REGISTRATION FUNCTION
  const signup = async (data: {
    email: string
    username: string
    full_name: string
    password: string
    phone?: string
    city?: string
    district?: string
    region?: string
    farm_size?: string
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    const cleanEmail = data.email.trim().toLowerCase()
    const cleanUsername = data.username.trim().toLowerCase().replace(/\s+/g, '_')

    try {
      // Check if user already exists
      const existingUser = allUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
      )

      if (existingUser) {
        // Log in as existing user
        switchUser(existingUser)
        setIsLoading(false)
        return { success: true }
      }

      let newUserId = `user-${Date.now()}`

      // Try Supabase Registration if configured
      if (supabase) {
        try {
          const { data: sbData, error: sbError } = await supabase.auth.signUp({
            email: cleanEmail,
            password: data.password,
            options: {
              data: {
                username: cleanUsername,
                full_name: data.full_name,
                phone: data.phone || '+252 61 000 0000',
                city: data.city || 'Muqdisho',
                district: data.district || '',
                region: data.region || 'Lower Shabelle',
                farm_size: data.farm_size || '10 Hectares',
                role: 'User',
              },
            },
          })

          if (!sbError && sbData?.user) {
            newUserId = sbData.user.id
          }
        } catch (sbErr) {
          console.warn('Supabase signup skipped, using local auth storage:', sbErr)
        }
      }

      // Construct New Custom User Profile
      const newUserProfile: UserProfile = sanitizeUserProfile({
        id: newUserId,
        email: cleanEmail,
        username: cleanUsername,
        full_name: data.full_name,
        phone: data.phone || '+252 61 000 0000',
        city: data.city || 'Muqdisho',
        district: data.district || 'Hodan',
        region: data.region || (data.city ? `${data.city} Sector` : 'Lower Shabelle (Afgooye Sector)'),
        farm_size: data.farm_size || '10 Hectares',
        role: 'User',
        created_at: new Date().toISOString(),
      })

      // Save locally and set active user
      saveUserToList(newUserProfile)
      setUser(newUserProfile)
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUserProfile))

      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err?.message || 'Khalad ayaa dhacay intii ay soocotay is-diiwaangelintu.' }
    }
  }

  // LOGOUT FUNCTION
  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (e) {
      console.warn('Supabase logout warning:', e)
    } finally {
      setUser(null)
      localStorage.removeItem(STORAGE_SESSION_KEY)
      setIsLoading(false)
    }
  }

  // UPDATE PROFILE FUNCTION
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not logged in' }

    const isCallerAdmin = isUserAdmin(user)
    const safeRole = isCallerAdmin ? (data.role || user.role || 'Admin') : 'User'
    const updated: UserProfile = { ...user, ...data, role: safeRole }
    setUser(updated)
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated))

    // Update in allUsers array
    setAllUsers((prev) => {
      const updatedList = prev.map((u) => (u.id === user.id ? updated : u))
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList))
      return updatedList
    })

    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        allUsers,
        login,
        signup,
        logout,
        switchUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
