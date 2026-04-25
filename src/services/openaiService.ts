// Claude API ile gerçek web araması yapan marka analiz servisi
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export function getStoredApiKey(): string {
  return CLAUDE_API_KEY || OPENAI_API_KEY;
}

export function hasApiKey(): boolean {
  return !!(CLAUDE_API_KEY || OPENAI_API_KEY);
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

// Claude API ile gerçek web araması yaparak analiz
async function analyzeWithClaude(inputText: string): Promise<OpenAIAnalysisResponse> {
  const prompt = `Sen bir marka hukuku ve çakışma analizi uzmanısın. Kullanıcının verdiği marka bilgisini web'de gerçek zamanlı araştırarak kapsamlı bir çakışma raporu hazırlıyorsun.

ARAŞTIR VE ANALİZ ET:
1. Web'de "${inputText}" ile ilgili Türkiye'deki aktif markalar, şirketler, işletmeler
2. Aynı veya fonetik benzer isimde Türkiye'de kayıtlı/faaliyet gösteren her türlü işletme
3. Google'da, sosyal medyada, e-ticaret sitelerinde bu isimle ilgili sonuçlar
4. TÜRKPATENT'te benzer tescilli markalar (bilgin dahilinde)
5. Uluslararası benzer markalar (EUIPO, WIPO)

Araştırma sonuçlarına dayanarak SADECE şu JSON formatında yanıt ver:

{
  "product_summary": "Kullanıcının markasının 3-4 cümlelik özeti: ne tür işletme, hangi sektör, hedef kitle",
  "detected_features": ["tespit edilen özellik1", "özellik2", "özellik3"],
  "search_keywords": ["araştırmada kullanılan anahtar1", "anahtar2", "anahtar3", "anahtar4"],
  "risk_score": 85,
  "risk_level": "high",
  "summary_comment": "Web araştırması bulgularına dayalı 5-6 cümlelik somut risk değerlendirmesi. Hangi gerçek markalar bulundu, nerede aktifler, neden risk oluşturdukları, hukuki durumu açıkla.",
  "top_matches": [
    {
      "title": "Bulunan gerçek markanın adı — İşletme/Şirket Adı",
      "patent_number": "Gerçek tescil numarası varsa yaz, 'Web'de tespit edildi, tescil doğrulanamadı' veya 'TÜRKPATENT kaydı mevcut olabilir' yaz",
      "summary": "Bu markanın ne yaptığı, nerede faaliyet gösterdiği (şehir/ülke), hangi hizmetleri sunduğu ve neden çakışma riski oluşturduğu. Mümkünse web sitesi veya adres bilgisi ekle.",
      "similarity_score": 90,
      "match_reasons": [
        "İsim benzerliği: [detay]",
        "Sektör örtüşmesi: [detay]",
        "Coğrafi yakınlık veya pazar örtüşmesi: [detay]"
      ],
      "category": "Nice Sınıf 44 - Güzellik ve Kişisel Bakım Hizmetleri"
    }
  ],
  "risk_factors": [
    "Risk 1: [Gerçek marka adı] ile çakışma — [spesifik hukuki risk açıklaması]",
    "Risk 2: [Pazar ve ticari çakışma detayı, hangi bölgede rekabet riski]",
    "Risk 3: [Tüketici karışıklığı ve itibar riski, somut senaryo]"
  ],
  "uniqueness_suggestions": [
    "Öneri 1: [Marka adında somut değişiklik önerisi — örnek alternatif isimler]",
    "Öneri 2: [Hangi Nice sınıflarında başvuru yapılmalı, neden]",
    "Öneri 3: [Coğrafi veya sektörel niş — hangi alana odaklanmalı]",
    "Öneri 4: [Acil marka koruma adımları — TÜRKPATENT başvurusu ne zaman, nasıl]",
    "Öneri 5: [Uzun vadeli marka stratejisi önerisi]"
  ]
}

ÖNEMLİ: Sadece gerçekte var olan markaları ve işletmeleri yaz. Web aramasında bulamadığın şeyleri uydurma. Tescil numarası bilmiyorsan dürüstçe belirt.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5,
        }
      ],
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as Record<string, unknown>)?.error;
    throw new Error(typeof msg === 'string' ? msg : `Analiz hatası: ${response.status}`);
  }

  const data = await response.json();

  // Claude'un yanıtından JSON'u çıkar
  let jsonText = '';
  for (const block of (data.content || [])) {
    if (block.type === 'text') {
      jsonText += block.text;
    }
  }

  if (!jsonText) {
    throw new Error('Analiz yanıtı alınamadı');
  }

  // JSON'u parse et
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : jsonText.trim();

  // JSON bloğunu bul
  const jsonStart = jsonStr.indexOf('{');
  const jsonEnd = jsonStr.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Geçerli analiz verisi alınamadı');
  }

  const parsed: OpenAIAnalysisResponse = JSON.parse(jsonStr.slice(jsonStart, jsonEnd + 1));
  return parsed;
}

// OpenAI - gpt-4o-search-preview ile gerçek web araması
async function analyzeWithOpenAI(inputText: string): Promise<OpenAIAnalysisResponse> {
  const systemPrompt = `Sen MarkaRadar'ın uzman marka çakışma analistisın. Web'de gerçek zamanlı arama yaparak kullanıcının markasını analiz ediyorsun.

Şunları web'de ara ve analiz et:
1. Türkiye'de bu marka adıyla veya fonetik benzer isimde aktif işletmeler, şirketler
2. Google'da, sosyal medyada, e-ticarette bu isimle ilgili sonuçlar  
3. TÜRKPATENT'te benzer tescilli markalar
4. Aynı sektörde Türkiye'deki rakip markalar
5. Uluslararası benzer markalar

SADECE JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "product_summary": "Markanın 3-4 cümlelik detaylı özeti",
  "detected_features": ["özellik1", "özellik2", "özellik3"],
  "search_keywords": ["arama terimi1", "arama terimi2", "arama terimi3", "arama terimi4"],
  "risk_score": 75,
  "risk_level": "high",
  "summary_comment": "Web araması bulgularına dayalı 5-6 cümlelik somut risk değerlendirmesi. Hangi gerçek markalar bulundu, nerede aktifler, neden risk oluşturdukları.",
  "top_matches": [
    {
      "title": "Gerçek bulunan markanın tam adı — Şirket/İşletme Adı",
      "patent_number": "Gerçek numara varsa yaz, yoksa 'Web'de tespit edildi, tescil doğrulanamadı'",
      "summary": "Bu markanın ne yaptığı, nerede aktif olduğu, web'de nerede bulunduğu ve neden çakışma riski oluşturduğu",
      "similarity_score": 85,
      "match_reasons": ["İsim/fonetik benzerlik detayı", "Sektör örtüşmesi detayı", "Coğrafi/pazar örtüşmesi"],
      "category": "Nice Sınıf 44 - Güzellik ve Kişisel Bakım Hizmetleri"
    }
  ],
  "risk_factors": [
    "Risk 1: [Gerçek marka adı] — spesifik hukuki risk açıklaması",
    "Risk 2: Pazar ve ticari çakışma detayı",
    "Risk 3: Tüketici karışıklığı riski somut senaryo"
  ],
  "uniqueness_suggestions": [
    "Öneri 1: Somut alternatif isim önerisi",
    "Öneri 2: Nice sınıfı stratejisi",
    "Öneri 3: Coğrafi/sektörel niş strateji",
    "Öneri 4: TÜRKPATENT başvuru adımları",
    "Öneri 5: Uzun vadeli marka stratejisi"
  ]
}

ÖNEMLİ: Gerçekte bulunan markaları yaz. 'XYZ', 'ABC' gibi uydurma isimler kullanma.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-search-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Şu marka için web'de araştırma yaparak kapsamlı çakışma analizi hazırla:

${inputText}` }
      ],
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as Record<string, unknown>)?.error;
    throw new Error(typeof msg === 'string' ? msg : `Analiz hatası: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content;
  if (!rawContent) throw new Error('Analiz yanıtı alınamadı');

  // JSON çıkar
  const codeMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = codeMatch ? codeMatch[1].trim() : rawContent.trim();
  const s = jsonStr.indexOf('{');
  const e = jsonStr.lastIndexOf('}');
  if (s !== -1 && e !== -1) jsonStr = jsonStr.slice(s, e + 1);

  return JSON.parse(jsonStr) as OpenAIAnalysisResponse;
}

// Ana export: Claude önce dene, hata/bakiye sıfırsa OpenAI'a geç
export async function analyzeWithOpenAIMain(inputText: string): Promise<OpenAIAnalysisResponse> {
  if (CLAUDE_API_KEY) {
    try {
      return await analyzeWithClaude(inputText);
    } catch (claudeErr: unknown) {
      // Bakiye yetersiz veya başka Claude hatası - OpenAI fallback
      if (!OPENAI_API_KEY) throw claudeErr;
      const msg = claudeErr instanceof Error ? claudeErr.message : 'Bilinmeyen hata';
      console.warn('Claude API hatası, OpenAI fallback kullanılıyor:', msg);
    }
  }
  if (OPENAI_API_KEY) {
    return analyzeWithOpenAI(inputText);
  }
  throw new Error('API yapılandırma hatası. Lütfen site yöneticisiyle iletişime geçin.');
}

// Backward compat export
export { analyzeWithOpenAIMain as analyzeWithOpenAI };

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
