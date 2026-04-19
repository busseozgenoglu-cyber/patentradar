import { useState } from 'react';

import { motion } from 'framer-motion';
import { Shield, Loader2, FileDown, ArrowLeft, AlertCircle, Sparkles, Gavel, FileText, Building2, Users, Target, CalendarDays, Check } from 'lucide-react';
import { generateDefense, generateDefenseHTML, type DefenseInput, type DefenseResult } from '@/services/defenseService';
import { downloadPDF } from '@/services/pdfService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const sectorOptions = [
  'Gıda ve İçecek', 'Tekstil ve Giyim', 'Elektronik ve Teknoloji',
  'E-Ticaret', 'Kozmetik ve Kişisel Bakım', 'Mobilya ve Ev Yaşam',
  'Otomotiv', 'Sağlık ve Medikal', 'Eğitim', 'Spor ve Fitness',
  'Eğlence ve Oyuncak', 'Lojistik ve Kargo', 'Finans ve Fintech',
  'İnşaat ve Yapı', 'Hizmet Sektörü', 'Diğer'
];

const objectionReasonOptions = [
  'Marka benzerliği / Çakışma',
  'Tüketici kafası karışıklığı',
  'Aynı sektörde faaliyet',
  'İsim benzerliği',
  'Logo / Görsel benzerlik',
  'Slogan / Slogan benzerliği',
  'Haksız rekabet',
  'Diğer'
];

