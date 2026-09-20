import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductCategory } from '@/types'

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'pest-1',
    name: 'Beltas 100EC (Sunta Diirka Galayda & Ayaxa)',
    description: 'Sun aad u awood badan oo si degdeg ah u disha diirka galayda (Fall Armyworm), ayaxa, diirka caleenta cagaaran, iyo cayayaanka dalagyada cuna.',
    price: 24.5,
    category: 'Sunta Cayayaanka',
    seller_name: 'Somali Agro-Chemicals (Afgooye)',
    stock: 50,
    unit: '1 Litir (Dhalo)',
    target_pest: 'Diirka Galayda (Fall Armyworm), Ayaxa, Diirka Cagaaran, Diirka Yaanyada',
    active_ingredient: 'Emamectin Benzoate 5% + Cypermethrin 10% EC',
    dosage: '25ml halkii 16L (Boorso buufin ah)',
    safety_warning: 'Xidho maaskarada iyo galoofisyada. Ka fogee carruurta iyo cuntada. Gacmaha dhaq buufinta kadib.',
    suitable_crops: 'Galeyda, Masagada, Tamaandhada, Digirta, Qaraha',
    waiting_period: '7 Maalmood kahor intaan dalagga la goosan (PHI)',
    application_method: 'Buufinta caleemaha (Foliar Spray) - Aroortii hore ama galabti',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-2',
    name: 'Mancozeb 80% WP (Sunta Boqoshaada & Miridha)',
    description: 'Daawo ka hortag iyo daaweyn heer sare ah u ah cudurrada boqoshaada, miridha caleenta tamaandhada (Late/Early Blight), iyo qudhunka xididka.',
    price: 18.0,
    category: 'Sunta Boqoshaada',
    seller_name: 'Banaadir Crop Protection',
    stock: 75,
    unit: '1 kg Baakad',
    target_pest: 'Miridha Tamaandhada, Caaryada Basasha, Boqoshaada, Qudhunkii Caleenta',
    active_ingredient: 'Mancozeb 800g/kg WP (Wettable Powder)',
    dosage: '40g halkii 16L oo biyo ah (qiyaastii 2 malqacadood)',
    safety_warning: 'Ku buufi subixii hore ama galabti marka qorraxdu degto. Ha buufin xilliga dabaysha xooggan.',
    suitable_crops: 'Tamaandhada, Basasha, Baradhada, Qajaarka, Qaraha',
    waiting_period: '5 Maalmood kahor goynta (PHI)',
    application_method: 'Buufin guud oo caleemaha iyo jirridda lagu qoyo',
    image_url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-3',
    name: 'Force 1.5G (Sunta Cayayaanka Carrada & Qudhaanjada)',
    description: 'Budada carada lagu daro oo disha cayayaanka xididada cuna, gooryaanka dhulka, abaartaa iniinaha, iyo qudhaanjada baabiisa iniinaha la beero.',
    price: 15.0,
    category: 'Sunta Cayayaanka',
    seller_name: 'Shabelle Agrochemicals',
    stock: 60,
    unit: '1 kg Boorso',
    target_pest: 'Qudhaanjada Iniinaha Cunta, Gooryaanka Carrada, Dhiqlaha Dhulka',
    active_ingredient: 'Tefluthrin 15g/kg Granules (G)',
    dosage: '10g halkii geed ama firdhi godka beerta xilliga abuurka',
    safety_warning: 'Gacmaha ku maydh saabuun isticmaalka ka dib. Ha u dhoweyn ilaha biyaha.',
    suitable_crops: 'Abuurka Galeyda, Qare, Basasha, Khudaarta xididada leh',
    waiting_period: '14 Maalmood',
    application_method: 'Ku dhex qas carada ama ku rid godka xilliga la beerayo iniinta',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-4',
    name: 'Roundup PowerMax (Sunta Haramaanka & Cawska Guud)',
    description: 'Sunta nidaamsan ee baabiisa dhammaan noocyada cawska adag, cows-duurka, xididada qallafsan, iyo haramaanka beerta ka baxa ka hor intaan la beerin.',
    price: 22.0,
    category: 'Sunta Haramaanka',
    seller_name: 'Jowhar Agro Distributors',
    stock: 40,
    unit: '1 Litir (Dhalo)',
    target_pest: 'Cawska Adag, Haramaanka Beeraha, Cows-duur, Caws-cagaf',
    active_ingredient: 'Glyphosate Potassium Salt 540g/L SL',
    dosage: '100ml halkii 16L oo biyo ah',
    safety_warning: 'Ha ku buufin dhirta aad rabto inay koraan ama dalagga jira. Ha u oggolaan xoolaha 24 saac.',
    suitable_crops: 'Bannaynta dhulka beeraha ka hor abuurka, dhuumaha waraabka agtooda',
    waiting_period: 'Sug 7 maalmood ka hor intaan beerta la gelin abuur cusub',
    application_method: 'Toos ugu buufi cawska cagaaran ee qoyan',
    image_url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-5',
    name: 'Knapsack Pressure Sprayer 16L (Boorsada Buufinta Beeraha)',
    description: 'Boorsada gacanta lagu buufiyo oo 16 Litir ah, leh tubo naxaas ah (brass nozzle), filter gudaha ah, iyo cadaadis joogto ah oo loogu talagalay beeraha.',
    price: 38.0,
    category: 'Qalabka Buufinta',
    seller_name: 'AgriSmart Machinery & Equipment',
    stock: 30,
    unit: '1 Xabo (Complete Unit)',
    target_pest: 'Qalabka Buufinta Sunta Cayayaanka, Boqoshaada & Nafaqada Caleenta',
    active_ingredient: 'High-Density Polyethylene Body with Brass Lance',
    dosage: 'Awoodda Buuxinta: 16 Litir',
    safety_warning: 'Si fiican u maydh biyo nadiif ah ka dib markaad sun ku buufiso. Ha kaga tagin sun dhexdeeda.',
    suitable_crops: 'Dhammaan noocyada dalagyada beeraha iyo khudaarta',
    waiting_period: 'N/A (Qalab)',
    application_method: 'Gacanta lagu cadaadiyo bamka (Manual Lever Action)',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-6',
    name: 'Agri-Guard PPE Suit & Mask (Dharka & Maaskarada Buufinta)',
    description: 'Dharka ilaalada buufinta oo aan biyaha iyo kimikada gelin, laba waji-xir oo leh shaandhada kaarboonka (Activated Carbon Filter), muraayado, iyo galoofisyo.',
    price: 19.5,
    category: 'Qalabka Buufinta',
    seller_name: 'Horn Safety Equipment',
    stock: 25,
    unit: 'Set (Suit + Mask + Gloves + Goggles)',
    target_pest: 'Badbaadada Beeraleyda & Shaqaalaha Beeraha xilliga buufinta',
    active_ingredient: 'Chemical Resistant Waterproof Synthetic Polymer',
    dosage: 'Cabbirka: Universal Size (L/XL)',
    safety_warning: 'Waa lagama maarmaan marka la buufinayo sunta kimikada ah si looga badbaado neefta iyo maqaarka.',
    suitable_crops: 'Dhammaan beeraha xilliga buufinta kimikada',
    waiting_period: 'N/A (Badbaado)',
    application_method: 'Xiro ka hor intaadan bilaabin qaska sunta',
    image_url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-7',
    name: 'Copper Oxychloride 50WP (Daaweynta Caaryada & Bakteeriyada)',
    description: 'Daawo awood badan oo naxaas ah oo ka hortagta cudurrada bakteeriyada, boqoshaada geedaha liinta, caleen-dhaca qaraha, iyo qudhunka tamaandhada.',
    price: 21.0,
    category: 'Sunta Boqoshaada',
    seller_name: 'Somali Agro-Chemicals (Afgooye)',
    stock: 35,
    unit: '1 kg Baakad',
    target_pest: 'Bakteriyada Khudaarta, Cudurka Liinta, Caaryada Madow',
    active_ingredient: 'Copper Oxychloride 50% WP',
    dosage: '35g halkii 16L biyo ah',
    safety_warning: 'Ka fogee biyaha la cabbo iyo xoolaha. Ha ku dhex qasin sunta kale adoon baarin.',
    suitable_crops: 'Liinta, Mooska, Qaraha, Tamaandhada, Canbaha',
    waiting_period: '3 Maalmood kahor goynta',
    application_method: 'Ku buufi caleemaha iyo jirridda geedka',
    image_url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pest-8',
    name: '2,4-D Amine 720SL (Sunta Haramaanka Caleenta Ballaaran)',
    description: 'Sun doorta oo kaliya haramaanka caleenta ballaaran baabiisa iyadoo aan waxyeello u geysaneyn galayda, masagada ama cawska dalagga ah.',
    price: 16.5,
    category: 'Sunta Haramaanka',
    seller_name: 'Baydhabo Farmers Depot',
    stock: 45,
    unit: '1 Litir (Dhalo)',
    target_pest: 'Haramaanka Caleenta Ballaaran ee Galayda & Masagada',
    active_ingredient: '2,4-D Dimethylamine Salt 720 g/L SL',
    dosage: '50ml halkii 16L biyo ah',
    safety_warning: 'Ha ku buufin geedaha digirta, qaraha ama tamaandhada waayo way dilaysaa.',
    suitable_crops: 'Galeyda, Masagada, Qamadida',
    waiting_period: '21 Maalmood kahor goynta',
    application_method: 'Buufin toos ah oo haramaanka la beegsado',
    image_url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
]

