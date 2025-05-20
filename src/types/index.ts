
export type CountryStance = 'agree' | 'disagree' | 'mixed' | 'unknown';

export interface CountryAnalysis {
  countryCode: string;
  countryName: string;
  stance: CountryStance;
  confidence: number; // 0-100
  summary: string;
  headlines: Headline[];
  culturalContext?: string[];
}

export interface Headline {
  title: string;
  url: string;
  source: string;
  stance: CountryStance;
  date: string;
}

export interface ClaimResult {
  claim: string;
  truthIndex: number; // 0-100
  globalConsensus: string;
  countryAnalysis: CountryAnalysis[];
  timestamp: string;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export interface ApiKeyState {
  hasKey: boolean;
  key: string | null;
}
