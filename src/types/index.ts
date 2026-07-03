
export interface ImportTask {
  id: string;
  filename: string;
  type: 'profiling' | 'exam';
  status: 'reading' | 'validating' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  totalCount?: number;
  successCount?: number;
  failCount?: number;
  batchId?: string;
  year?: string;
  operator: string;
  errorReportUrl?: string;
}

export interface HealthRecord {
  id: string;
  idCard: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  district: string;
  street: string;
  chronicDiseases: DiseaseRecord[];
  isDeceased: boolean;
  exams: ExamRecord[];
}

export interface DiseaseRecord {
  name: string;
  icdCode: string;
  diagnosisDate: string;
  isCardiovascular: boolean;
}

export interface ExamRecord {
  year: string;
  status: 'normal' | 'abnormal';
  bmi?: number;
  bloodPressure?: string;
  bloodSugar?: number;
  waistCircumference?: number;
}

export interface AnalysisData {
  avgAge: number;
  smokingRate: number;
  drinkingRate: number;
  overweightRate: number;
  obesityRate: number;
  underweightRate: number;
  centralObesityRate: number;
}

export interface TrendData {
  year: string;
  prevalence: number;
  treatmentRate: number;
  controlRate: number;
}
