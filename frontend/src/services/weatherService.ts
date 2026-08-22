export interface SomaliRegion {
  id: string
  name: string
  capital: string
  lat: number
  lon: number
  temp?: number
  condition?: string
  conditionSomali?: string
  humidity?: number
  windSpeed?: number
  rainChance?: number
}

export interface LiveWeatherData {
  regionName: string
  capitalName: string
  temperature: number
  conditionCode: number
  conditionText: string
  conditionSomali: string
  humidity: number
  windSpeed: number
  uvIndex: number
  precipitationChance: number
  pressureMb: number
  updatedAt: string
  isDay: boolean
  forecastDays: ForecastDay[]
}

export interface ForecastDay {
  date: string
  dayAbbr: string
  maxTemp: number
  minTemp: number
  conditionCode: number
  conditionText: string
  conditionSomali: string
  precipitationChance: number
  rainHeight: number
}

export const SOMALI_REGIONS: SomaliRegion[] = [
  { id: 'banaadir', name: 'Banaadir', capital: 'Muqdisho', lat: 2.0469, lon: 45.3182, temp: 28, condition: 'Partly Cloudy', conditionSomali: 'Is-badal-badal', humidity: 65, windSpeed: 12, rainChance: 10 },
  { id: 'bari', name: 'Bari', capital: 'Boosaaso', lat: 11.2842, lon: 49.1816, temp: 35, condition: 'Hot', conditionSomali: 'Kuleyl', humidity: 40, windSpeed: 18, rainChance: 5 },
  { id: 'nugaal', name: 'Nugaal', capital: 'Garowe', lat: 8.4021, lon: 48.4828, temp: 33, condition: 'Dry', conditionSomali: 'Qallalan', humidity: 35, windSpeed: 14, rainChance: 0 },
  { id: 'mudug', name: 'Mudug', capital: 'Gaalkacyo', lat: 6.7697, lon: 47.4308, temp: 34, condition: 'Clear', conditionSomali: 'Cadaan', humidity: 30, windSpeed: 16, rainChance: 0 },
  { id: 'galguduud', name: 'Galguduud', capital: 'Dhusamareeb', lat: 5.5350, lon: 46.3861, temp: 32, condition: 'Windy', conditionSomali: 'Dabayl', humidity: 48, windSpeed: 22, rainChance: 10 },
  { id: 'hiiraan', name: 'Hiiraan', capital: 'Beledweyne', lat: 4.7358, lon: 45.2036, temp: 30, condition: 'Cloudy', conditionSomali: 'Caduushan', humidity: 60, windSpeed: 10, rainChance: 25 },
  { id: 'shabeellaha-dhexe', name: 'Shabeellaha Dhexe', capital: 'Jowhar', lat: 2.7809, lon: 45.5020, temp: 29, condition: 'Partly Cloudy', conditionSomali: 'Is-badal-badal', humidity: 68, windSpeed: 11, rainChance: 20 },
  { id: 'shabeellaha-hoose', name: 'Shabeellaha Hoose', capital: 'Marka', lat: 1.7147, lon: 44.7674, temp: 28, condition: 'Humid', conditionSomali: 'Qoyaan Leh', humidity: 75, windSpeed: 15, rainChance: 15 },
  { id: 'bay', name: 'Bay', capital: 'Baydhabo', lat: 3.1138, lon: 43.6498, temp: 31, condition: 'Sunny', conditionSomali: 'Dharab', humidity: 55, windSpeed: 13, rainChance: 10 },
  { id: 'bakool', name: 'Bakool', capital: 'Xuddur', lat: 4.1213, lon: 43.8894, temp: 33, condition: 'Clear', conditionSomali: 'Cadaan', humidity: 42, windSpeed: 14, rainChance: 5 },
  { id: 'gedo', name: 'Gedo', capital: 'Garbaharey', lat: 3.8031, lon: 42.5442, temp: 34, condition: 'Hot', conditionSomali: 'Kuleyl', humidity: 38, windSpeed: 15, rainChance: 5 },
  { id: 'jubbada-dhexe', name: 'Jubbada Dhexe', capital: "Bu'aale", lat: 1.0833, lon: 42.5833, temp: 30, condition: 'Partly Cloudy', conditionSomali: 'Is-badal-badal', humidity: 65, windSpeed: 9, rainChance: 30 },
  { id: 'jubbada-hoose', name: 'Jubbada Hoose', capital: 'Kismaayo', lat: -0.3582, lon: 42.5454, temp: 27, condition: 'Breezy', conditionSomali: 'Dabayl Yarr', humidity: 72, windSpeed: 19, rainChance: 20 },
  { id: 'woqooyi-galbeed', name: 'Woqooyi Galbeed', capital: 'Hargeysa', lat: 9.5600, lon: 44.0650, temp: 26, condition: 'Moderate', conditionSomali: 'Dhexdhexaad', humidity: 50, windSpeed: 14, rainChance: 15 },
  { id: 'togdheer', name: 'Togdheer', capital: 'Burco', lat: 9.5221, lon: 45.5342, temp: 29, condition: 'Warm', conditionSomali: 'Diiran', humidity: 45, windSpeed: 17, rainChance: 10 },
  { id: 'sanaag', name: 'Sanaag', capital: 'Erigavo', lat: 10.6167, lon: 47.3667, temp: 24, condition: 'Cool', conditionSomali: 'Qabow', humidity: 52, windSpeed: 16, rainChance: 15 },
  { id: 'sool', name: 'Sool', capital: 'Laas Caanood', lat: 8.4774, lon: 47.3597, temp: 31, condition: 'Sunny', conditionSomali: 'Qarxan', humidity: 40, windSpeed: 15, rainChance: 5 },
  { id: 'awdal', name: 'Awdal', capital: 'Boorama', lat: 9.9352, lon: 43.1834, temp: 27, condition: 'Pleasant', conditionSomali: 'Wacan', humidity: 55, windSpeed: 12, rainChance: 15 }
]

