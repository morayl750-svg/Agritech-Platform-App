const API_BASE_URL = 'http://localhost:5000'

export interface AskAIResponse {
  response: string
  model?: string
  timestamp?: string
}

export async function askAI(prompt: string): Promise<AskAIResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.error || `Server error (${res.status})`)
    }

    const data = (await res.json()) as AskAIResponse
    return data
  } catch (err) {
    console.warn('[AgriSmart API Fetch Error]', err)
    throw new Error('Unable to connect to the AgriSmart AI server. Please check your connection.')
  }
}
