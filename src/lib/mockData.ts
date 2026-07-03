
import { ImportTask, HealthRecord, TrendData } from '../types';

export const MOCK_TASKS: ImportTask[] = [
  {
    id: '1',
    filename: '2024年第一季度老年人名单.xlsx',
    type: 'profiling',
    status: 'completed',
    progress: 100,
    createdAt: '2024-03-15 10:00:00',
    completedAt: '2024-03-15 10:05:00',
    totalCount: 500,
    successCount: 495,
    failCount: 5,
    operator: '管理员',
    errorReportUrl: '#',
  },
  {
    id: '2',
    filename: '2023年体检数据汇总.xlsx',
    type: 'exam',
    status: 'validating',
    progress: 65,
    createdAt: '2024-04-10 14:30:00',
    year: '2023',
    batchId: 'BATCH-2023-001',
    operator: '张医生',
  },
  {
    id: '3',
    filename: '街道补录数据.xlsx',
    type: 'profiling',
    status: 'reading',
    progress: 20,
    createdAt: '2024-04-11 09:15:00',
    operator: '李干事',
  }
];

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: '1',
    idCard: '440103195001011234',
    name: '张大爷',
    age: 74,
    gender: 'male',
    district: '荔湾区',
    street: '金花街道',
    isDeceased: false,
    chronicDiseases: [
      { name: '高血压', icdCode: 'I10', diagnosisDate: '2020-05-12', isCardiovascular: true },
      { name: '糖尿病', icdCode: 'E11', diagnosisDate: '2021-08-20', isCardiovascular: false }
    ],
    exams: [
      { year: '2023', status: 'abnormal', bmi: 26.5, bloodPressure: '145/95', bloodSugar: 7.2, waistCircumference: 92 },
      { year: '2022', status: 'normal', bmi: 24.2, bloodPressure: '130/85', bloodSugar: 5.8, waistCircumference: 88 }
    ]
  },
  {
    id: '2',
    idCard: '440103194505205678',
    name: '李奶奶',
    age: 79,
    gender: 'female',
    district: '越秀区',
    street: '北京街道',
    isDeceased: true,
    chronicDiseases: [
      { name: '高血压', icdCode: 'I10', diagnosisDate: '2019-11-05', isCardiovascular: true },
      { name: '冠心病', icdCode: 'I25', diagnosisDate: '2022-03-15', isCardiovascular: true }
    ],
    exams: [
      { year: '2023', status: 'normal', bmi: 22.1, bloodPressure: '125/80', bloodSugar: 6.1, waistCircumference: 82 }
    ]
  },
  {
    id: '3',
    idCard: '440111195211118888',
    name: '王伯伯',
    age: 72,
    gender: 'male',
    district: '白云区',
    street: '同和街道',
    isDeceased: false,
    chronicDiseases: [
      { name: '慢性支气管炎', icdCode: 'J41', diagnosisDate: '2023-01-10', isCardiovascular: false }
    ],
    exams: [
      { year: '2023', status: 'abnormal', bmi: 28.2, bloodPressure: '150/100', bloodSugar: 8.5, waistCircumference: 105 }
    ]
  },
  {
    id: '4',
    idCard: '440106195503032222',
    name: '刘阿姨',
    age: 69,
    gender: 'female',
    district: '天河区',
    street: '林和街道',
    isDeceased: false,
    chronicDiseases: [
      { name: '糖尿病', icdCode: 'E11', diagnosisDate: '2022-06-30', isCardiovascular: false }
    ],
    exams: [
      { year: '2023', status: 'normal', bmi: 23.5, bloodPressure: '120/75', bloodSugar: 5.5, waistCircumference: 78 }
    ]
  }
];

export const MOCK_TREND_DATA: Record<string, any[]> = {
  '高血压': [
    { year: '2019', '荔湾区': 42.5, '越秀区': 43.1, '海珠区': 41.8, '天河区': 40.5, '白云区': 44.2, '全市平均': 42.4 },
    { year: '2020', '荔湾区': 43.8, '越秀区': 44.5, '海珠区': 42.9, '天河区': 41.2, '白云区': 45.5, '全市平均': 43.6 },
    { year: '2021', '荔湾区': 45.2, '越秀区': 46.1, '海珠区': 44.2, '天河区': 42.8, '白云区': 46.8, '全市平均': 45.0 },
    { year: '2022', '荔湾区': 47.1, '越秀区': 47.8, '海珠区': 45.5, '天河区': 43.5, '白云区': 48.2, '全市平均': 46.4 },
    { year: '2023', '荔湾区': 49.1, '越秀区': 49.5, '海珠区': 47.2, '天河区': 44.8, '白云区': 49.8, '全市平均': 48.1 },
  ],
  '糖尿病': [
    { year: '2019', '荔湾区': 11.2, '越秀区': 12.5, '海珠区': 10.8, '天河区': 9.5, '白云区': 11.8, '全市平均': 11.2 },
    { year: '2020', '荔湾区': 12.1, '越秀区': 13.2, '海珠区': 11.5, '天河区': 10.2, '白云区': 12.5, '全市平均': 11.9 },
    { year: '2021', '荔湾区': 13.2, '越秀区': 14.1, '海珠区': 12.2, '天河区': 11.1, '白云区': 13.8, '全市平均': 12.9 },
    { year: '2022', '荔湾区': 14.5, '越秀区': 15.3, '海珠区': 13.5, '天河区': 12.1, '白云区': 14.9, '全市平均': 14.1 },
    { year: '2023', '荔湾区': 15.8, '越秀区': 16.2, '海珠区': 14.8, '天河区': 13.2, '白云区': 16.5, '全市平均': 15.3 },
  ],
  '血脂异常': [
    { year: '2019', '荔湾区': 32.5, '越秀区': 33.1, '海珠区': 31.8, '天河区': 30.5, '白云区': 34.2, '全市平均': 32.4 },
    { year: '2020', '荔湾区': 33.8, '越秀区': 34.5, '海珠区': 32.9, '天河区': 31.2, '白云区': 35.5, '全市平均': 33.6 },
    { year: '2021', '荔湾区': 35.2, '越秀区': 36.1, '海珠区': 34.2, '天河区': 32.8, '白云区': 36.8, '全市平均': 35.0 },
    { year: '2022', '荔湾区': 37.1, '越秀区': 37.8, '海珠区': 35.5, '天河区': 33.5, '白云区': 38.2, '全市平均': 36.4 },
    { year: '2023', '荔湾区': 38.8, '越秀区': 39.5, '海珠区': 37.2, '天河区': 34.8, '白云区': 39.8, '全市平均': 38.0 },
  ],
  '贫血': [
    { year: '2019', '荔湾区': 5.2, '越秀区': 5.5, '海珠区': 5.1, '天河区': 4.8, '白云区': 5.6, '全市平均': 5.2 },
    { year: '2020', '荔湾区': 5.4, '越秀区': 5.8, '海珠区': 5.3, '天河区': 4.9, '白云区': 5.9, '全市平均': 5.5 },
    { year: '2021', '荔湾区': 5.6, '越秀区': 6.1, '海珠区': 5.5, '天河区': 5.1, '白云区': 6.2, '全市平均': 5.7 },
    { year: '2022', '荔湾区': 5.8, '越秀区': 6.3, '海珠区': 5.7, '天河区': 5.3, '白云区': 6.5, '全市平均': 5.9 },
    { year: '2023', '荔湾区': 6.0, '越秀区': 6.5, '海珠区': 5.9, '天河区': 5.5, '白云区': 6.8, '全市平均': 6.1 },
  ]
};
