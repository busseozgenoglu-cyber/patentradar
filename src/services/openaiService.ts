const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export function getStoredApiKey(): string {
  return API_KEY;
}

export function hasApiKey(): boolean {
  return true;
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
  const systemPrompt = `Sen MarkaRadar'ın profesyonel bir marka çakışma analisti ve risk değerlendirme uzmanısın. 
Görevin kullanıcının marka adı, sektörü ve faaliyet alanlarını analiz ederek mevcut markalarla çakışma riskini değerlendirmek.

Türkçe yanıt ver. Aşağıdaki JSON formatında yanıt döndür:

{
  "product_summary": "Markanın kısa özeti (2-3 cümle)",
  "detected_features": ["özellik1", "özellik2", ...],
  "search_keywords": ["anahtar1", "anahtar2", ...],
  "risk_score": 0-100 arası sayı,
  "risk_level": "low" veya "medium" veya "high",
  "summary_comment": "Risk değerlendirmesi özeti (3-4 cümle)",
  "top_matches": [
    {
      "title": "Benzeyen markanın adı ve sektörü",
      "patent_number": "TMXXXX/XXXXX formatında dummy numara",
      "summary": "Markanın kısa açıklaması",
      "similarity_score": 0-100,
      "match_reasons": ["neden1", "neden2"],
      "category": "sektör adı"
    }
  ],
  "risk_factors": ["risk1", "risk2", "risk3"],
  "uniqueness_suggestions": ["öneri1", "öneri2", "öneri3", "öneri4", "öneri5"]
}

Risk skoru şu şekilde belirlenir:
- 70-100 (high): Aynı veya çok benzer isimli markalar aynı sektörde var
- 40-69 (medium): Benzer sektör ve kısmi çakışma var
- 0-39 (low): Düşük çakışma riski

Gerçek varolan markaları referans al. Starbucks, Nike, Apple, Getir, Trendyol, Hepsiburada, Eti, LC Waikiki, Mavi, Koton, Coca-Cola, Amazon, Netflix gibi bilinen markaları kullan.
Türkçe yanıt ver.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Aşağıdaki marka tanımını analiz et:\n\n${inputText}` }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API hatası: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('OpenAI yanıtı boş');
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
