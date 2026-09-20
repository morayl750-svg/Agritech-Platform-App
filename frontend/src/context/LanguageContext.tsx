import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'so' | 'sw' | 'am'

export interface LanguageMeta {
  code: Language
  label: string
  nativeName: string
  flag: string
  dir: 'ltr' | 'rtl'
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English',  nativeName: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'so', label: 'Somali',   nativeName: 'Soomaali', flag: '🇸🇴', dir: 'ltr' },
  { code: 'sw', label: 'Swahili',  nativeName: 'Kiswahili',flag: '🇰🇪', dir: 'ltr' },
  { code: 'am', label: 'Amharic',  nativeName: 'አማርኛ',    flag: '🇪🇹', dir: 'ltr' },
]

// Translation dictionary
export const translations = {
  // NAV / SIDEBAR
  nav_dashboard:         { en: 'Dashboard',        so: 'Bogga Hore',        sw: 'Dashibodi',          am: 'ዋና ገጽ' },
  nav_ai_agronomist:     { en: 'AI Agronomist',    so: 'Khabiirka AI',      sw: 'AI Agronomist',      am: 'AI ግብርና' },
  nav_vegetables:        { en: 'Fresh Vegetables', so: 'Dalabka Khudaarta', sw: 'Mboga Safi',         am: 'ትኩስ አትክልት' },
  nav_pesticides:        { en: 'Pesticides Market',so: 'Sunta Cayayaanka',  sw: 'Dawa za Wadudu',     am: 'ፀረ-ተባይ ገበያ' },
  nav_weather:           { en: 'Weather',           so: 'Cimilada',          sw: 'Hali ya Hewa',       am: 'የአየር ሁኔታ' },
  nav_marketplace:       { en: 'Marketplace',       so: 'Suuqa',             sw: 'Soko',               am: 'ገበያ' },
  nav_livestock:         { en: 'Livestock & Crops', so: 'Xoolaha & Dalagyada', sw: 'Mifugo & Mazao',  am: 'እንስሳትና ሰብሎች' },
  nav_ledger:            { en: 'Financial Ledger',  so: 'Xisaabaadka',       sw: 'Daftari la Fedha',   am: 'የፋይናንስ ሂሳብ' },
  nav_community:         { en: 'Community',         so: 'Bulshada',          sw: 'Jumuiya',            am: 'ማህበረሰብ' },
  nav_farm_map:          { en: 'Farm Map',          so: 'Khariidadda Beeraha', sw: 'Ramani ya Shamba', am: 'የእርሻ ካርታ' },
  nav_crop_disease:      { en: 'Crop Disease AI',   so: 'Cudurada Dhirta AI', sw: 'Ugonjwa wa Mazao AI', am: 'የሰብል በሽታ AI' },
  nav_yield_predict:     { en: 'Yield Prediction',  so: 'Saadaasha AI',      sw: 'Utabiri wa Mavuno',  am: 'የምርት ትንበያ' },
  nav_market_prices:     { en: 'Market Prices',     so: 'Qiimaha Suuqa',     sw: 'Bei za Soko',        am: 'የገበያ ዋጋ' },
  nav_messages:          { en: 'Direct Messages',   so: 'Farriimaha Tooska ah', sw: 'Ujumbe wa Moja kwa Moja', am: 'ቀጥተኛ መልዕክቶች' },
  nav_schedule:          { en: 'Crop Scheduler',    so: 'Jadwalka Beerista', sw: 'Ratiba ya Mazao',    am: 'የሰብል መርሃ ግብር' },
  nav_admin:             { en: 'Admin Analytics',   so: 'Xogta Maamulka',    sw: 'Takwimu za Usimamizi', am: 'የአስተዳዳሪ ትንታኔ' },
  nav_settings:          { en: 'Settings',          so: 'Habeynta',          sw: 'Mipangilio',         am: 'ቅንብሮች' },

  // HEADER
  search_placeholder:    { en: 'Search…',           so: 'Raadi…',            sw: 'Tafuta…',            am: 'ፈልግ…' },

  // AUTH PAGE
  auth_title:            { en: 'AgriSmart Platform', so: 'AgriSmart Platform', sw: 'Jukwaa la AgriSmart', am: 'AgriSmart መድረክ' },
  auth_subtitle:         { en: 'Smart Farm Management System', so: 'Nidaamka Maamulka Beeralaha', sw: 'Mfumo wa Usimamizi wa Shamba', am: 'ዘመናዊ የእርሻ አስተዳደር ሥርዓት' },
  auth_login_tab:        { en: 'Log In',            so: 'Soo Gal',           sw: 'Ingia',              am: 'ግባ' },
  auth_signup_tab:       { en: 'Sign Up',            so: 'Diiwaanso',         sw: 'Jisajili',           am: 'ተመዝገብ' },
  auth_quick_select:     { en: 'Quick Select User', so: 'Dooro Isticmaalaha', sw: 'Chagua Mtumiaji',   am: 'ተጠቃሚ ምረጥ' },
  auth_or_manual:        { en: 'Or Login Manually', so: 'Ama Soo Gal Si Gaar', sw: 'Au Ingia Mwenyewe', am: 'ወይም ግባ' },
  auth_email_label:      { en: 'Email or Username', so: 'Email ama Username', sw: 'Barua pepe au Jina', am: 'ኢሜይል ወይም ስም' },
  auth_password_label:   { en: 'Password',          so: 'Sirta',             sw: 'Nenosiri',           am: 'የይለፍ ቃል' },
  auth_login_btn:        { en: 'Log In',             so: 'Soo Gal',           sw: 'Ingia',              am: 'ግባ' },
  auth_fullname_label:   { en: 'Full Name',          so: 'Magacaaga',         sw: 'Jina Kamili',        am: 'ሙሉ ስም' },
  auth_username_label:   { en: 'Username',           so: 'Username',          sw: 'Jina la Mtumiaji',   am: 'የተጠቃሚ ስም' },
  auth_phone_label:      { en: 'Phone / WhatsApp',   so: 'Telefoon',          sw: 'Simu / WhatsApp',    am: 'ስልክ' },
  auth_region_label:     { en: 'Region / Farm',      so: 'Gobolka / Beerta',  sw: 'Mkoa / Shamba',      am: 'ክልል / እርሻ' },
  auth_confirm_pass:     { en: 'Confirm Password',   so: 'Xaqiiji Sirta',     sw: 'Thibitisha Nenosiri', am: 'ይለፍ ቃሉን አረጋግጥ' },
  auth_signup_btn:       { en: 'Create Account',     so: 'Sameey Koonto',     sw: 'Tengeneza Akaunti',  am: 'መለያ ፍጠር' },
  auth_logging_in:       { en: 'Logging in…',        so: 'Soo galayaa…',      sw: 'Inaingia…',          am: 'እየገባ ነው…' },
  auth_registering:      { en: 'Registering…',       so: 'Diiwaangelinayaa…', sw: 'Inajisajili…',       am: 'እየተመዘገበ ነው…' },
  auth_security_note:    { en: 'Encrypted 256-Bit SSL Security', so: 'Nidaam Ammaan SSL 256-bit', sw: 'Usalama wa SSL Bits 256', am: '256-Bit SSL ደህንነት' },

  // PROFILE POPOVER
  profile_title:         { en: 'My Profile',        so: 'Profile-kaaga',     sw: 'Wasifu Wangu',       am: 'የኔ መገለጫ' },
  profile_settings:      { en: 'Settings',          so: 'Habeynta',          sw: 'Mipangilio',         am: 'ቅንብሮች' },
  profile_switch_user:   { en: 'Switch User',       so: 'Bedel Isticmaalaha', sw: 'Badilisha Mtumiaji', am: 'ተጠቃሚ ቀይር' },
  profile_logout:        { en: 'Log Out',           so: 'Ka bax nidaamka',   sw: 'Toka',               am: 'ውጣ' },
  profile_select_user:   { en: 'Select User:',      so: 'Dooro Isticmaalaha:', sw: 'Chagua Mtumiaji:', am: 'ተጠቃሚ ምረጥ:' },
  profile_back:          { en: 'Back',              so: 'Ka noqo',           sw: 'Rudi',               am: 'ተመለስ' },
  profile_add_user:      { en: 'Add New Account',   so: 'Sameey Koonto Cusub', sw: 'Ongeza Akaunti',   am: 'አዲስ መለያ ጨምር' },

  // REMINDERS
  reminders_title:       { en: 'Reminders & Alerts', so: 'Xusuusinta & Digniinaha', sw: 'Ukumbusho & Tahadhari', am: 'አስታዋሾች እና ማስጠንቀቂያዎች' },
  reminders_subtitle:    { en: 'Irrigation, Harvest & Weather', so: 'Waraabka, Goosashada & Cimilada', sw: 'Umwagiliaji, Mavuno & Hewa', am: 'መስኖ፣ ምርት እና የአየር ሁኔታ' },
  reminders_new:         { en: 'New',               so: 'Cusub',             sw: 'Mpya',               am: 'አዲስ' },
  reminders_all:         { en: 'All',               so: 'Dhamaan',           sw: 'Zote',               am: 'ሁሉም' },
  reminders_alerts:      { en: 'Alerts',            so: 'Digniinaha',        sw: 'Tahadhari',          am: 'ማስጠንቀቂያዎች' },
  reminders_irrigation:  { en: 'Irrigation',        so: 'Waraabka',          sw: 'Umwagiliaji',        am: 'መስኖ' },
  reminders_harvest:     { en: 'Harvest',           so: 'Goosashada',        sw: 'Mavuno',             am: 'ምርት' },
  reminders_empty:       { en: 'No reminders in this category.', so: 'Xusuusino ma jiraan qaybtan.', sw: 'Hakuna ukumbusho katika kategoria hii.', am: 'በዚህ ምድብ ውስጥ አስታዋሾች የሉም።' },
  reminders_emergency:   { en: 'Emergency weather alert active!', so: 'Digniin Degdeg ah oo cimilada halista ah ayaa jirta!', sw: 'Tahadhari ya dharura ya hali ya hewa!', am: 'አስቸኳይ የአየር ሁኔታ ማስጠንቀቂያ!' },
  reminders_urgent:      { en: 'Urgent',            so: 'Degdeg',            sw: 'Haraka',             am: 'አስቸኳይ' },
  reminders_mark_done:   { en: 'Mark as done',      so: 'Dhamays',           sw: 'Kamilika',           am: 'ተጠናቋል' },
  reminders_mark_active: { en: 'Mark as active',    so: 'Firfircoon',        sw: 'Amilisha',           am: 'ንቁ' },
  reminders_delete:      { en: 'Delete',            so: 'Tirtir',            sw: 'Futa',               am: 'ሰርዝ' },

  // DASHBOARD
  dash_welcome:          { en: 'Welcome back',      so: 'Ku soo dhowow',     sw: 'Karibu tena',        am: 'እንኳን ደህና መጡ' },
  dash_total_income:     { en: 'Total Income',      so: 'Dakhliga Guud',     sw: 'Mapato Yote',        am: 'ጠቅላላ ገቢ' },
  dash_total_expense:    { en: 'Total Expenses',    so: 'Kharashaadka Guud', sw: 'Gharama Zote',       am: 'ጠቅላላ ወጪ' },
  dash_balance:          { en: 'Net Balance',       so: 'Dheefta Saafiga',   sw: 'Salio la Wavu',      am: 'የተጣራ ሚዛን' },

  // FINANCIAL LEDGER
  ledger_title:          { en: 'Financial Ledger',  so: 'Xisaabaadka Dhaqaalaha', sw: 'Daftari la Fedha', am: 'የፋይናንስ ሂሳብ' },
  ledger_subtitle:       { en: 'Farm bookkeeping & transaction management.', so: 'Maamulka xisaabaadka beerta.', sw: 'Uhasibu wa shamba na miamala.', am: 'የእርሻ ሂሳብ አያያዝ።' },
  ledger_add:            { en: 'Add Transaction',   so: 'Ku Dar Xisaab',     sw: 'Ongeza Muamala',     am: 'ልውውጥ ጨምር' },
  ledger_export:         { en: 'Excel / CSV',       so: 'Excel / CSV',       sw: 'Excel / CSV',        am: 'Excel / CSV' },
  ledger_print:          { en: 'Print / PDF',       so: 'Daabac / PDF',      sw: 'Chapisha / PDF',     am: 'አትም / PDF' },

  // MARKETPLACE
  market_title:          { en: 'Marketplace',       so: 'Suuqa',             sw: 'Soko',               am: 'ገበያ' },
  market_add_product:    { en: 'Add Product',       so: 'Ku Dar Alaab',      sw: 'Ongeza Bidhaa',      am: 'ምርት ጨምር' },
  market_search:         { en: 'Search products…',  so: 'Raadi alaabta…',    sw: 'Tafuta bidhaa…',     am: 'ምርቶችን ፈልግ…' },
  market_all:            { en: 'All',               so: 'Dhamaan',           sw: 'Zote',               am: 'ሁሉም' },

  // COMMUNITY
  community_title:       { en: 'Community',         so: 'Bulshada Beeraleyda', sw: 'Jamii ya Wakulima', am: 'የገበሬዎች ማህበረሰብ' },
  community_post:        { en: 'New Post',          so: 'Qoraal Cusub',      sw: 'Chapisho Jipya',     am: 'አዲስ ጽሑፍ' },
  community_replies:     { en: 'replies',           so: 'jawaabo',           sw: 'majibu',             am: 'መልሶች' },
  community_empty:       { en: 'No posts found.',   so: 'Wax qoraal ah ma jiraan.', sw: 'Hakuna machapisho.', am: 'ምንም ጽሑፎች አልተገኙም።' },

  // WEATHER
  weather_title:         { en: 'Weather',           so: 'Cimilada',          sw: 'Hali ya Hewa',       am: 'የአየር ሁኔታ' },
  weather_feel:          { en: 'Feels like',        so: 'Dareemida',         sw: 'Inahisi kama',       am: 'ይሰማል እንደ' },
  weather_humidity:      { en: 'Humidity',          so: 'Qoyaanta',          sw: 'Unyevu',             am: 'እርጥበት' },
  weather_wind:          { en: 'Wind',              so: 'Dabaysha',          sw: 'Upepo',              am: 'ነፋስ' },

  // COMMON
  common_loading:        { en: 'Loading…',          so: 'Sugayaa…',          sw: 'Inapakia…',          am: 'እየጫነ ነው…' },
  common_error:          { en: 'An error occurred', so: 'Khalad ayaa dhacay', sw: 'Hitilafu imetokea', am: 'ስህተት ተፈጥሯል' },
  common_retry:          { en: 'Retry',             so: 'Isku day',          sw: 'Jaribu tena',        am: 'እንደገና ሞክር' },
  common_save:           { en: 'Save',              so: 'Keydi',             sw: 'Hifadhi',            am: 'አስቀምጥ' },
  common_cancel:         { en: 'Cancel',            so: 'Jooji',             sw: 'Ghairi',             am: 'ሰርዝ' },
  common_submit:         { en: 'Submit',            so: 'Dir',               sw: 'Wasilisha',          am: 'አስገባ' },
  common_close:          { en: 'Close',             so: 'Xidh',              sw: 'Funga',              am: 'ዝጋ' },
  common_language:       { en: 'Language',          so: 'Luqadda',           sw: 'Lugha',              am: 'ቋንቋ' },
  common_reload:         { en: 'Reload System',     so: 'Cusboonaysii Nidaamka', sw: 'Anza Upya Mfumo', am: 'ሥርዓቱን ደግሞ ጫን' },
} as const

export type TranslationKey = keyof typeof translations

// Context
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  currentLang: LanguageMeta
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'agrismart_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null
    return saved && ['en', 'so', 'sw', 'am'].includes(saved) ? saved : 'so'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  const t = (key: TranslationKey): string => {
    const entry = translations[key]
    return entry ? (entry[language] ?? entry['en']) : key
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
