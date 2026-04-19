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
  const systemPrompt = `Sen MarkaRadar'ın uzman marka çakışma analistisın. Kullanıcının verdiği marka adını ve sektörü web'de ve marka veritabanlarında gerçek zamanlı araştırarak kapsamlı çakışma riski analizi yapıyorsun.

ARAŞTIRMA ADIMLARI:
1. Marka adını ve sektörü tespit et
2. Web aramasıyla şunları araştır:
   - Türkiye'de aynı veya benzer isimde tescilli/faaliyet gösteren markalar (TÜRKPATENT, Ticaret Sicili)
   - Aynı sektörde Türkiye'de aktif şirketler, e-ticaret siteleri, sosyal medya hesapları
   - Fonetik olarak benzer isimler (telaffuz benzerliği hukuki risk yaratır)
   - Uluslararası markalar (EUIPO, WIPO kapsamında Türkiye'de koruma altında olanlar)
   - Nice sınıflandırmasına göre aynı sınıfta tescilli markalar
3. Bulguları analiz ederek risk skoru hesapla

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma, markdown kullanma:

{
  "product_summary": "Markanın 3-4 cümlelik detaylı özeti: ne yapıyor, hangi sektör, hedef kitle, iş modeli",
  "detected_features": ["özellik1", "özellik2", "özellik3", "özellik4"],
  "search_keywords": ["araştırılan anahtar1", "araştırılan anahtar2", "araştırılan anahtar3", "araştırılan anahtar4", "araştırılan anahtar5"],
  "risk_score": 0-100 arası sayı,
  "risk_level": "low" veya "medium" veya "high",
  "summary_comment": "Araştırma bulgularına dayalı 4-5 cümlelik risk değerlendirmesi. Hangi markaların neden risk oluşturduğunu, hukuki durumu ve önerilen adımları açıkla.",
  "top_matches": [
    {
      "title": "Markanın tam adı — Şirket/İşletme Adı",
      "patent_number": "Gerçek tescil numarası varsa yaz, yoksa 'Doğrulanamadı' yaz",
      "summary": "Bu markanın ne yaptığı, nerede aktif olduğu ve neden çakışma riski oluşturduğu (2-3 cümle)",
      "similarity_score": 0-100,
      "match_reasons": ["Fonetik/yazım benzerliği açıklaması", "Sektör örtüşmesi açıklaması", "Hedef kitle ve pazar benzerliği"],
      "category": "Nice Sınıf XX - Sektör Adı"
    }
  ],
  "risk_factors": [
    "Risk 1: Hangi marka, ne tür hukuki risk (tescil çakışması, itiraz hakkı vb.)",
    "Risk 2: Pazar ve ticari çakışma riski detayı",
    "Risk 3: Tüketici karışıklığı ve itibar riski"
  ],
  "uniqueness_suggestions": [
    "Öneri 1: Somut isim değişikliği veya farklılaşma önerisi",
    "Öneri 2: Hangi Nice sınıflarında başvuru yapılmalı",
    "Öneri 3: Coğrafi veya sektörel niş strateji",
    "Öneri 4: Marka koruması için acil adımlar",
    "Öneri 5: TÜRKPATENT başvuru süreci önerisi"
  ]
}

Risk skoru kriterleri:
- 70-100 (high): Aynı/fonetik benzer isimde, aynı sektörde tescilli veya aktif marka var
- 40-69 (medium): Benzer isim veya kısmen örtüşen sektörde markalar mevcut
- 0-39 (low): Düşük çakışma riski, yeterince özgün

Araştırmana dayalı gerçek markalar ve bulgular yaz. Hayali tescil numarası veya marka uydurma.`;

  // Step 1: Web araması ile gerçek zamanlı araştırma
  let webSearchContext = '';
  try {
    const searchResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        tools: [{ type: 'web_search_preview' }],
        input: `Türkiye marka çakışma araştırması: "${inputText}"\n\nAraştır:\n1. Türkiye'de aynı/benzer isimde markalar ve şirketler\n2. TÜRKPATENT'te bu sektörde benzer tescilli markalar\n3. Aynı sektörde Türkiye'de faaliyet gösteren önemli markalar\n4. Bu isimle çakışabilecek uluslararası markalar\n\nBulgularını Türkçe özetle.`,
      }),
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.output) {
        for (const block of searchData.output) {
          if (block.type === 'message' && block.content) {
            for (const content of block.content) {
              if (content.type === 'output_text' && content.text) {
                webSearchContext = content.text;
              }
            }
          }
        }
      }
    }
  } catch {
    // Web search failed, continue with knowledge-based analysis
  }

  // Step 2: Araştırma bulgularıyla kapsamlı analiz
  const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: `Analiz edilecek marka:\n${inputText}\n\n${webSearchContext ? `Web araştırması bulguları:\n${webSearchContext}\n\nBu bulgulara dayanarak` : 'Bilgine dayanarak'} JSON formatında kapsamlı çakışma analizi yap.`,
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!analysisResponse.ok) {
    const error = await analysisResponse.json().catch(() => ({}));
    throw new Error((error as any).error?.message || `Analiz hatası: ${analysisResponse.status}`);
  }

  const data = await analysisResponse.json();
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