const STORAGE_KEY = 'agrismart_pesticides_custom'

export function useProducts(selectedCategory: ProductCategory = 'All', searchQuery: string = '') {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize and load products from localStorage or demo
  const loadSavedProducts = useCallback((): Product[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Could not read saved products from storage:', e)
    }
    return DEMO_PRODUCTS
  }, [])

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let baseProducts = loadSavedProducts()

      // Attempt to pull any database products from Supabase if available
      if (supabase) {
        try {
          const res = await supabase.from('products').select('*').order('created_at', { ascending: false })
          if (Array.isArray(res?.data) && res.data.length > 0) {
            const dbProducts = res.data as Product[]
            const dbIds = new Set(dbProducts.map((p) => p.id))
            baseProducts = [...dbProducts, ...baseProducts.filter((p) => !dbIds.has(p.id))]
          }
        } catch (e) {
          // ignore network error in demo mode
        }
      }

      let result = [...baseProducts]

      if (selectedCategory !== 'All') {
        result = result.filter((p) => p.category === selectedCategory)
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.target_pest && p.target_pest.toLowerCase().includes(q)) ||
            (p.active_ingredient && p.active_ingredient.toLowerCase().includes(q))
        )
      }

      setProducts(result)
    } catch (err) {
      console.warn('[Marketplace Products Fetch Warning]', err)
      setProducts(loadSavedProducts())
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery, loadSavedProducts])

  // Add new product with persistence
  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to persist new product:', e)
      }
      return updated
    })
  }, [])

  // Update existing product with persistence
  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updatedProduct.id)
      const next = exists
        ? prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        : [updatedProduct, ...prev]

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('Failed to persist updated product:', e)
      }
      return next
    })
  }, [])

  // Delete product
  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('Failed to delete product from storage:', e)
      }
      return next
    })
  }, [])

  // Reset to original catalog if needed
  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
    setProducts(DEMO_PRODUCTS)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault,
  }
}