const SOMALI_DAYS = ['AXD', 'ISN', 'TAL', 'ARB', 'KHM', 'JUM', 'SAB']
const SOMALI_DAYS_FULL = ['Axdad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti']
const SOMALI_MONTHS = [
  'Jannaayo', 'Febraayo', 'Moorso', 'Abriil', 'Maajo', 'Juun',
  'Julaay', 'Agoosto', 'Sabbaan', 'Oktoobar', 'Nofeembar', 'Deseembar'
]

export function formatSomaliDate(date: Date = new Date()): string {
  const dayName = SOMALI_DAYS_FULL[date.getDay()]
  const dayNum = date.getDate()
  const monthName = SOMALI_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${dayName}, ${dayNum} ${monthName} ${year}`
}

export function getSomaliDayAbbr(date: Date): string {
  return SOMALI_DAYS[date.getDay()]
}

export function parseWMOCode(code: number): { text: string; somaliText: string; iconType: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunder' | 'fog' | 'wind' } {
  if (code === 0) {
    return { text: 'SUNNY', somaliText: 'Cadaan & Qorrax', iconType: 'sunny' }
  }
  if (code >= 1 && code <= 3) {
    return { text: 'PARTLY CLOUDY', somaliText: 'Is-badal-badal', iconType: 'partly-cloudy' }
  }
  if (code === 45 || code === 48) {
    return { text: 'FOGGY', somaliText: 'Buuq & Cawo', iconType: 'fog' }
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { text: 'RAIN', somaliText: 'Roob', iconType: 'rain' }
  }
  if (code >= 95) {
    return { text: 'THUNDERSTORM', somaliText: 'Gurgur & Hanti', iconType: 'thunder' }
  }
  return { text: 'CLOUDY', somaliText: 'Caduushan', iconType: 'cloudy' }
}

export function getCurrentSomaliSeason(date: Date = new Date()): { name: string; somaliName: string; description: string; advice: string } {
  const month = date.getMonth() + 1 // 1 to 12

  if (month >= 4 && month <= 6) {
    return {
      name: 'Gu',
      somaliName: 'Xilliga Gu (Roobabka Ugu Waaweyn)',
      description: 'Waa xilliga roobabka ugu muhiimsan Soomaaliya. Dhirtu waxay heshaa biyo ku filan.',
      advice: 'Waa xilliga ugu fiican abuurninta beerta iyo ururinta biyaha roobka. Hubi bullaacadaha beerta.'
    }
  } else if (month >= 7 && month <= 9) {
    return {
      name: 'Xagaa',
      somaliName: 'Xilliga Xagaa (Dabayl & Qallayl)',
      description: 'Waa xilliga dabaysha xooggan iyo kuleylka ama qallaylka Gobollada Banadir & Jubbooyinka.',
      advice: 'Waraabi beeraha subaxdii hore ama fiidkii si aad u baadbaadiso 30% biyaha evapo-transpiration-ka.'
    }
  } else if (month >= 10 && month <= 12) {
    return {
      name: 'Deyr',
      somaliName: 'Xilliga Deyr (Roobabka Labaad)',
      description: 'Waa xilliga roobka yar ee labaad ee dalka. Ku habboon falidda iyo dalagyada gaagaaban.',
      advice: 'Ku beer dalagyada u baahan biyo dhexdhexaad ah sida har wheat, galleyda ama sisinta.'
    }
  } else {
    return {
      name: 'Jiilaal',
      somaliName: 'Xilliga Jiilaal (Qallayl Ugu Daran)',
      description: 'Waa xilliga kuleylka iyo abaaraha. Ceelasha iyo wabiyada biyuhu way yaraadaan.',
      advice: 'Isticmaal hababka kaydinta biyaha (Drip Irrigation) oo sii xoolaha nafaqo dheeraad ah.'
    }
  }
}

export async function fetchLiveWeather(region: SomaliRegion): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)
    const data = await res.json()

    const current = data.current || {}
    const daily = data.daily || {}

    const parsedCurrent = parseWMOCode(current.weather_code ?? 2)

    const forecastDays: ForecastDay[] = []
    const timeArr: string[] = daily.time || []
    for (let i = 0; i < Math.min(timeArr.length, 7); i++) {
      const dDate = new Date(timeArr[i])
      const code = daily.weather_code?.[i] ?? 1
      const p = parseWMOCode(code)
      forecastDays.push({
        date: timeArr[i],
        dayAbbr: getSomaliDayAbbr(dDate),
        maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? 30),
        minTemp: Math.round(daily.temperature_2m_min?.[i] ?? 22),
        conditionCode: code,
        conditionText: p.text,
        conditionSomali: p.somaliText,
        precipitationChance: daily.precipitation_probability_max?.[i] ?? Math.floor(Math.random() * 20),
        rainHeight: Math.min(Math.max((daily.precipitation_sum?.[i] || 0) * 4, 8), 45),
      })
    }

    return {
      regionName: region.name,
      capitalName: region.capital,
      temperature: Math.round(current.temperature_2m ?? region.temp ?? 28),
      conditionCode: current.weather_code ?? 2,
      conditionText: parsedCurrent.text,
      conditionSomali: parsedCurrent.somaliText,
      humidity: Math.round(current.relative_humidity_2m ?? region.humidity ?? 65),
      windSpeed: Math.round(current.wind_speed_10m ?? region.windSpeed ?? 12),
      uvIndex: Math.min(Math.max(Math.round((current.temperature_2m || 30) / 4), 3), 11),
      precipitationChance: Math.round(current.precipitation ?? region.rainChance ?? 10),
      pressureMb: Math.round(current.surface_pressure ?? 1012),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDay: current.is_day === 1,
      forecastDays: forecastDays.length > 0 ? forecastDays : generateFallbackForecast(),
    }
  } catch (err) {
    console.warn('[Open-Meteo Fetch Fallback]', err)
    return getFallbackWeatherData(region)
  }
}

function generateFallbackForecast(): ForecastDay[] {
  const today = new Date()
  const days: ForecastDay[] = []
  const conditions = [
    { code: 0, text: 'SUNNY', somali: 'Cadaan' },
    { code: 2, text: 'PARTLY CLOUDY', somali: 'Is-badal-badal' },
    { code: 61, text: 'RAIN', somali: 'Roob' },
    { code: 1, text: 'CLOUDY', somali: 'Caduushan' },
  ]

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const cond = conditions[i % conditions.length]
    days.push({
      date: d.toISOString().split('T')[0],
      dayAbbr: getSomaliDayAbbr(d),
      maxTemp: 27 + (i % 4),
      minTemp: 21 + (i % 3),
      conditionCode: cond.code,
      conditionText: cond.text,
      conditionSomali: cond.somali,
      precipitationChance: (i * 15) % 40,
      rainHeight: 12 + (i * 5) % 30,
    })
  }
  return days
}

export function getFallbackWeatherData(region: SomaliRegion): LiveWeatherData {
  return {
    regionName: region.name,
    capitalName: region.capital,
    temperature: region.temp || 28,
    conditionCode: 2,
    conditionText: region.condition?.toUpperCase() || 'PARTLY CLOUDY',
    conditionSomali: region.conditionSomali || 'Is-badal-badal',
    humidity: region.humidity || 65,
    windSpeed: region.windSpeed || 12,
    uvIndex: 6,
    precipitationChance: region.rainChance || 10,
    pressureMb: 1013,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDay: true,
    forecastDays: generateFallbackForecast(),
  }
}
