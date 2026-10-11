export type Dimension = 'grit' | 'purpose' | 'self_control';

export interface QuestionOption {
  value: number;
  label: string;
}

export interface Question {
  id: number;
  order: number;
  text: string;
  dimension: Dimension;
  subdimension: string;
  options: QuestionOption[];
  required: boolean;
  scored: boolean;
  reverseScored: boolean;
  enabled: boolean;
}

export interface StageOption {
  id: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface DimensionScore {
  key: Dimension;
  name: string;
  score: number; // 0 to 100
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface SubdimensionScore {
  name: string;
  dimension: Dimension;
  score: number; // 0 to 100
  color: string;
}

export interface ScoreReport {
  compositeScore: number; // 0 to 100
  gritScore: number;
  purposeScore: number;
  selfControlScore: number;
  dimensionScores: DimensionScore[];
  subdimensionScores: SubdimensionScore[];
  strongestDimension: DimensionScore;
  weakestDimension: DimensionScore;
  encouragementSummary: string;
  recommendations: {
    strengthTitle: string;
    strengthBullets: string[];
    growthTitle: string;
    growthBullets: string[];
  };
}

export type ScreenType =
  | 'welcome'
  | 'intro'
  | 'survey'
  | 'supplemental'
  | 'results'
  | 'admin_dashboard';

export type AspectRatioMode = '16:9' | '9:16';
