export type Verdict = 'pass' | 'caution' | 'avoid';

export interface AnalysisResult {
  verdict: Verdict;
  whatStoodOut: string;
  whyMatters: string;
  whatsUncertain: string;
  bottomLine: string;
}

export interface DietaryProfile {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  restrictions: string[];
  allergies: string[];
  preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  product_name: string | null;
  ingredients_text: string;
  verdict: Verdict;
  what_stood_out: string | null;
  why_matters: string | null;
  whats_uncertain: string | null;
  bottom_line: string | null;
  is_starred: boolean;
  created_at: string;
}

export type InputMethod = 'text' | 'image' | 'search';
