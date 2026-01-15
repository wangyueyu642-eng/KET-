
export enum TaskType {
  PART6 = 'Part 6',
  PART7 = 'Part 7',
  BOTH = 'Combined (Part 6 & 7)'
}

export interface ScoreBreakdown {
  content: number;
  organisation: number;
  language: number;
  totalRaw: number;
  scaleScore: number;
  cefrLevel: string;
}

export interface FeedbackSection {
  dimension: string;
  score: number;
  comments: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface GradingResult {
  overallSummary: string;
  totalScaleScore: number;
  overallCefrLevel: string;
  tasks: {
    taskName: string;
    scores: ScoreBreakdown;
    feedback: FeedbackSection[];
    corrections: Correction[];
    improvementSuggestions: string[];
  }[];
}

export interface ImageData {
  base64: string;
  mimeType: string;
}
