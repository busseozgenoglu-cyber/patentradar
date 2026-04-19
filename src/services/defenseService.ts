
export interface DefenseInput {
  brandName: string;
  sector: string;
  activityDescription: string;
  opponentBrand: string;
  opponentSector: string;
  objectionReasons: string;
  registrationDate: string;
  usageAreas: string;
  targetAudience: string;
}

export interface DefenseResult {
  title: string;
  executiveSummary: string;
  legalArguments: string[];
  distinctivenessAnalysis: string;
  confusionAnalysis: string;
  marketAnalysis: string;
  precedenceArguments: string[];
  conclusion: string;
  recommendations: string[];
  createdAt: string;
}

function buildPrompt(input: DefenseInput): string {
  return `Sen Türk marka hukuku alanında uzman bir avukatsın. 
Aşağıdaki bilgilere dayanarak profesyonel, detaylı ve ikna edici bir marka itiraz savunma dosyası hazırla.

TÜRKÇE yaz. Resmi ve hukuki bir üslup kullan.

İTİRAZ ALAN MARKA BİLGİLERİ:
- Marka Adı: ${input.brandName}
- Sektör: ${input.sector}
- Faaliyet Alanı: ${input.activityDescription}
- Tescil/Başvuru Tarihi: ${input.registrationDate}
- Kullanım Alanları: ${input.usageAreas}
- Hedef Kitle: ${input.targetAudience}

İTİRAZ EDEN MARKA BİLGİLERİ:
- Marka Adı: ${input.opponentBrand}
- Sektör: ${input.opponentSector}
- İtiraz Gerekçeleri: ${input.objectionReasons}

Aşağıdaki JSON formatında yanıt ver (TÜM alanlar Türkçe ve detaylı olmalı):

{
  "title": "Savunma dosyasının başlığı",
  "executiveSummary": "Genel özet (3-4 paragraf, detaylı)",
  "legalArguments": ["Hukuki argüman 1", "Hukuki argüman 2", "Hukuki argüman 3", "Hukuki argüman 4", "Hukuki argüman 5"],
  "distinctivenessAnalysis": "Farklılık analizi (2-3 paragraf, markaların birbirinden farklı yönlerini detaylı açıkla)",
  "confusionAnalysis": "Kafa karışıklığı analizi (2-3 paragraf, neden tüketici kafası karışmayacağını açıkla)",
  "marketAnalysis": "Pazar analizi (2-3 paragraf, sektör ve pazar farklılıklarını açıkla)",
  "precedenceArguments": ["Öncelik argümanı 1", "Öncelik argümanı 2", "Öncelik argümanı 3"],
  "conclusion": "Sonuç bölümü (2-3 paragraf, tüm argümanları özetleyerek neden itirazın reddedilmesi gerektiğini açıkla)",
  "recommendations": ["Öneri 1", "Öneri 2", "Öneri 3", "Öneri 4"]
}`;
}

export async function generateDefense(input: DefenseInput): Promise<DefenseResult> {
  const CLAUDE_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  if (!CLAUDE_KEY && !OPENAI_KEY) {
    throw new Error('Savunma özelliği şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
  }

  let responseText = '';

  if (CLAUDE_KEY) {
    // Claude API - hata olursa OpenAI'a geç
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 4000,
          system: 'Sen Türk marka hukuku uzmanısın. 556 sayılı KHK, marka tescil süreçleri ve itiraz savunma dosyaları konusunda derin bilgiye sahipsin. Sadece JSON formatında yanıt ver.',
          messages: [{ role: 'user', content: buildPrompt(input) }],
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (!OPENAI_KEY) throw new Error((err as any)?.error?.message || `Hata: ${resp.status}`);
        console.warn('Claude API hatası, OpenAI fallback...');
      } else {
        const data = await resp.json();
        for (const block of (data.content || [])) {
          if (block.type === 'text') responseText += block.text;
        }
      }
    } catch (e) {
      if (!OPENAI_KEY) throw e;
      console.warn('Claude hatası, OpenAI fallback...');
    }
  }
  if (!responseText && OPENAI_KEY) {
    // OpenAI fallback
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Sen Türk marka hukuku uzmanısın. 556 sayılı KHK, marka tescil süreçleri ve itiraz savunma dosyaları konusunda derin bilgiye sahipsin.' },
          { role: 'user', content: buildPrompt(input) }
        ],
        temperature: 0.4,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error((err as any)?.error?.message || `Hata: ${resp.status}`);
    }
    const data = await resp.json();
    responseText = data.choices[0]?.message?.content || '';
  }

  if (!responseText) throw new Error('Savunma yanıtı alınamadı');

  // JSON parse
  const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : responseText.trim();
  const s = jsonStr.indexOf('{');
  const e = jsonStr.lastIndexOf('}');
  if (s !== -1 && e !== -1) jsonStr = jsonStr.slice(s, e + 1);

  const parsed: DefenseResult = JSON.parse(jsonStr);
  parsed.createdAt = new Date().toISOString();
  return parsed;
}

