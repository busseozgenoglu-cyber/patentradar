export interface ProductFeatures {
  productType: string;
  purpose: string;
  coreFeatures: string[];
  mechanisms: string[];
  materialsOrStructure: string[];
  noveltySignals: string[];
  searchKeywords: string[];
}

export interface PatentRecord {
  id: string;
  title: string;
  patentNumber: string;
  abstract: string;
  category: string;
  features: string[];
  keywords: string[];
  mechanism: string;
  productType: string;
}

export interface TopMatch {
  title: string;
  patent_number: string;
  summary: string;
  similarity_score: number;
  match_reasons: string[];
  category: string;
}

export interface AnalysisResult {
  id: string;
  product_summary: string;
  detected_features: string[];
  search_keywords: string[];
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  summary_comment: string;
  top_matches: TopMatch[];
  risk_factors: string[];
  uniqueness_suggestions: string[];
  disclaimer: string;
  createdAt: string;
  inputText: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  analysesCount: number;
  createdAt: string;
}

export interface StoredAnalysis {
  id: string;
  userId?: string;
  inputText: string;
  result: AnalysisResult;
  createdAt: string;
  pdfGenerated?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
}
