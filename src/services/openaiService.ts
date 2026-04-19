// API key - Railway env veya fallback
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export function getStoredApiKey(): string {
  return API_KEY;
}

export function hasApiKey(): boolean {
  return !!API_KEY;
}

interface OpenAIAnalysisResponse {
  product_summary: string;
  detected_features: string[];
  search_keywords: string[];
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  summary_comment: string;
  top_matches: Array<{
    title: string;
    patent_number: string;
    summary: string;
    similarity_score: number;
    match_reasons: string[];
    category: string;
  }>;
  risk_factors: string[];
  uniqueness_suggestions: string[];
}

export async function analyzeWithOpenAI(inputText: string): Promise<OpenAIAnalysisResponse> {
  if (!API_KEY) {
    throw new Error('API yapılandırma hatası. Lütfen site yöneticisiyle iletişime geçin.');
  }

  const systemPrompt = `Sen MarkaRadar'ın uzman marka çakışma analistisın. Kullanıcının verdiği marka adını ve sektörü kapsamlı şekilde araştırarak gerçek çakışma riski analizi yapıyorsun.

Şunları araştır ve analiz et:
1. Türkiye'de aynı veya fonetik benzer isimde tescilli/aktif markalar (TÜRKPATENT veritabanı referans al)
2. Aynı sektörde Türkiye'de faaliyet gösteren bilinen markalar, e-ticaret siteleri, işletmeler
3. Fonetik benzerlik: telaffuz benzerliği hukuki risk yaratır
4. Uluslararası markalar (EUIPO, WIPO kapsamında Türkiye'de koruma altında olanlar)
5. Nice sınıflandırmasına göre risk değerlendirmesi

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "product_summary": "Markanın 3-4 cümlelik detaylı özeti",
  "detected_features": ["özellik1", "özellik2", "özellik3", "özellik4"],
  "search_keywords": ["anahtar1", "anahtar2", "anahtar3", "anahtar4", "anahtar5"],
  "risk_score": 65,
  "risk_level": "medium",
  "summary_comment": "Araştırma bulgularına dayalı 4-5 cümlelik detaylı risk değerlendirmesi",
  "top_matches": [
    {
      "title": "Markanın tam adı — Şirket Adı",
      "patent_number": "Varsa gerçek numara, yoksa 'Doğrulanamadı'",
      "summary": "Bu markanın ne yaptığı ve neden çakışma riski oluşturduğu (2-3 cümle)",
      "similarity_score": 75,
      "match_reasons": ["Fonetik/yazım benzerliği detayı", "Sektör örtüşmesi detayı", "Hedef kitle benzerliği"],
      "category": "Nice Sınıf XX - Sektör Adı"
    }
  ],
  "risk_factors": [
    "Risk 1: Hangi marka, ne tür hukuki risk",
    "Risk 2: Pazar ve ticari çakışma detayı",
    "Risk 3: Tüketici karışıklığı riski"
  ],
  "uniqueness_suggestions": [
    "Öneri 1: Somut farklılaşma önerisi",
    "Öneri 2: Nice sınıfı stratejisi",
    "Öneri 3: Coğrafi/sektörel niş strateji",
    "Öneri 4: Acil marka koruma adımları",
    "Öneri 5: TÜRKPATENT başvuru önerisi"
  ]
}

Risk skoru kriterleri:
- 70-100 (high): Aynı/fonetik benzer isimde, aynı sektörde tescilli veya aktif marka var
- 40-69 (medium): Benzer isim veya örtüşen sektörde markalar mevcut  
- 0-39 (low): Düşük çakışma riski

ÖNEMLİ: Gerçek bilinen markaları referans al. Hayali tescil numarası uydurma.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Şu marka için kapsamlı çakışma analizi yap:\n\n${inputText}\n\nTürkiye'deki mevcut markalar, TÜRKPATENT veritabanı bilgilerin ve sektör bilginle gerçekçi bir analiz yap.`,
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as any)?.error?.message || '';
    if (msg.includes('quota') || msg.includes('billing')) {
      throw new Error('API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.');
    }
    if (msg.includes('invalid_api_key') || msg.includes('Incorrect API key')) {
      throw new Error('API yapılandırma hatası. Lütfen site yöneticisiyle iletişime geçin.');
    }
    throw new Error(msg || `Analiz hatası: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Analiz yanıtı alınamadı');
  }

  let jsonStr = content;
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  const parsed: OpenAIAnalysisResponse = JSON.parse(jsonStr);
  return parsed;
}

export function buildFullResult(openaiResult: OpenAIAnalysisResponse, inputText: string): import('@/types').AnalysisResult {
  return {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    product_summary: openaiResult.product_summary,
    detected_features: openaiResult.detected_features,
    search_keywords: openaiResult.search_keywords,
    risk_score: openaiResult.risk_score,
    risk_level: openaiResult.risk_level,
    summary_comment: openaiResult.summary_comment,
    top_matches: openaiResult.top_matches,
    risk_factors: openaiResult.risk_factors,
    uniqueness_suggestions: openaiResult.uniqueness_suggestions,
    disclaimer: 'Bu analiz yalnızca ön değerlendirme amaçlıdır. Kesin hukuki görüş yerine geçmez. Resmi marka araştırması için Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden sorgulama yapmanız önerilir.',
    createdAt: new Date().toISOString(),
    inputText,
  };
}
