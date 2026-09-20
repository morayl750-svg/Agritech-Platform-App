import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000

// Initialize Google Gen AI client safely stripping any accidental quotes
const rawApiKey = process.env.GEMINI_API_KEY || ''
const apiKey = rawApiKey.replace(/^["']|["']$/g, '').trim()
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const SYSTEM_GUARDRAIL =
  'You are AgriSmart AI, an expert agricultural and livestock advisor specifically for Somalia and the Horn of Africa. You must ONLY answer questions related to farming, crops (like sorghum, maize, sesame), livestock (camels, goats, cattle), soil health, irrigation, and local weather. If a user asks about politics, coding, general knowledge, or anything unrelated to agriculture, you must politely decline and steer the conversation back to farming. Speak professionally.'

// --- Middleware ---
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: '*', // Allow all origins for seamless Vite dev server connection
    credentials: true,
  })
)

// --- Routes ---

/** GET / - Root API Welcome Route */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgriSmart API Backend',
    version: '1.0.0',
    geminiConfigured: Boolean(ai),
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat',
    },
  })
})

/** GET /api/health */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgriSmart API',
    geminiConfigured: Boolean(ai),
    apiKeyLoaded: Boolean(apiKey),
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  })
})

/** POST /api/chat - Gemini AI Proxy Endpoint with Strict Agricultural Guardrails */
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt string is required' })
      return
    }

    if (!ai) {
      res.status(500).json({
        error: 'Gemini API key is missing on backend server. Please check backend/.env file.',
      })
      return
    }

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    let responseText = ''
    let usedModel = ''
    let lastError: Error | null = null

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_GUARDRAIL,
          },
        })

        if (response && response.text) {
          responseText = response.text
          usedModel = modelName
          break
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
      }
    }

    if (!responseText) {
      const msg = lastError?.message || 'Gemini API failed to generate a response'
      console.warn('[Gemini API Proxy Failure]', msg)
      res.status(500).json({ error: msg })
      return
    }

    res.status(200).json({
      response: responseText,
      model: usedModel,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error processing AI query'
    console.error('[Gemini API Proxy Exception]', errorMsg)
    res.status(500).json({ error: errorMsg })
  }
})

/** POST /api/weather-alerts/check
 *  Checks OpenWeatherMap data and returns whether a given region exceeds the threshold.
 *  Frontend calls this on demand; a cron job / Supabase Edge Function would call it on schedule.
 */
app.post('/api/weather-alerts/check', async (req: Request, res: Response): Promise<void> => {
  try {
    const { region, lat, lon, threshold_mm = 20 } = req.body

    if (!lat || !lon) {
      res.status(400).json({ error: 'lat and lon are required' })
      return
    }

    const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY
    if (!OPENWEATHER_KEY) {
      // Return simulation result when no API key is configured
      const simRain = Math.random() * 40
      res.status(200).json({
        region: region ?? 'Unknown',
        rain24h_mm: parseFloat(simRain.toFixed(1)),
        threshold_mm,
        exceeds: simRain > threshold_mm,
        simulated: true,
        message: simRain > threshold_mm
          ? `Ogeysiis: Roob ${simRain.toFixed(1)}mm ah ayaa la saadaashay. Beeraha u diyaargarow!`
          : `Cimiladu waa caadi. Roob ${simRain.toFixed(1)}mm oo kaliya.`,
      })
      return
    }

    // Real OpenWeatherMap forecast call
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`
    const forecastRes = await fetch(url)
    if (!forecastRes.ok) {
      res.status(502).json({ error: 'OpenWeatherMap API waa fashilantay' })
      return
    }
    const forecastData = await forecastRes.json() as { list: { rain?: { '3h'?: number } }[] }

    // Sum next 24h rain (8 × 3h slots)
    const rain24h = forecastData.list
      .slice(0, 8)
      .reduce((sum, item) => sum + (item.rain?.['3h'] ?? 0), 0)

    res.status(200).json({
      region: region ?? 'Unknown',
      rain24h_mm: parseFloat(rain24h.toFixed(1)),
      threshold_mm,
      exceeds: rain24h > threshold_mm,
      simulated: false,
      message: rain24h > threshold_mm
        ? `⚠️ AgriSmart Digniin: Roob ${rain24h.toFixed(1)}mm ah ayaa ${region} ku soo da'aya 24 saac gudahood!`
        : `Cimiladu waa caadi. Roob ${rain24h.toFixed(1)}mm oo kaliya.`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Weather check failed'
    console.error('[Weather Alert Check]', msg)
    res.status(500).json({ error: msg })
  }
})

