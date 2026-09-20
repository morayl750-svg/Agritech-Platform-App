import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { askAI } from '@/lib/api'

export interface YieldPredictionResult {
  estimatedYield: string
  confidence: string
  factors: string[]
  recommendations: string[]
  aiAnalysis: string
}

export interface YieldFormData {
  crop_type: string
  region: string
  area_hectares: number
  planting_date: string
  irrigation_type: string
  soil_type: string
}

const CROP_BASE_YIELDS: Record<string, number> = {
  Sorghum:  1.8,
  Maize:    2.5,
  Sesame:   0.7,
  Bananas:  25.0,
  Tomatoes: 18.0,
  Onions:   12.0,
  Cowpeas:  1.0,
}

export function useYieldPrediction() {
  const [result, setResult] = useState<YieldPredictionResult | null>(null)
  const [history, setHistory] = useState<{ crop: string; region: string; yield_est: string; date: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (form: YieldFormData): Promise<void> => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Build AI prompt in Somali/English
      const prompt = `You are AgriSmart AI for Somali farmers. A farmer provides this data:
- Crop: ${form.crop_type}
- Region: ${form.region}
- Area: ${form.area_hectares} hectares
- Planting date: ${form.planting_date}
- Irrigation: ${form.irrigation_type}
- Soil type: ${form.soil_type}

Provide a yield estimate in JSON format strictly like:
{
  "estimatedYield": "X.X tons",
  "confidence": "High/Medium/Low",
  "factors": ["factor1", "factor2", "factor3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "aiAnalysis": "2-3 sentences in Somali explaining the prediction"
}
Base your estimate on typical Somali agricultural conditions. Return ONLY valid JSON.`

      const { response } = await askAI(prompt)

      // Try parsing JSON from AI response
      let parsed: YieldPredictionResult | null = null
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[0]) } catch { /* ignore */ }
      }

      if (!parsed) {
        // Fallback calculation
        const baseYield = CROP_BASE_YIELDS[form.crop_type] ?? 1.5
        const irrigationMultiplier = form.irrigation_type === 'Drip' ? 1.3 : form.irrigation_type === 'Flood' ? 1.1 : 0.85
        const soilMultiplier = form.soil_type === 'Clay Loam' ? 1.15 : form.soil_type === 'Sandy' ? 0.85 : 1.0
        const totalYield = (baseYield * form.area_hectares * irrigationMultiplier * soilMultiplier).toFixed(1)

        parsed = {
          estimatedYield: `${totalYield} tons`,
          confidence: 'Medium',
          factors: ['Cimilada gobolka', `Waraabka ${form.irrigation_type}`, `Carrada ${form.soil_type}`],
          recommendations: ['Bacriminta ku dar xilliga ku haboon', 'Cayayaanka ka ilaali'],
          aiAnalysis: response.slice(0, 300),
        }
      }

      setResult(parsed)

      // Save to Supabase
      await supabase.from('yield_predictions').insert({
        crop_type: form.crop_type,
        region: form.region,
        area_hectares: form.area_hectares,
        planting_date: form.planting_date,
        irrigation_type: form.irrigation_type,
        soil_type: form.soil_type,
        ai_analysis: parsed.aiAnalysis,
      })

      setHistory(prev => [{
        crop: form.crop_type,
        region: form.region,
        yield_est: parsed!.estimatedYield,
        date: new Date().toLocaleDateString('so-SO'),
      }, ...prev.slice(0, 4)])

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Saadaashinta ayaa fashilantay'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, history, loading, error, predict }
}
