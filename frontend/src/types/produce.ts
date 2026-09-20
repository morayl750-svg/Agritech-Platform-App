export type ProduceCategory =
  | 'All'
  | 'Khudaarta Cagaaran'
  | 'Khudaarta Asalka ah'
  | 'Miraha Beeraha'
  | 'Sanduuqyo & Jumlo'

export interface ProduceItem {
  id: string
  name: string
  somali_name: string
  description: string
  price: number
  unit: string // e.g. '1 kg', 'Sanduuq (15kg)', 'Xabo', 'Xidhmo'
  category: ProduceCategory
  farm_origin: string // e.g. 'Afgooye, Shabelle Hoose'
  freshness: 'Maanta la soo guray' | 'Shalay la soo guray' | '100% Dabiici'
  stock_kg: number
  image_url: string
  is_organic?: boolean
  nutrition_highlight?: string
}

export interface ProduceCartItem {
  produce: ProduceItem
  quantity: number // e.g. 2 means 2 units / 2 kg
}

export interface ProduceCustomer {
  full_name: string
  phone: string
  city: string
  district: string
  delivery_notes?: string
}

export type ProduceOrderStatus = 'Diyaarin' | 'Gaadiidka ayaa wada' | 'Waa la keenay' | 'La Joojiyay'

export interface ProduceOrder {
  id: string
  customer: ProduceCustomer
  items: ProduceCartItem[]
  subtotal: number
  delivery_fee: number
  total_amount: number
  status: ProduceOrderStatus
  payment_method: 'EVC Plus / Zaad / Sahal' | 'Kaash marka la keeno (COD)'
  payment_status?: 'Pending' | 'Paid' | 'Failed'
  transaction_id?: string
  order_step?: number
  created_at: string
}
