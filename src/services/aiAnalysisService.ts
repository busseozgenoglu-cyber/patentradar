import type { AnalysisResult, ProductFeatures } from '@/types';
import { mockPatents } from '@/data/mockPatents';
import { calculateSimilarity } from './similarityService';

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase()
    .replace(/[.,;:!?()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = normalized.split(' ').filter(w => w.length > 2);
  const unique = [...new Set(words)];
  return unique.slice(0, 20);
}

function detectProductType(text: string): string {
  const t = text.toLowerCase();
  
  if (t.includes('giyim') || t.includes('moda') || t.includes('tekstil') || t.includes('kot') || t.includes('kıyafet')) return 'Giyim / Tekstil Markası';
  if (t.includes('gıda') || t.includes('yiyecek') || t.includes('içecek') || t.includes('restoran') || t.includes('cafe')) return 'Gıda ve İçecek Markası';
  if (t.includes('elektronik') || t.includes('teknoloji') || t.includes('beyaz eşya') || t.includes('telefon')) return 'Elektronik / Teknoloji Markası';
  if (t.includes('e-ticaret') || t.includes('alışveriş') || t.includes('perakende') || t.includes('mağaza') || t.includes('pazaryeri')) return 'E-Ticaret / Perakende Markası';
  if (t.includes('kozmetik') || t.includes('bakım') || t.includes('güzellik')) return 'Kozmetik / Kişisel Bakım Markası';
  if (t.includes('mobilya') || t.includes('ev') || t.includes('dekorasyon')) return 'Mobilya / Ev Yaşam Markası';
  if (t.includes('otomotiv') || t.includes('araba') || t.includes('araç')) return 'Otomotiv Markası';
  if (t.includes('sağlık') || t.includes('ilaç') || t.includes('medikal')) return 'Sağlık / Medikal Markası';
  if (t.includes('eğitim') || t.includes('okul') || t.includes('kurs')) return 'Eğitim Markası';
  if (t.includes('spor') || t.includes('fitness')) return 'Spor / Fitness Markası';
  if (t.includes('oyuncak') || t.includes('eğlence') || t.includes('oyun')) return 'Eğlence / Oyuncak Markası';
  if (t.includes('lojistik') || t.includes('kargo') || t.includes('teslimat')) return 'Lojistik Markası';
  if (t.includes('finans') || t.includes('banka') || t.includes('ödeme')) return 'Finans / Fintech Markası';
  
  return 'Genel Marka';
}

function detectPurpose(text: string): string {
  const purposes = [
    { key: ['marka', 'logo', 'isim'], purpose: 'Marka tescili ve koruma' },
    { key: ['ürün', 'hizmet'], purpose: 'Ürün veya hizmet markası' },
    { key: ['perakende', 'satış', 'e-ticaret'], purpose: 'Perakende ve satış' },
    { key: ['üretim', 'imalat'], purpose: 'Üretim odaklı marka' },
    { key: ['platform', 'uygulama', 'app'], purpose: 'Dijital platform markası' },
    { key: ['hizmet', 'servis'], purpose: 'Hizmet sektörü markası' },
  ];
  
  const t = text.toLowerCase();
  for (const p of purposes) {
    if (p.key.some(k => t.includes(k))) return p.purpose;
  }
  return 'Genel ticari marka';
}

function detectFeatures(text: string): string[] {
  const t = text.toLowerCase();
  const features: string[] = [];
  
  const featureMap: Record<string, string[]> = {
    'Mobil uygulama': ['mobil', 'app', 'uygulama'],
    'E-ticaret platformu': ['e-ticaret', 'alışveriş', 'pazaryeri', 'online'],
    'Perakende zinciri': ['perakende', 'mağaza', 'zincir', 'franchise'],
    'Yerel üretim': ['yerel', 'üretim', 'imalat', 'fabrika'],
    'Uluslararası marka': ['uluslararası', 'global', 'dünya', 'yurtdışı'],
    'Dijital platform': ['dijital', 'platform', 'yazılım', 'web'],
    'Fiziksel mağaza': ['mağaza', 'showroom', 'butik'],
    'Logolu marka': ['logo', 'sembol', 'amblem'],
    'Premium konumlandırma': ['premium', 'lüks', 'kaliteli'],
    'Eko dostu / Sürdürülebilir': ['eko', 'çevre', 'sürdürülebilir', 'doğal'],
    'Sosyal medya odaklı': ['sosyal medya', 'influencer', 'dijital pazarlama'],
    'Özgün isim': ['özgün', 'kurgusal', 'uydurma'],
  };
  
  for (const [feature, keywords] of Object.entries(featureMap)) {
    if (keywords.some(k => t.includes(k))) {
      features.push(feature);
    }
  }
  
  return features.length > 0 ? features : ['Yeni marka girişimi'];
}

function detectMechanisms(text: string): string[] {
  const t = text.toLowerCase();
  const mechanisms: string[] = [];
  
  if (t.includes('tescil') || t.includes('marka')) mechanisms.push('Tescilli marka koruma');
  if (t.includes('uluslararası') || t.includes('global')) mechanisms.push('Uluslararası marka tescili');
  if (t.includes('yerel') || t.includes('lokal')) mechanisms.push('Yerel pazar markası');
  if (t.includes('online') || t.includes('dijital')) mechanisms.push('Dijital marka varlığı');
  if (t.includes('franchise')) mechanisms.push('Franchise modeli');
  if (mechanisms.length === 0) mechanisms.push('Yeni marka başvurusu');
  
  return mechanisms;
}

function detectMaterials(text: string): string[] {
  const t = text.toLowerCase();
  const materials: string[] = [];
  
  if (t.includes('giyim') || t.includes('tekstil')) materials.push('Tekstil ürünleri');
  if (t.includes('elektronik') || t.includes('teknoloji')) materials.push('Elektronik cihazlar');
  if (t.includes('gıda') || t.includes('içecek')) materials.push('Gıda ürünleri');
  if (t.includes('hizmet')) materials.push('Hizmet sektörü');
  if (materials.length === 0) materials.push('Genel ticari alan');
  
  return materials;
}

function detectNovelty(text: string): string[] {
  const t = text.toLowerCase();
  const novelties: string[] = [];
  
  if (t.includes('yeni') || t.includes('yenilik')) novelties.push('Yeni marka konsepti');
  if (t.includes('özgün') || t.includes('farklı')) novelties.push('Özgün markalaşma yaklaşımı');
  if (t.includes('niş') || t.includes('özel')) novelties.push('Niş pazar odaklı');
  if (t.includes('dijital') || t.includes('online')) novelties.push('Dijital-first marka');
  if (novelties.length === 0) novelties.push('Yeni marka girişimi');
  
  return novelties;
}

function extractProductFeatures(inputText: string): ProductFeatures {
  return {
    productType: detectProductType(inputText),
    purpose: detectPurpose(inputText),
    coreFeatures: detectFeatures(inputText),
    mechanisms: detectMechanisms(inputText),
    materialsOrStructure: detectMaterials(inputText),
    noveltySignals: detectNovelty(inputText),
    searchKeywords: extractKeywords(inputText),
  };
}

function generateSummaryComment(features: ProductFeatures, topScore: number): string {
  if (topScore > 70) {
    return `Analizinize göre ${features.productType.toLowerCase()} kategorisinde yüksek çakışma riski tespit edildi. "${features.coreFeatures.join(', ')}" özellikleri mevcut markalarla örtüşmektedir. Farklılaşma için isim, sektör veya hedef kitle değişikliği düşünülebilir.`;
  } else if (topScore > 40) {
    return `${features.productType} kategorisinde orta düzeyde çakışma riski bulunmaktadır. "${features.mechanisms.join(', ')}" yönleri benzer kayıtlarda görülmektedir ancak tam eşleşme yoktur. Belirli değişiklikler riski azaltabilir.`;
  } else {
    return `Analiz sonucunda ${features.productType.toLowerCase()} için düşük çakışma riski tespit edildi. "${features.noveltySignals.join(', ')}" yönleriyle özgün bir yaklaşım söz konusu. Yine de detaylı inceleme önerilir.`;
  }
}

function generateRiskFactors(features: ProductFeatures, matches: Array<{title: string; similarity_score: number}>): string[] {
  const factors: string[] = [];
  
  if (matches.length > 0 && matches[0].similarity_score > 60) {
    factors.push(`En yüksek çakışma: ${matches[0].title} ile %${Math.round(matches[0].similarity_score)} benzerlik tespit edildi.`);
  }
  
  if (features.mechanisms.length > 0) {
    factors.push(`"${features.mechanisms[0]}" kategorisi benzer markalarda sıkça görülmektedir.`);
  }
  
  if (features.coreFeatures.length > 1) {
    factors.push(`${features.coreFeatures.length} adet özellik mevcut markalarla benzerlik göstermektedir.`);
  }
  
  if (features.productType.includes('E-Ticaret') || features.productType.includes('Giyim') || features.productType.includes('Gıda')) {
    factors.push('Bu sektörde yoğun marka tescili faaliyeti mevcuttur.');
  }
  
  if (factors.length === 0) {
    factors.push('Genel risk düşük ancak kapsamlı inceleme önerilir.');
  }
  
  return factors;
}

function generateUniquenessSuggestions(features: ProductFeatures): string[] {
  const suggestions: string[] = [];
  
  suggestions.push('Marka isminizi benzersiz kılmak için uydurma (kurgusal) kelimeler kullanmayı düşünün.');
  suggestions.push(`Hedef kitlenizi daraltarak "${features.productType}" sektöründe niş bir pozisyon alabilirsiniz.`);
  suggestions.push('Benzer isimli markaların tescil sınıflarını (Nice sınıfları) kontrol edin ve farklı sınıflarda tescil başvurusu yapın.');
  suggestions.push('Logo ve görsel kimliğinizi güçlü şekilde farklılaştırarak çakışma riskini azaltabilirsiniz.');
  suggestions.push('Türk Patent ve Marka Kurumu (TÜRKPATENT) veri tabanında resmi araştırma yaptırmanız önerilir.');
  
  return suggestions.slice(0, 5);
}

export function analyzePatent(inputText: string): AnalysisResult {
  const features = extractProductFeatures(inputText);
  
  // Calculate similarity for all brands
  const scoredBrands = mockPatents.map(brand => ({
    brand,
    score: calculateSimilarity(features, brand),
  }));
  
  // Sort by score descending
  scoredBrands.sort((a, b) => b.score - a.score);
  
  // Take top 5
  const top5 = scoredBrands.slice(0, 5);
  
  // Calculate overall risk score
  const weights = top5.map((_, i) => 1 - i * 0.15);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const riskScore = totalWeight > 0 ? Math.min(100, Math.round(
    top5.reduce((acc, m, i) => acc + m.score * weights[i], 0) / totalWeight
  )) : 0;
  
  const riskLevel: 'low' | 'medium' | 'high' = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low';
  
  const topMatches = top5.map(m => ({
    title: m.brand.title,
    patent_number: m.brand.patentNumber,
    summary: m.brand.abstract,
    similarity_score: Math.round(m.score),
    match_reasons: [
      `"${m.brand.category}" sektöründe örtüşme tespit edildi.`,
      m.score > 60 ? 'Yüksek sektör ve özellik benzerliği mevcut.' : 'Kısmi sektör benzerliği tespit edildi.',
      m.brand.mechanism ? `Tescil tipi (${m.brand.mechanism}) benzerliği.` : 'Genel marka tipi benzerliği.',
    ],
    category: m.brand.category,
  }));
  
  return {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    product_summary: `Kullanıcı açıklamasına göre: ${features.productType}. ${features.purpose} amacıyla oluşturulmuş marka. Ana özellikler: ${features.coreFeatures.join(', ')}.`,
    detected_features: features.coreFeatures,
    search_keywords: features.searchKeywords.slice(0, 8),
    risk_score: riskScore,
    risk_level: riskLevel,
    summary_comment: generateSummaryComment(features, topMatches[0]?.similarity_score || 0),
    top_matches: topMatches,
    risk_factors: generateRiskFactors(features, topMatches),
    uniqueness_suggestions: generateUniquenessSuggestions(features),
    disclaimer: 'Bu analiz yalnızca ön değerlendirme amaçlıdır. Kesin hukuki görüş yerine geçmez. Resmi marka araştırması için Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden sorgulama yapmanız önerilir.',
    createdAt: new Date().toISOString(),
    inputText: inputText,
  };
}