export function generateDefenseHTML(result: DefenseResult, input: DefenseInput): string {
  return `
    <div style="width: 100%; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; color: #0F172A;">
      <!-- Cover -->
      <div style="text-align: center; padding: 60px 0; border-bottom: 3px solid #3B82F6; margin-bottom: 40px;">
        <div style="font-size: 28px; font-weight: 800; color: #3B82F6; margin-bottom: 8px;">● MarkaRadar</div>
        <div style="font-size: 12px; color: #94A3B8; letter-spacing: 0.1em;">AI DESTEKLİ MARKA İTİRAZ SAVUNMA DOSYASI</div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 24px 0 8px;">${result.title}</h1>
        <div style="font-size: 14px; color: #475569;">
          Hazırlanma Tarihi: ${new Date(result.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <!-- Info Table -->
      <div style="margin-bottom: 30px; background: #F8FAFC; border-radius: 12px; padding: 20px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; border-left: 4px solid #3B82F6; padding-left: 12px;">Taraflar ve Bilgiler</h2>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #475569; width: 40%;">Savunma Yapan Marka</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.brandName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #475569;">Sektör</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.sector}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #475569;">İtiraz Eden Marka</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.opponentBrand}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #475569;">İtiraz Eden Sektör</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.opponentSector}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #475569;">İtiraz Gerekçeleri</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.objectionReasons}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569;">Tescil/Başvuru Tarihi</td>
            <td style="padding: 8px 0; font-weight: 600;">${input.registrationDate}</td>
          </tr>
        </table>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">1. Genel Özet</h2>
        <p style="font-size: 13px; line-height: 1.8; color: #475569;">${result.executiveSummary.replace(/\n/g, '<br><br>')}</p>
      </div>

      <!-- Legal Arguments -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">2. Hukuki Argümanlar</h2>
        <ol style="margin: 0; padding-left: 20px;">
          ${result.legalArguments.map(arg => `<li style="font-size: 13px; color: #475569; line-height: 1.7; margin-bottom: 10px;">${arg}</li>`).join('')}
        </ol>
      </div>

      <!-- Distinctiveness -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">3. Farklılık Analizi</h2>
        <p style="font-size: 13px; line-height: 1.8; color: #475569;">${result.distinctivenessAnalysis.replace(/\n/g, '<br><br>')}</p>
      </div>

      <!-- Confusion -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">4. Kafa Karışıklığı Analizi</h2>
        <p style="font-size: 13px; line-height: 1.8; color: #475569;">${result.confusionAnalysis.replace(/\n/g, '<br><br>')}</p>
      </div>

      <!-- Market -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">5. Pazar Analizi</h2>
        <p style="font-size: 13px; line-height: 1.8; color: #475569;">${result.marketAnalysis.replace(/\n/g, '<br><br>')}</p>
      </div>

      <!-- Precedence -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">6. Öncelik Argümanları</h2>
        <ol style="margin: 0; padding-left: 20px;">
          ${result.precedenceArguments.map(arg => `<li style="font-size: 13px; color: #475569; line-height: 1.7; margin-bottom: 10px;">${arg}</li>`).join('')}
        </ol>
      </div>

      <!-- Conclusion -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">7. Sonuç</h2>
        <p style="font-size: 13px; line-height: 1.8; color: #475569;">${result.conclusion.replace(/\n/g, '<br><br>')}</p>
      </div>

      <!-- Recommendations -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">8. Öneriler</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${result.recommendations.map(rec => `<li style="font-size: 13px; color: #475569; line-height: 1.7; margin-bottom: 8px;">${rec}</li>`).join('')}
        </ul>
      </div>

      <!-- Disclaimer -->
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 16px; margin-top: 30px;">
        <div style="font-size: 13px; font-weight: 700; color: #92400E; margin-bottom: 8px;">⚠ Yasal Uyarı</div>
        <div style="font-size: 12px; color: #92400E; line-height: 1.6;">
          Bu savunma dosyası yapay zeka tarafından oluşturulmuş ön bir taslaktır. MarkaRadar bir avukat, marka vekili veya hukuk uzmanı yerine geçmez. Bu dosyayı bir hukuk uzmanına danışmadan doğrudan kullanmayınız. 556 sayılı KHK ve ilgili mevzuat çerçevesinde profesyonel hukuki destek almanız önerilir.
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
        <div style="font-size: 11px; color: #94A3B8;">MarkaRadar · AI Destekli Marka İtiraz Savunma Platformu</div>
      </div>
    </div>
  `;
}
