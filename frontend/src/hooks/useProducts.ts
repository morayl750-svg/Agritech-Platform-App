import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductCategory } from '@/types'

export function useProducts(selectedCategory: ProductCategory = 'All', searchQuery: string = '') {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false })

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery.trim()}%`)
      }

      const { data, error: err } = await query

      if (err) throw err

      if (data) {
        setProducts(data as Product[])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch marketplace products from Supabase'
      console.warn('[Supabase Products Fetch Error]', msg)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  }
}
