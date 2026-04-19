import type { AnalysisResult } from '@/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(result: AnalysisResult): Promise<Blob> {
  // Create a temporary container for the PDF content
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    background: white;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0F172A;
    padding: 40px;
    box-sizing: border-box;
  `;
  
  const riskColor = result.risk_level === 'high' ? '#EF4444' : result.risk_level === 'medium' ? '#F59E0B' : '#10B981';
  const riskLabel = result.risk_level === 'high' ? 'YÜKSEK RİSK' : result.risk_level === 'medium' ? 'ORTA RİSK' : 'DÜŞÜK RİSK';
  
  container.innerHTML = `
    <div style="width: 100%; box-sizing: border-box;">
      <!-- Cover Page -->
      <div style="text-align: center; padding: 60px 0; border-bottom: 3px solid #3B82F6; margin-bottom: 40px;">
        <div style="font-size: 28px; font-weight: 800; color: #3B82F6; margin-bottom: 8px;">● MarkaRadar</div>
        <div style="font-size: 12px; color: #94A3B8; letter-spacing: 0.1em;">AI DESTEKLİ MARKA ÇAKIŞMA ANALİZ RAPORU</div>
        <h1 style="font-size: 24px; font-weight: 700; color: #0F172A; margin: 24px 0 8px;">Marka Çakışma Risk Analiz Raporu</h1>
        <div style="font-size: 14px; color: #475569;">
          Rapor Tarihi: ${new Date(result.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
      
      <!-- User Input -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">1. Kullanıcı Girdisi</h2>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.6; color: #475569; font-style: italic;">
          "${result.inputText}"
        </div>
      </div>
      
      <!-- Product Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">2. Ürün Özeti</h2>
        <div style="font-size: 13px; line-height: 1.6; color: #475569;">${result.product_summary}</div>
      </div>
      
      <!-- Risk Assessment -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px; border-left: 4px solid #3B82F6; padding-left: 12px;">3. Risk Değerlendirmesi</h2>
        <div style="display: flex; align-items: center; gap: 24px; background: #F8FAFC; border-radius: 12px; padding: 20px;">
          <div style="text-align: center; min-width: 100px;">
            <div style="width: 80px; height: 80px; border-radius: 50%; border: 8px solid ${riskColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
              <span style="font-size: 22px; font-weight: 800; color: ${riskColor};">${result.risk_score}</span>
            </div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Risk Skoru</div>
          </div>
          <div>
            <div style="display: inline-block; background: ${riskColor}20; color: ${riskColor}; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">${riskLabel}</div>
            <div style="font-size: 13px; line-height: 1.6; color: #475569;">${result.summary_comment}</div>
          </div>
        </div>
      </div>
      
      <!-- Detected Features -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">4. Tespit Edilen Özellikler</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${result.detected_features.map(f => `
            <span style="background: #DBEAFE; color: #1E40AF; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 500;">${f}</span>
          `).join('')}
        </div>
      </div>
      
      <!-- Search Keywords -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">5. Arama Anahtar Kelimeleri</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${result.search_keywords.map(k => `
            <span style="background: #F1F5F9; color: #475569; padding: 4px 12px; border-radius: 999px; font-size: 12px;">${k}</span>
          `).join('')}
        </div>
      </div>
      
      <!-- Top Matches -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px; border-left: 4px solid #3B82F6; padding-left: 12px;">6. En Benzer Marka Kayıtları</h2>
        ${result.top_matches.map((match, i) => {
          const matchColor = match.similarity_score > 70 ? '#EF4444' : match.similarity_score > 40 ? '#F59E0B' : '#10B981';
          return `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 12px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #0F172A;">${i + 1}. ${match.title}</div>
                <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">${match.patent_number} · ${match.category}</div>
              </div>
              <div style="background: ${matchColor}20; color: ${matchColor}; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap;">%${match.similarity_score}</div>
            </div>
            <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 8px;">${match.summary.substring(0, 200)}...</div>
            <div style="font-size: 11px; color: #94A3B8;">
              <strong>Neden benzer:</strong> ${match.match_reasons.join(' ')}
            </div>
          </div>`;
        }).join('')}
      </div>
      
      <!-- Risk Factors -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">7. Risk Faktörleri</h2>
        <ol style="margin: 0; padding-left: 20px;">
          ${result.risk_factors.map(f => `
            <li style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 6px;">${f}</li>
          `).join('')}
        </ol>
      </div>
      
      <!-- Uniqueness Suggestions -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; border-left: 4px solid #3B82F6; padding-left: 12px;">8. Özgünleşme Önerileri</h2>
        <ol style="margin: 0; padding-left: 20px;">
          ${result.uniqueness_suggestions.map(s => `
            <li style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 6px;">${s}</li>
          `).join('')}
        </ol>
      </div>
      
      <!-- Disclaimer -->
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 16px; margin-top: 30px;">
        <div style="font-size: 13px; font-weight: 700; color: #92400E; margin-bottom: 8px;">⚠ Uyarı ve Sorumluluk Notu</div>
        <div style="font-size: 12px; color: #92400E; line-height: 1.6;">
          Bu rapor bir ön değerlendirme dokümanıdır. MarkaRadar resmi bir marka araştırması veya hukuki danışmanlık hizmeti sunmamaktadır. Bu raporda yer alan sonuçlar yapay zeka algoritmaları tarafından üretilmiş olup, kesin hukuki görüş niteliğinde değildir. Marka tescili veya hukuki işlem yapmadan önce mutlaka bir marka vekiline veya hukuk uzmanına danışmanız önerilir.
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
        <div style="font-size: 11px; color: #94A3B8;">MarkaRadar · AI Destekli Marka Çakışma Analizi Platformu · www.markaradar.com</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 794,
      windowHeight: container.scrollHeight,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    let heightLeft = scaledHeight;
    let position = 0;
    let pageCount = 0;
    
    while (heightLeft > 0) {
      if (pageCount > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        position, 
        scaledWidth, 
        scaledHeight
      );
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      pageCount++;
    }
    
    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
