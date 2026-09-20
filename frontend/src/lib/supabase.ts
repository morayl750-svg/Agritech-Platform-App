import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

let realClient: SupabaseClient | null = null

try {
  if (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('example')
  ) {
    realClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
} catch (err) {
  console.warn('[Supabase Init Warning]', err)
}

// Dummy query chain proxy to prevent undefined/null method crashes
const createDummyQueryBuilder = (): any => {
  const dummyBuilder: any = {
    select: () => dummyBuilder,
    insert: () => dummyBuilder,
    update: () => dummyBuilder,
    delete: () => dummyBuilder,
    eq: () => dummyBuilder,
    neq: () => dummyBuilder,
    ilike: () => dummyBuilder,
    or: () => dummyBuilder,
    order: () => dummyBuilder,
    limit: () => dummyBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  }
  return dummyBuilder
}

const safeSupabaseProxy = new Proxy(realClient || {}, {
  get(target: any, prop: string) {
    if (realClient && prop in realClient) {
      const value = (realClient as any)[prop]
      if (typeof value === 'function') {
        return value.bind(realClient)
      }
      return value
    }

    if (prop === 'from') {
      return () => createDummyQueryBuilder()
    }

    if (prop === 'auth') {
      return {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      }
    }

    return () => createDummyQueryBuilder()
  },
})

export const supabase = (realClient || safeSupabaseProxy) as SupabaseClient
