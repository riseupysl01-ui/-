// 医疗与公卫数据管理系统 - 队列随访信息 - 静态模拟数据及字典表

export interface DiseaseDict {
  name: string;
  icd: string;
}

export interface FollowUpMockPerson {
  id: string;
  idCard: string;
  name: string;
  gender: "男" | "女";
  phone: string;
  ethnicity: "汉族" | "少数民族";
  county: string;          // 对应账号权限范围内的 街道/镇/乡
  diseases: string[];      // 常见慢病判定
  deathStatus: string;     // 死亡数据仓来源：如果有死亡时间，展示死亡时间；否则展现 「-」
  status: "active" | "deceased" | "lost" | "new_outcome";
  lastFollowUpDate?: string;
  lastFollowUpMethod?: string;
  lastFollowUpInvestigator?: string;
}

// 筛选区常见慢病选项清单
export const CHRONIC_DISEASE_OPTIONS = [
  "肿瘤",
  "心脏疾病",
  "慢阻肺",
  "心脑血管疾病",
  "糖尿病",
  "高血压",
  "肾脏疾病",
  "神经系统疾病",
  "血管疾病",
  "眼部疾病",
  "骨质疏松",
  "高血脂"
];

// A10A 固定的 25 种疾病及其 ICD 编码列表
export const A10A_DISEASE_LIST: DiseaseDict[] = [
  { name: "高血压", icd: "I10" },
  { name: "糖尿病", icd: "E11" },
  { name: "高脂血症", icd: "E78.500" },
  { name: "缺血性心脏病", icd: "I21-I22, I25" },
  { name: "脑血管病", icd: "I60-J69" },
  { name: "慢性阻塞性肺病", icd: "J40-J44" },
  { name: "风心病", icd: "I09.9" },
  { name: "肺源性心脏病", icd: "I27.9" },
  { name: "帕金森病", icd: "G20-G22" },
  { name: "慢性肾病", icd: "N18" },
  { name: "阿尔茨海默病", icd: "G30、F00" },
  { name: "血管性痴呆", icd: "F01" },
  { name: "轻度认知障碍", icd: "F06.7" },
  { name: "痴呆", icd: "F02-F03, G31.801、G31.805" },
  { name: "脂肪肝", icd: "K76.0" },
  { name: "慢性胃肠炎", icd: "K52.9" },
  { name: "类风湿性关节炎", icd: "M05-M06" },
  { name: "痛风", icd: "M10" },
  { name: "椎间盘疾病", icd: "M50-M51" },
  { name: "精神心理疾患", icd: "F41、F32、F33" },
  { name: "脑外伤", icd: "S00-S09" },
  { name: "甲亢", icd: "E05" },
  { name: "甲状腺功能减退", icd: "E03" },
  { name: "骨质疏松", icd: "M80.8,M81.8" },
  { name: "恶性肿瘤", icd: "C00-C97" }
];

// 5-8条模拟数据，体现不同性别、民族、慢病、死亡状态
export const INITIAL_MOCK_PEOPLE: FollowUpMockPerson[] = [
  {
    id: "1",
    idCard: "370102194801121234",
    name: "张建国",
    gender: "男",
    phone: "13854129988",
    ethnicity: "汉族",
    county: "天河区林和街道",
    diseases: ["高血压", "糖尿病"],
    deathStatus: "-",
    status: "active"
  },
  {
    id: "2",
    idCard: "650102195005205678",
    name: "阿尔曼·买买提",
    gender: "男",
    phone: "13580456123",
    ethnicity: "少数民族",
    county: "荔湾区金花街道",
    diseases: ["心脑血管疾病", "高血脂"],
    deathStatus: "-",
    status: "active"
  },
  {
    id: "3",
    idCard: "440103194203032222",
    name: "李秀珍",
    gender: "女",
    phone: "13690224411",
    ethnicity: "汉族",
    county: "越秀区北京街道",
    diseases: ["慢阻肺", "骨质疏松"],
    deathStatus: "-",
    status: "lost"
  },
  {
    id: "4",
    idCard: "650103194508129999",
    name: "帕提玛·吾守尔",
    gender: "女",
    phone: "13622334455",
    ethnicity: "少数民族",
    county: "白云区同和街道",
    diseases: ["肿瘤"],
    deathStatus: "2024-03-12 去世",
    status: "deceased",
    lastFollowUpDate: "2024-03-12",
    lastFollowUpMethod: "入户",
    lastFollowUpInvestigator: "陈医生"
  },
  {
    id: "5",
    idCard: "210102194712128888",
    name: "赵铁柱",
    gender: "男",
    phone: "18699887766",
    ethnicity: "汉族",
    county: "黄埔区鱼珠街道",
    diseases: ["高血压", "血管疾病", "眼部疾病"],
    deathStatus: "-",
    status: "active"
  },
  {
    id: "6",
    idCard: "440106195104104444",
    name: "孙妙音",
    gender: "女",
    phone: "15911110000",
    ethnicity: "汉族",
    county: "天河区林和街道",
    diseases: ["骨质疏松", "神经系统疾病"],
    deathStatus: "-",
    status: "new_outcome"
  },
  {
    id: "7",
    idCard: "110102192109090011",
    name: "钱百岁",
    gender: "男",
    phone: "13011112222",
    ethnicity: "汉族",
    county: "越秀区北京街道",
    diseases: ["高血压", "心脏疾病"],
    deathStatus: "-",
    status: "active"
  },
  {
    id: "8",
    idCard: "150102195302146666",
    name: "乌兰托娅",
    gender: "女",
    phone: "13144445555",
    ethnicity: "少数民族",
    county: "白云区同和街道",
    diseases: ["肾脏疾病"],
    deathStatus: "-",
    status: "active"
  }
];

// 默认街道选项列表 (区县联动列表)
export const DISTRICT_TOWNS = [
  "天河区林和街道",
  "荔湾区金花街道",
  "越秀区北京街道",
  "白云区同和街道",
  "黄埔区鱼珠街道",
  "历下区龙洞街道",
  "西城区展览路街道",
  "沙依巴克区友好街道",
  "哈密街街道"
];
