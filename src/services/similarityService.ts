import type { ProductFeatures, PatentRecord } from '@/types';

/**
 * Weighted similarity scoring between extracted product features and a brand record.
 * Weights: keyword overlap 25%, feature overlap 30%, mechanism overlap 25%, category relevance 20%
 * Normalized to 0-100 scale.
 */
export function calculateSimilarity(features: ProductFeatures, patent: PatentRecord): number {
  // 1. Keyword overlap (25%)
  const userKeywords = features.searchKeywords.map(k => k.toLowerCase());
  const patentKeywords = patent.keywords.map(k => k.toLowerCase());
  const keywordIntersection = userKeywords.filter(k => patentKeywords.some(pk => pk.includes(k) || k.includes(pk)));
  const keywordUnion = new Set([...userKeywords, ...patentKeywords]);
  const keywordScore = keywordUnion.size > 0 ? (keywordIntersection.length / Math.min(userKeywords.length, 5)) : 0;
  const normalizedKeywordScore = Math.min(1, keywordScore);

  // 2. Feature overlap (30%)
  const userFeatures = features.coreFeatures.map(f => f.toLowerCase());
  const patentFeatures = patent.features.map(f => f.toLowerCase());
  let featureMatches = 0;
  for (const uf of userFeatures) {
    for (const pf of patentFeatures) {
      if (uf.includes(pf) || pf.includes(uf) || 
          uf.split(' ').some((w: string) => pf.includes(w) && w.length > 3)) {
        featureMatches++;
        break;
      }
    }
  }
  const normalizedFeatureScore = userFeatures.length > 0 ? featureMatches / Math.min(userFeatures.length, 4) : 0;

  // 3. Mechanism overlap (25%)
  const userMechanisms = features.mechanisms.map(m => m.toLowerCase());
  const patentMechanism = patent.mechanism.toLowerCase();
  let mechanismScore = 0;
  for (const um of userMechanisms) {
    const umKeywords = um.split(' ').filter((w: string) => w.length > 3);
    if (umKeywords.some((w: string) => patentMechanism.includes(w))) {
      mechanismScore += 1;
    }
  }
  const normalizedMechanismScore = userMechanisms.length > 0 ? Math.min(1, mechanismScore / Math.min(userMechanisms.length, 2)) : 0;

  // 4. Category relevance (20%)
  const productTypeLower = features.productType.toLowerCase();
  const categoryLower = patent.category.toLowerCase();
  let categoryScore = 0;
  if (productTypeLower.includes(categoryLower) || categoryLower.includes(productTypeLower)) {
    categoryScore = 1;
  } else if (
    (productTypeLower.includes('mobilya') && categoryLower.includes('mobilya')) ||
    (productTypeLower.includes('mutfak') && categoryLower.includes('mutfak')) ||
    (productTypeLower.includes('termos') && categoryLower.includes('termos')) ||
    (productTypeLower.includes('cilt') && categoryLower.includes('kisisel')) ||
    (productTypeLower.includes('bakım') && categoryLower.includes('kisisel')) ||
    (productTypeLower.includes('ev') && categoryLower.includes('ev')) ||
    (productTypeLower.includes('dekor') && categoryLower.includes('dekor'))
  ) {
    categoryScore = 0.8;
  } else {
    // Partial category match
    const ptWords = features.productType.toLowerCase().split(' ').filter((w: string) => w.length > 3);
    if (ptWords.some((w: string) => categoryLower.includes(w) || patent.productType.toLowerCase().includes(w))) {
      categoryScore = 0.5;
    }
  }

  // Weighted combination
  const finalScore = (
    normalizedKeywordScore * 0.25 +
    Math.min(1, normalizedFeatureScore) * 0.30 +
    normalizedMechanismScore * 0.25 +
    categoryScore * 0.20
  ) * 100;

  return Math.min(100, Math.max(0, Math.round(finalScore)));
}
