export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  phone?: string
  city?: string
  district?: string
  region?: string
  farm_size?: string
  role?: 'Admin' | 'User' | 'Farmer' | 'Agronomist' | 'Merchant'
  created_at?: string
}

export interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  allUsers: UserProfile[]
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: {
    email: string
    username: string
    full_name: string
    password: string
    phone?: string
    city?: string
    district?: string
    region?: string
    farm_size?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  switchUser: (selectedUser: UserProfile) => void
  updateUserProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
}

