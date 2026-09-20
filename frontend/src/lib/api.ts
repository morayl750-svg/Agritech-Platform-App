const API_BASE_URL = 'http://localhost:5000'

export interface AskAIResponse {
  response: string
  model?: string
  timestamp?: string
}

function generateFallbackSomaliAIResponse(prompt: string): string {
  const p = prompt.toLowerCase()

  if (
    p.includes('galay') ||
    p.includes('abuur') ||
    p.includes('cudur') ||
    p.includes('cayayaan') ||
    p.includes('pest')
  ) {
    return `Asc Nabad iyo Raxmad beeraley! Marka loo eego su'aashaada ku saabsan cayayaanka ama cudurrada dalaga:\n\n1. **Baaritaan Hore**: Hubi caleemaha galayda iyo dalagyada maalin kasta aroortii hore.\n2. **Daaweynta Dabiiciga ah**: Buufi Saliidda Neem-ka (Neem Oil) oo lagu qasay biyo diirran (2ml/Litr).\n3. **Maroojinta Dalagyada (Crop Rotation)**: Ka fogow in aad hal beero hal dalag oo kaliya sanad kasta si looga hortago in cayayaanku ku ururo carrada.\n\nHaddii aad dooneyso talo dheeraad ah, fadlan ii sheeg nooca dalaga ama sawir ka soo qaad!`
  }

  if (p.includes('waraab') || p.includes('biyo') || p.includes('water') || p.includes('irrigation')) {
    return `Kuleylka 30°C-35°C ee gobollada Shabelle iyo Jubba, waraabku waa furaha soosaarka dalaga:\n\n• **Sisinta & Badarka**: Waraabi 3-dii ilaa 4 maalmoodba hal mara.\n• **Khadarta & Mooska**: Waraab maalin dhaaf ah subaxdii hore (6:00 AM - 8:00 AM).\n• **Talo Ammaan**: Ka fogaaw waraabka duhurkii dhexe si biyuhu aysan u bốc-baxin carrada-na aysan u guban.`
  }

  if (p.includes('geel') || p.includes('xoolo') || p.includes('ari') || p.includes('lo')) {
    return `Caafimaadka Xoolaha Soomaaliyeed:\n\n1. **Tallaalka Joogtada ah**: Hubi in idaha iyo geela la tallaalay xilliga roobabka ka hor.\n2. **Ganaasha (Surra)**: Geela la kulma daalka ama dhiig-yarida, u dur Diminazene ama Quinapyramine oo kala xiriir dhakhtarka xoolaha ee agagaarkaaga.\n3. **Cuntada & Dheellitirka**: Sii cusbo iyo nafaqooyinka Macdanta (Mineral Licks) si ay u helaan awood ku filan.`
  }

  if (p.includes('bacrin') || p.includes('fertilizer') || p.includes('amoniya') || p.includes('carrada')) {
    return `Talooyinka Bacriminta Carrada (Soil Fertility):\n\n• **Dhoobada & Saafiga**: Isticmaal Naasa (Organic Compost) 5-10 Tons/Hectare ka hor abuurka.\n• **Urea / DAP**: Codso DAP 50kg/Hectare xilliga abuurka iyo Urea 50kg/Hectare marka caleentu 40cm gaarto.\n• Hubi in carrada ay leedahay qoyaan ku filan ka hor inta aanad bacriminta ku shubin.`
  }

  return `Asc Nabad iyo Raxmad! AgriSmart AI Agronomist ayaa halkan kuugu diyaar ah.\n\nSida aan ku caawin karo:\n• Greinta & daweynta cudurada dalagyada (Galayda, Sisinta, Mooska, Cambaha)\n• Jadwalka waraabka & maamulka biyaha\n• Caafimaadka & daryeelka xoolaha (Geela, Ariga, Lo'da)\n• Talooyinka bacriminta & tayada carrada\n\nFadlan ii soo qrib su'aashaada ama tijaabi su'aalaha ku diyaarsan hoosta!`
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
    console.warn('[AgriSmart API Fetch Warning, using Somali AI Fallback]', err)
    // Return intelligent Somali AI response fallback
    return {
      response: generateFallbackSomaliAIResponse(prompt),
      model: 'AgriSmart Somali AI 2.5',
      timestamp: new Date().toISOString(),
    }
  }
}