export function BrandDefense() {
  const [form, setForm] = useState<DefenseInput>({
    brandName: '',
    sector: '',
    activityDescription: '',
    opponentBrand: '',
    opponentSector: '',
    objectionReasons: '',
    registrationDate: '',
    usageAreas: '',
    targetAudience: '',
  });
  const [result, setResult] = useState<DefenseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = form.brandName.length >= 2 && 
    form.sector.length > 0 && 
    form.activityDescription.length >= 30 &&
    form.opponentBrand.length >= 2 &&
    form.objectionReasons.length > 0;

  const handleChange = (field: keyof DefenseInput, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Lütfen tüm zorunlu alanları doldurun (itiraz gerekçeleri dahil).');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const defense = await generateDefense(form);
      setResult(defense);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Savunma dosyası oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:794px;background:white;padding:40px;box-sizing:border-box;';
      container.innerHTML = generateDefenseHTML(result, form);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, windowWidth: 794, windowHeight: container.scrollHeight });
      document.body.removeChild(container);

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
        if (pageCount > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, scaledWidth, scaledHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        pageCount++;
      }

      const blob = pdf.output('blob');
      downloadPDF(blob, `MarkaRadar_Savunma_${form.brandName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF hatası:', err);
      setError('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Result view
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <button onClick={() => { setResult(null); setForm({ ...form, brandName: '', activityDescription: '', opponentBrand: '', objectionReasons: '' }); }} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Yeni Savunma
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{result.title}</h1>
                  <p className="text-sm text-slate-500">
                    {new Date(result.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Savunma Yapan</p>
                  <p className="text-lg font-bold text-blue-700">{form.brandName}</p>
                  <p className="text-sm text-slate-600">{form.sector}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">İtiraz Eden</p>
                  <p className="text-lg font-bold text-red-600">{form.opponentBrand}</p>
                  <p className="text-sm text-slate-600">{form.opponentSector}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleDownloadPDF} disabled={pdfLoading} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 text-sm">
                  {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  PDF İndir
                </button>
                <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm">
                  Yeni Savunma
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Genel Özet</h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.executiveSummary}</p>
              </div>

              {/* Legal Arguments */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Hukuki Argümanlar</h2>
                </div>
                <ol className="space-y-3">
                  {result.legalArguments.map((arg, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="leading-relaxed pt-0.5">{arg}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Distinctiveness */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Farklılık Analizi</h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.distinctivenessAnalysis}</p>
              </div>

              {/* Confusion */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Kafa Karışıklığı Analizi</h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.confusionAnalysis}</p>
              </div>

              {/* Market */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Pazar Analizi</h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.marketAnalysis}</p>
              </div>

              {/* Precedence */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Öncelik Argümanları</h2>
                </div>
                <ol className="space-y-3">
                  {result.precedenceArguments.map((arg, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="leading-relaxed pt-0.5">{arg}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Conclusion */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-blue-900">Sonuç</h2>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{result.conclusion}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Öneriler</h2>
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Yasal Uyarı</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Bu savunma dosyası yapay zeka tarafından oluşturulmuş ön bir taslaktır. 
                    MarkaRadar bir avukat, marka vekili veya hukuk uzmanı yerine geçmez. 
                    Bu dosyayı bir hukuk uzmanına danışmadan doğrudan kullanmayınız. 
                    556 sayılı KHK ve ilgili mevzuat çerçevesinde profesyonel hukuki destek almanız önerilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-8 mb-8">
              <button onClick={handleDownloadPDF} disabled={pdfLoading} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl disabled:opacity-50">
                {pdfLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                Savunma Dosyasını PDF Olarak İndir
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-semibold rounded-full mb-4">
            <Shield className="w-4 h-4" /> Marka Hukuku
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Marka İtiraz Savunma Dosyası</h1>
          <p className="text-slate-600 leading-relaxed">
            Markanıza gelen itiraza karşı profesyonel, detaylı ve hukuki temelli bir savunma dosyası hazırlayın.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-semibold rounded-full">
            <Gavel className="w-4 h-4" />
            Her savunma dosyası 899 TL
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Your Brand */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-base font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Savunma Yapan Markanız
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Marka Adınız <span className="text-red-500">*</span></label>
                  <input type="text" value={form.brandName} onChange={e => handleChange('brandName', e.target.value)} placeholder="Örn: Sıcak Gün Kahvecisi" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Sektör <span className="text-red-500">*</span></label>
                  <select value={form.sector} onChange={e => handleChange('sector', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                    <option value="">Seçiniz</option>
                    {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Faaliyet Açıklaması <span className="text-red-500">*</span></label>
                <textarea value={form.activityDescription} onChange={e => handleChange('activityDescription', e.target.value)} placeholder="Markanızın ne yaptığını, hangi ürün/hizmetleri sunduğunu detaylı açıklayın..." className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tescil / Başvuru Tarihi</label>
                  <input type="date" value={form.registrationDate} onChange={e => handleChange('registrationDate', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Hedef Kitle</label>
                  <input type="text" value={form.targetAudience} onChange={e => handleChange('targetAudience', e.target.value)} placeholder="Örn: 25-45 yaş, şehirli" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kullanım Alanları</label>
                <input type="text" value={form.usageAreas} onChange={e => handleChange('usageAreas', e.target.value)} placeholder="Örn: Cafe, online satış, mobil uygulama" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
            </div>

            {/* Opponent */}
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <h3 className="text-base font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> İtiraz Eden Marka
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">İtiraz Eden Marka <span className="text-red-500">*</span></label>
                  <input type="text" value={form.opponentBrand} onChange={e => handleChange('opponentBrand', e.target.value)} placeholder="Örn: Starbucks" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">İtiraz Eden Sektör</label>
                  <select value={form.opponentSector} onChange={e => handleChange('opponentSector', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                    <option value="">Seçiniz</option>
                    {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">İtiraz Gerekçeleri <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {objectionReasonOptions.map(reason => (
                    <button
                      key={reason}
                      onClick={() => handleChange('objectionReasons', form.objectionReasons ? `${form.objectionReasons}, ${reason}` : reason)}
                      className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    >
                      + {reason}
                    </button>
                  ))}
                </div>
                <textarea value={form.objectionReasons} onChange={e => handleChange('objectionReasons', e.target.value)} placeholder="İtiraz gerekçelerini yazın veya yukarıdaki seçeneklerden ekleyin..." className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Savunma Dosyası Hazırlanıyor...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Savunma Dosyası Hazırla — 899 TL</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