/** POST /api/diagnose-crop - Crop Disease Diagnosis with Gemini Multimodal Vision */
app.post('/api/diagnose-crop', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', cropType, region } = req.body

    if (!imageBase64) {
      res.status(400).json({ error: 'Sawir la filayo (imageBase64 is required)' })
      return
    }

    if (!ai) {
      res.status(500).json({ error: 'Gemini API key is missing on backend server.' })
      return
    }

    const systemPrompt = `Waxaad tahay Takhtarka Dhirta oo khibrad dheer u leh beeraha Soomaaliya iyo Geeska Afrika.
Hawshaadu: Sawirka la soo diray si taxaddar leh u falanqee oo bixi warbixin cad oo Af-Soomaali ah:
1. **Magaca Cudurka** (Soomaali & Af-Ingiriisi)
2. **Heerka Khatarta** (Yar / Dhexdhexaad / Xoog Badan / Khatar Weyn)
3. **Calaamadaha lagu gartay**
4. **Sababta ama waxa keena cudurka**
5. **Daawaynta degdegga ah** (dawooyin dabiici ah oo guri laga helo & dawooyin kiimiko ah oo suuqa yaal)
6. **Sida looga hortago mustaqbalka**

Haddii geedku caafimaad qabo oo cudur la arkin, si cad u sheeg inuu caafimaad qabo oo bixi talooyin daryeel.`

    const promptText = `Falanqee sawirkan geedka/dalagga beerta. ${cropType ? `Nooca beerta: ${cropType}.` : ''} ${region ? `Gobolka: ${region}.` : ''}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
      },
    })

    const diagnosisText = response?.text || 'Falanqaynta ma soo bixin jawaab cad.'
    res.status(200).json({ diagnosis: diagnosisText })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Diagnose failed'
    console.error('[Diagnose Crop Error]', errorMsg)
    res.status(500).json({ error: errorMsg })
  }
})

/** POST /api/predict-yield - Yield Prediction AI for Somali Agriculture */
app.post('/api/predict-yield', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      cropType,
      region,
      areahectares,
      plantingDate,
      irrigationType,
      soilType,
      currentWeather,
    } = req.body

    if (!ai) {
      res.status(500).json({ error: 'Gemini API key is missing on backend server.' })
      return
    }

    const prompt = `Waxaad tahay Khabiir Beereed oo xisaabta wax soo saarka ku takhasusay Soomaaliya iyo Geeska Afrika.

Macluumaadka beerta:
- Nooca beerta/dalagga: ${cropType || 'Lama cayimin'}
- Gobolka: ${region || 'Lama cayimin'}
- Baaxadda dhulka: ${areahectares} hectare
- Taariikhda la beeray: ${plantingDate || 'Lama cayimin'}
- Nooca waraabinta: ${irrigationType || 'Roobka kaliya'}
- Nooca ciidda: ${soilType || 'Caadi'}
- Xaaladda cimilada hadda: ${currentWeather || 'Caadi'}

Fadlan bixi warbixin faahfaahsan oo Af-Soomaali ah:
1. **Saadaasha Wax Soo Saarka** (Tirada la filayo: kg/hectare iyo wadar ahaan kg ama tan)
2. **Heerka Kalsoonida Saadaasha** (Sare / Dhexdhexaad / Hoose) iyo sababta
3. **Halista ugu weyn** ee saameyn karta wax soo saarkan
4. **Talooyinka Kordhinta Wax Soo Saarka** (Bacriminta, xilliga waraabka, xakameynta haramaha)
5. **Xilliga ugu habboon ee goynta** (Harvest timing)

Jawaab kooban, qodobbaysan oo si heer sare ah ugu qoran Af-Soomaali sii.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const predictionText = response?.text || 'Saadaashu ma guulaysan.'
    res.status(200).json({ prediction: predictionText })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Yield prediction failed'
    console.error('[Yield Prediction Error]', errorMsg)
    res.status(500).json({ error: errorMsg })
  }
})

/** Helper to normalize Somali phone numbers */
function normalizeSomaliPhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 9 && cleaned.startsWith('6')) return `+252${cleaned}`
  if (cleaned.length === 10 && cleaned.startsWith('06')) return `+252${cleaned.slice(1)}`
  if (cleaned.length === 12 && cleaned.startsWith('252')) return `+${cleaned}`
  if (cleaned.length === 13 && cleaned.startsWith('+252')) return cleaned
  // If valid 7-9 digit local number
  if (cleaned.length >= 7 && cleaned.length <= 10) return `+252${cleaned}`
  return null
}

/** POST /api/payment/initiate - EVC Plus, Zaad, Sahal, Amiin Mobile Payment Endpoint */
app.post('/api/payment/initiate', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      amount,
      currency = 'USD',
      phoneNumber,
      paymentMethod = 'evc_plus',
      productName,
      buyerName = 'Macmiil',
    } = req.body

    if (!phoneNumber || !amount) {
      res.status(400).json({ error: 'Xogta lagama maarmaanka ah ayaa maqan (amount and phoneNumber required)' })
      return
    }

    const normalizedPhone = normalizeSomaliPhone(phoneNumber) || phoneNumber
    const methodNames: Record<string, string> = {
      evc_plus: 'EVC Plus (Hormuud)',
      zaad: 'Zaad (Telesom)',
      amiin: 'Amiin Money (Amal Bank)',
      cash: 'Lacag Caddaan ah',
    }
    const methodName = methodNames[paymentMethod] || paymentMethod.toUpperCase()

    const reference = `AGS-${paymentMethod.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // 95% simulated success rate
    const isSuccess = Math.random() > 0.05

    if (!isSuccess) {
      res.status(402).json({
        error: 'Lacag-bixintu way fashilantay. Fadlan hubi haraaga telefoonkaaga ama lambarka oo mar kale isku day.',
        code: 'PAYMENT_FAILED',
      })
      return
    }

    res.status(200).json({
      success: true,
      reference,
      message: `$${Number(amount).toFixed(2)} ${currency} ayaa si guul leh looga jaray ${normalizedPhone} adigoo isticmaalaya ${methodName}.`,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Payment initiation failed'
    console.error('[Payment Initiate Error]', errorMsg)
    res.status(500).json({ error: errorMsg })
  }
})



/** 404 catch-all */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

/** Generic error handler */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[AgriSmart API Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

// --- Start ---
app.listen(PORT, () => {
  console.log(`AgriSmart API running at http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Gemini proxy endpoint: http://localhost:${PORT}/api/chat`)
  console.log('Gemini API Key loaded:', Boolean(apiKey))
})
