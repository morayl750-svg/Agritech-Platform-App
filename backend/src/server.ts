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
