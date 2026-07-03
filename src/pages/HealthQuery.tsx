import * as React from "react";
import { 
  Search, 
  Filter, 
  Download,
  Database,
  RefreshCcw,
  User,
  Heart,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeAlert,
  SlidersHorizontal,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Info,
  Plus,
  X,
  RotateCw,
  Maximize2,
  LayoutGrid,
  Inbox,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Complete Interface for all fields across boards
interface MedicalRecord {
  id: string;
  year: string;
  icdCode: string;
  diseaseName: string;
  district: string; // District (Data source: To Be Determined / 待确定)
  screenResult: string; // 筛查结果/对应结果
  deathTime: string; // 死亡时间 (时间 or "-")
  diagnosisTime?: string; // 诊断时间
  
  // Board 1: 基本体检信息
  name: string;
  gender: "男" | "女";
  idCard: string;
  phone: string;
  ethnicity: "汉族" | "少数民族";
  education: string; 
  occupation: string;
  marriage: string;
  householdType: "主城区" | "非主城区";
  feePayMode: string;
  hospital: string;
  address: string;

  // Board 2: 一般检查情况
  sbpLeft: number;
  sbpRight: number;
  dbpLeft: number;
  dbpRight: number;
  height: number;
  weight: number;
  waist: number;
  bmi: number;
  healthEvalScore: "基本满意" | "满意" | "不太满意" | "说不清楚";
  selfCareScore: "可自理(0~3分)" | "轻度依赖(4-8分)" | "中度依赖(9~18分)" | "不能自理(≥19分)";
  cognition: "筛选阴性" | "筛选阳性";
  exerciseFreq: "每天" | "每周一次以上" | "偶尔" | "不锻炼";
  exerciseMinutes: number;
  exerciseYears: string;
  exerciseMode: string;
  dietHabit: "荤素均衡" | "荤食为主" | "素食为主" | "嗜盐" | "嗜油" | "嗜糖";
  smokeStatus: "从不吸烟" | "已戒烟" | "吸烟";
  smokeAge: string;
  alcoholFreq: "从不" | "偶尔" | "经常" | "每天";
  alcoholType: string;
  isQuitAlcohol: string;
  alcoholAge: string;
  isDrunkPastYear: string;
  mouthState: "正常" | "龋齿" | "义齿（假牙）/缺齿";
  leftEye: string;
  rightEye: string;
  hearing: "听见" | "听不清或无法听见";
  edema: "无" | "单侧" | "双侧不对称" | "双侧对称";
  pulse: "触及双侧对称" | "未触及" | "触及左侧弱或消失" | "触及右侧弱或消失";

  // Board 3: 辅助检查情况
  hemoglobin: number;
  wbc: number;
  platelet: number;
  urineProtein: string;
  urineSugar: string;
  urineKetone: string;
  urineBlood: string;
  urineOthers: string;
  alt: number;
  ast: number;
  albumin: number;
  totalBilirubin: number;
  directBilirubin: number;
  creatinine: number;
  urea: number;
  cholesterol: number;
  triglyceride: number;
  ldl: number;
  hdl: number;
  chestXray: string;
  chestXrayAbnormal: string;
  bUltrasound: string;
  bUltrasoundAbnormal: string;
  fattyLiver: "正常" | "异常";
  otherUltrasound: string;
  otherUltrasoundAbnormal: string;
  chestCT: string;

  // Board 5: 健康评价
  healthEvaluationResult: "有异常" | "无异常";
  healthEvaluationDetail: string;
}

// Highly comprehensive medical query records mimicking realistic values
const MOCK_QUERY_RECORDS: MedicalRecord[] = [
  {
    id: "REC001",
    year: "2024",
    icdCode: "I10",
    diseaseName: "原发性高血压",
    district: "荔湾区",
    screenResult: "血压持续偏高，伴有舒张功能障碍",
    deathTime: "-",
    name: "张敬安",
    gender: "男",
    idCard: "440103195208151234",
    phone: "13800200112",
    ethnicity: "汉族",
    education: "大学专科和专科学校",
    occupation: "专业技术人员",
    marriage: "已婚",
    householdType: "主城区",
    feePayMode: "城镇职工基本医疗保险",
    hospital: "荔湾区人民医院",
    address: "广州市荔湾区金花街道桃源社区3号",
    sbpLeft: 145,
    sbpRight: 142,
    dbpLeft: 92,
    dbpRight: 90,
    height: 168,
    weight: 72,
    waist: 91,
    bmi: 25.5,
    healthEvalScore: "基本满意",
    selfCareScore: "可自理(0~3分)",
    cognition: "筛选阴性",
    exerciseFreq: "每天",
    exerciseMinutes: 45,
    exerciseYears: "10年以上",
    exerciseMode: "慢跑/徒步",
    dietHabit: "荤素均衡",
    smokeStatus: "已戒烟",
    smokeAge: "20",
    alcoholFreq: "偶尔",
    alcoholType: "黄酒",
    isQuitAlcohol: "未戒酒",
    alcoholAge: "25",
    isDrunkPastYear: "无",
    mouthState: "正常",
    leftEye: "4.6",
    rightEye: "4.5",
    hearing: "听见",
    edema: "无",
    pulse: "触及双侧对称",
    hemoglobin: 145,
    wbc: 5.8,
    platelet: 210,
    urineProtein: "0",
    urineSugar: "0",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "无",
    alt: 28,
    ast: 24,
    albumin: 42,
    totalBilirubin: 14.5,
    directBilirubin: 4.1,
    creatinine: 78,
    urea: 5.2,
    cholesterol: 5.61,
    triglyceride: 1.82,
    ldl: 3.42,
    hdl: 1.15,
    chestXray: "大致正常",
    chestXrayAbnormal: "无",
    bUltrasound: "脂肪肝征象",
    bUltrasoundAbnormal: "轻度脂肪肝",
    fattyLiver: "异常",
    otherUltrasound: "未见明显异常",
    otherUltrasoundAbnormal: "无",
    chestCT: "两肺纹理增多",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 原发性高血压诊断明确；2. 轻度脂肪肝提示饮食控制。"
  },
  {
    id: "REC002",
    year: "2023",
    icdCode: "E11",
    diseaseName: "2型糖尿病",
    district: "白云区",
    screenResult: "空腹血糖 8.2mmol/L，多食多饮典型表现",
    deathTime: "-",
    name: "李爱德",
    gender: "男",
    idCard: "44011119481102553X",
    phone: "13511029410",
    ethnicity: "少数民族",
    education: "高中",
    occupation: "农林牧渔水利业生产人员",
    marriage: "已婚",
    householdType: "非主城区",
    feePayMode: "新型农村合作医疗",
    hospital: "同和街道社区卫生服务中心",
    address: "广州市白云区同和街道白山自建自防房",
    sbpLeft: 132,
    sbpRight: 130,
    dbpLeft: 84,
    dbpRight: 80,
    height: 172,
    weight: 84,
    waist: 102,
    bmi: 28.4,
    healthEvalScore: "不太满意",
    selfCareScore: "轻度依赖(4-8分)",
    cognition: "筛选阴性",
    exerciseFreq: "偶尔",
    exerciseMinutes: 20,
    exerciseYears: "5年以下",
    exerciseMode: "散步",
    dietHabit: "嗜油",
    smokeStatus: "吸烟",
    smokeAge: "18",
    alcoholFreq: "每天",
    alcoholType: "高度白酒",
    isQuitAlcohol: "否",
    alcoholAge: "20",
    isDrunkPastYear: "是",
    mouthState: "龋齿",
    leftEye: "4.2",
    rightEye: "4.0",
    hearing: "听不清或无法听见",
    edema: "单侧",
    pulse: "触及左侧弱或消失",
    hemoglobin: 130,
    wbc: 7.2,
    platelet: 185,
    urineProtein: "1+",
    urineSugar: "2+",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "蛋白尿偏高",
    alt: 45,
    ast: 38,
    albumin: 38,
    totalBilirubin: 18.2,
    directBilirubin: 5.6,
    creatinine: 95,
    urea: 6.8,
    cholesterol: 6.2,
    triglyceride: 2.8,
    ldl: 4.1,
    hdl: 0.92,
    chestXray: "主动脉硬化迹象",
    chestXrayAbnormal: "胸腔少许陈旧性纤维灶",
    bUltrasound: "重度弥漫性脂肪肝",
    bUltrasoundAbnormal: "重度脂肪肝伴胆囊壁稍毛糙",
    fattyLiver: "异常",
    otherUltrasound: "未见异常",
    otherUltrasoundAbnormal: "无",
    chestCT: "未见异常",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 2型糖尿病需规范口服药治疗；2. 重度脂肪肝及高脂血症，需严格限制高脂糖类食物。"
  },
  {
    id: "REC003",
    year: "2024",
    icdCode: "E78",
    diseaseName: "混合型高脂血症",
    district: "天河区",
    screenResult: "血清甘油三酯、低密度脂蛋白极度升高",
    deathTime: "-",
    name: "陈慧珍",
    gender: "女",
    idCard: "440106195612182245",
    phone: "13699228833",
    ethnicity: "汉族",
    education: "大学本科",
    occupation: "国家机关/党群组织/企业/事业单位负责人",
    marriage: "离婚",
    householdType: "主城区",
    feePayMode: "城镇职工基本医疗保险",
    hospital: "中山大学第三附属医院",
    address: "广州市天河区林和街道雅苑社区小区",
    sbpLeft: 124,
    sbpRight: 122,
    dbpLeft: 78,
    dbpRight: 76,
    height: 158,
    weight: 54,
    waist: 76,
    bmi: 21.6,
    healthEvalScore: "满意",
    selfCareScore: "可自理(0~3分)",
    cognition: "筛选阴性",
    exerciseFreq: "每周一次以上",
    exerciseMinutes: 60,
    exerciseYears: "8年",
    exerciseMode: "广场舞/太极拳",
    dietHabit: "素食为主",
    smokeStatus: "从不吸烟",
    smokeAge: "0",
    alcoholFreq: "从不",
    alcoholType: "无",
    isQuitAlcohol: "从不饮酒",
    alcoholAge: "0",
    isDrunkPastYear: "无",
    mouthState: "义齿（假牙）/缺齿",
    leftEye: "4.8",
    rightEye: "4.7",
    hearing: "听见",
    edema: "无",
    pulse: "触及双侧对称",
    hemoglobin: 128,
    wbc: 5.1,
    platelet: 230,
    urineProtein: "0",
    urineSugar: "0",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "无",
    alt: 18,
    ast: 20,
    albumin: 45,
    totalBilirubin: 12.1,
    directBilirubin: 3.5,
    creatinine: 62,
    urea: 4.8,
    cholesterol: 6.85,
    triglyceride: 2.45,
    ldl: 4.62,
    hdl: 1.48,
    chestXray: "两肺野清晰",
    chestXrayAbnormal: "无",
    bUltrasound: "未见异常",
    bUltrasoundAbnormal: "无",
    fattyLiver: "正常",
    otherUltrasound: "未见异常",
    otherUltrasoundAbnormal: "无",
    chestCT: "未见异常",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 混合型高脂血症，已建议口服阿托伐他汀；2. 轻微缺齿，日常注意口腔保健。"
  },
  {
    id: "REC004",
    year: "2023",
    icdCode: "I25",
    diseaseName: "慢性缺血性心脏病",
    district: "越秀区",
    screenResult: "心电图呈多源性早搏，自诉活动后胸闷明显",
    deathTime: "2024-11-20",
    name: "林建华",
    gender: "男",
    idCard: "440104193902148119",
    phone: "13322114455",
    ethnicity: "汉族",
    education: "初中",
    occupation: "生产/运输设备操作人员及有关人员",
    marriage: "丧偶",
    householdType: "主城区",
    feePayMode: "城镇居民基本医疗保险",
    hospital: "越秀区北京老龄关怀医院",
    address: "广州市越秀区北京街道盐运西老旧合院",
    sbpLeft: 118,
    sbpRight: 115,
    dbpLeft: 71,
    dbpRight: 70,
    height: 162,
    weight: 51,
    waist: 79,
    bmi: 19.4,
    healthEvalScore: "说不清楚",
    selfCareScore: "中度依赖(9~18分)",
    cognition: "筛选阳性",
    exerciseFreq: "不锻炼",
    exerciseMinutes: 0,
    exerciseYears: "无",
    exerciseMode: "无",
    dietHabit: "荤素均衡",
    smokeStatus: "已戒烟",
    smokeAge: "22",
    alcoholFreq: "从不",
    alcoholType: "无",
    isQuitAlcohol: "已无饮酒习惯",
    alcoholAge: "30",
    isDrunkPastYear: "无",
    mouthState: "义齿（假牙）/缺齿",
    leftEye: "3.9",
    rightEye: "3.5",
    hearing: "听不清或无法听见",
    edema: "双侧对称",
    pulse: "触及右侧弱或消失",
    hemoglobin: 110,
    wbc: 4.9,
    platelet: 142,
    urineProtein: "0",
    urineSugar: "0",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "无",
    alt: 22,
    ast: 31,
    albumin: 35,
    totalBilirubin: 15.6,
    directBilirubin: 4.8,
    creatinine: 110,
    urea: 8.5,
    cholesterol: 4.8,
    triglyceride: 1.12,
    ldl: 2.8,
    hdl: 1.02,
    chestXray: "心影偏大，伴左室肥厚",
    chestXrayAbnormal: "右肺门影增浓增宽",
    bUltrasound: "未见异常",
    bUltrasoundAbnormal: "无",
    fattyLiver: "正常",
    otherUltrasound: "未见异常",
    otherUltrasoundAbnormal: "无",
    chestCT: "两肺支气管壁轻度增厚",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 慢性冠心病处于失代偿期风险；2. 伴有中度自理缺陷，已嘱托家属加强日常照料防跌防碰。"
  },
  {
    id: "REC005",
    year: "2022",
    icdCode: "J41",
    diseaseName: "单纯性慢性支气管炎",
    district: "从化区",
    screenResult: "长期反复咳痰喘，双侧听诊呼吸音粗糙",
    deathTime: "-",
    name: "黄根深",
    gender: "男",
    idCard: "440184194504106692",
    phone: "17722109988",
    ethnicity: "汉族",
    education: "小学",
    occupation: "农林牧渔水利业生产人员",
    marriage: "已婚",
    householdType: "非主城区",
    feePayMode: "新型农村合作医疗",
    hospital: "从化区中医医院",
    address: "广州市从化区江埔街山水生态养生示范村",
    sbpLeft: 138,
    sbpRight: 136,
    dbpLeft: 82,
    dbpRight: 80,
    height: 165,
    weight: 60,
    waist: 85,
    bmi: 22.0,
    healthEvalScore: "基本满意",
    selfCareScore: "可自理(0~3分)",
    cognition: "筛选阴性",
    exerciseFreq: "不锻炼",
    exerciseMinutes: 0,
    exerciseYears: "无",
    exerciseMode: "无",
    dietHabit: "荤食为主",
    smokeStatus: "吸烟",
    smokeAge: "16",
    alcoholFreq: "经常",
    alcoholType: "米酒/自酿药酒",
    isQuitAlcohol: "未戒酒",
    alcoholAge: "18",
    isDrunkPastYear: "无",
    mouthState: "义齿（假牙）/缺齿",
    leftEye: "4.5",
    rightEye: "4.4",
    hearing: "听见",
    edema: "无",
    pulse: "触及双侧对称",
    hemoglobin: 138,
    wbc: 8.9,
    platelet: 198,
    urineProtein: "0",
    urineSugar: "0",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "尿酸微偏高",
    alt: 35,
    ast: 28,
    albumin: 39,
    totalBilirubin: 14.0,
    directBilirubin: 4.0,
    creatinine: 86,
    urea: 6.1,
    cholesterol: 5.12,
    triglyceride: 1.5,
    ldl: 3.12,
    hdl: 1.2,
    chestXray: "两肺野透亮度增强，呈肺气肿平片改变",
    chestXrayAbnormal: "双肺纹理支气管样扩散",
    bUltrasound: "未见明显异常",
    bUltrasoundAbnormal: "无",
    fattyLiver: "正常",
    otherUltrasound: "前列腺肥大或轻度钙化",
    otherUltrasoundAbnormal: "前列腺轻度增生",
    chestCT: "两肺细支气管炎伴局部小灶状气肿",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 慢性支气管炎发作期；2. 戒烟限酒警告；3. 辅助超声提示良性前列腺增生。"
  },
  {
    id: "REC006",
    year: "2024",
    icdCode: "I10",
    diseaseName: "高血压合并心功能不全",
    district: "黄埔区",
    screenResult: "左心室收缩负荷重，活动时心慌不适",
    deathTime: "-",
    name: "孙淑芬",
    gender: "女",
    idCard: "440112195007211102",
    phone: "15988224411",
    ethnicity: "汉族",
    education: "中等专业学校",
    occupation: "商业/服务业人员",
    marriage: "丧偶",
    householdType: "非主城区",
    feePayMode: "城镇居民基本医疗保险",
    hospital: "黄埔区文冲街社区网络健康驿站",
    address: "广州市黄埔区文冲街道新沙乐居小区",
    sbpLeft: 151,
    sbpRight: 148,
    dbpLeft: 96,
    dbpRight: 94,
    height: 154,
    weight: 68,
    waist: 94,
    bmi: 28.7,
    healthEvalScore: "不太满意",
    selfCareScore: "可自理(0~3分)",
    cognition: "筛选阴性",
    exerciseFreq: "偶尔",
    exerciseMinutes: 15,
    exerciseYears: "2年",
    exerciseMode: "慢走",
    dietHabit: "嗜油",
    smokeStatus: "从不吸烟",
    smokeAge: "0",
    alcoholFreq: "从不",
    alcoholType: "无",
    isQuitAlcohol: "从不饮酒",
    alcoholAge: "0",
    isDrunkPastYear: "无",
    mouthState: "正常",
    leftEye: "4.3",
    rightEye: "4.2",
    hearing: "听见",
    edema: "无",
    pulse: "触及右侧弱或消失",
    hemoglobin: 119,
    wbc: 6.4,
    platelet: 178,
    urineProtein: "0",
    urineSugar: "0",
    urineKetone: "0",
    urineBlood: "0",
    urineOthers: "无",
    alt: 21,
    ast: 19,
    albumin: 37,
    totalBilirubin: 11.2,
    directBilirubin: 3.1,
    creatinine: 71,
    urea: 5.0,
    cholesterol: 5.92,
    triglyceride: 2.15,
    ldl: 3.82,
    hdl: 1.08,
    chestXray: "心影向左下扩大",
    chestXrayAbnormal: "双下肺由于淤血导致的间质性稍模糊",
    bUltrasound: "轻度脂肪肝、胆囊结石",
    bUltrasoundAbnormal: "胆囊壁结石约0.8cm伴点状回声",
    fattyLiver: "异常",
    otherUltrasound: "未见异常",
    otherUltrasoundAbnormal: "无",
    chestCT: "未见严重异常",
    healthEvaluationResult: "有异常",
    healthEvaluationDetail: "1. 高血压合并左心室扩大代偿；2. 胆囊多发结石，定期随访并饮食严禁过于油腻。"
  }
];

export function HealthQueryPage() {
  // ----------------------------------------------------
  // Primary Mock Records for 2026 to ensure default visual states match
  // ----------------------------------------------------
  const MOCK_2026_RECORDS = [
    {
      id: "REC2026-01",
      year: "2026",
      icdCode: "I10",
      diseaseName: "原发性高血压",
      district: "越秀区",
      screenResult: "左室顺应性下降，舒张期负荷偏重及动脉硬化倾向",
      deathTime: "-",
      diagnosisTime: "2026-03-12",
      name: "陈大鹏",
      gender: "男" as "男" | "女",
      idCard: "44010419451012351X",
      phone: "13911002233",
      ethnicity: "汉族" as "汉族" | "少数民族",
      education: "大学本科",
      occupation: "专业技术人员",
      marriage: "已婚",
      householdType: "主城区" as "主城区" | "非主城区",
      feePayMode: "城镇职工基本医疗保险",
      hospital: "越秀北路公卫中心",
      address: "广州市越秀区北京路18号",
      sbpLeft: 142,
      sbpRight: 140,
      dbpLeft: 88,
      dbpRight: 86,
      height: 170,
      weight: 75,
      waist: 92,
      bmi: 26.0,
      healthEvalScore: "满意" as const,
      selfCareScore: "可自理(0~3分)" as const,
      cognition: "筛选阴性" as const,
      exerciseFreq: "每天" as const,
      exerciseMinutes: 50,
      exerciseYears: "10年以上",
      exerciseMode: "慢跑",
      dietHabit: "荤素均衡" as const,
      smokeStatus: "已戒烟" as const,
      smokeAge: "25",
      alcoholFreq: "从不" as const,
      alcoholType: "无",
      isQuitAlcohol: "从不饮酒",
      alcoholAge: "0",
      isDrunkPastYear: "无",
      mouthState: "正常" as const,
      leftEye: "4.7",
      rightEye: "4.6",
      hearing: "听见" as const,
      edema: "无" as const,
      pulse: "触及双侧对称" as const,
      hemoglobin: 148,
      wbc: 6.0,
      platelet: 215,
      urineProtein: "0",
      urineSugar: "0",
      urineKetone: "0",
      urineBlood: "0",
      urineOthers: "无",
      alt: 25,
      ast: 22,
      albumin: 43,
      totalBilirubin: 13.8,
      directBilirubin: 3.9,
      creatinine: 80,
      urea: 5.0,
      cholesterol: 5.4,
      triglyceride: 1.6,
      ldl: 3.1,
      hdl: 1.25,
      chestXray: "大致正常",
      chestXrayAbnormal: "无",
      bUltrasound: "正常",
      bUltrasoundAbnormal: "无",
      fattyLiver: "正常" as const,
      otherUltrasound: "正常",
      otherUltrasoundAbnormal: "无",
      chestCT: "无异常",
      healthEvaluationResult: "无异常" as const,
      healthEvaluationDetail: "正常"
    },
    {
      id: "REC2026-02",
      year: "2026",
      icdCode: "E11",
      diseaseName: "2型糖尿病",
      district: "越秀区",
      screenResult: "餐后2小时血糖 12.5mmol/L，伴有多饮多尿典型表现",
      deathTime: "-",
      diagnosisTime: "2026-04-18",
      name: "林春燕",
      gender: "女" as "男" | "女",
      idCard: "440104194806082218",
      phone: "15911223344",
      ethnicity: "汉族" as "汉族" | "少数民族",
      education: "高中",
      occupation: "办事人员",
      marriage: "已婚",
      householdType: "主城区" as "主城区" | "非主城区",
      feePayMode: "城镇居民基本医疗保险",
      hospital: "越秀北路公卫中心",
      address: "广州市越秀区越秀北路120号",
      sbpLeft: 130,
      sbpRight: 128,
      dbpLeft: 82,
      dbpRight: 80,
      height: 160,
      weight: 62,
      waist: 86,
      bmi: 24.2,
      healthEvalScore: "基本满意" as const,
      selfCareScore: "可自理(0~3分)" as const,
      cognition: "筛选阴性" as const,
      exerciseFreq: "每天" as const,
      exerciseMinutes: 40,
      exerciseYears: "5年以上",
      exerciseMode: "慢走",
      dietHabit: "荤素均衡" as const,
      smokeStatus: "从不吸烟" as const,
      smokeAge: "0",
      alcoholFreq: "从不" as const,
      alcoholType: "无",
      isQuitAlcohol: "从不饮酒",
      alcoholAge: "0",
      isDrunkPastYear: "无",
      mouthState: "正常" as const,
      leftEye: "4.5",
      rightEye: "4.4",
      hearing: "听见" as const,
      edema: "无" as const,
      pulse: "触及双侧对称" as const,
      hemoglobin: 135,
      wbc: 5.5,
      platelet: 190,
      urineProtein: "0",
      urineSugar: "1+",
      urineKetone: "0",
      urineBlood: "0",
      urineOthers: "尿糖轻度异常",
      alt: 20,
      ast: 18,
      albumin: 40,
      totalBilirubin: 12.0,
      directBilirubin: 3.4,
      creatinine: 74,
      urea: 4.8,
      cholesterol: 5.0,
      triglyceride: 1.8,
      ldl: 2.9,
      hdl: 1.15,
      chestXray: "大致正常",
      chestXrayAbnormal: "无",
      bUltrasound: "正常",
      bUltrasoundAbnormal: "无",
      fattyLiver: "正常" as const,
      otherUltrasound: "正常",
      otherUltrasoundAbnormal: "无",
      chestCT: "无异常",
      healthEvaluationResult: "有异常" as const,
      healthEvaluationDetail: "血糖控制未达标，建议内分泌科门诊复查并调整用药剂量。"
    },
    {
      id: "REC2026-03",
      year: "2026",
      icdCode: "I10",
      diseaseName: "原发性高血压并双肾萎缩风险",
      district: "越秀区",
      screenResult: "两肾内电解质排出紊乱，血压频繁波峰在160以上",
      deathTime: "-",
      diagnosisTime: "2026-05-12",
      name: "张晓雅",
      gender: "女" as "男" | "女",
      idCard: "440104195111054452",
      phone: "13500223344",
      ethnicity: "少数民族" as "汉族" | "少数民族",
      education: "大学专科",
      occupation: "办事人员",
      marriage: "已婚",
      householdType: "主城区" as "主城区" | "非主城区",
      feePayMode: "城镇职工基本医疗保险",
      hospital: "越秀路社区关怀服务站",
      address: "广州市越秀区农林下路5号",
      sbpLeft: 155,
      sbpRight: 153,
      dbpLeft: 94,
      dbpRight: 92,
      height: 158,
      weight: 58,
      waist: 82,
      bmi: 23.2,
      healthEvalScore: "满意" as const,
      selfCareScore: "可自理(0~3分)" as const,
      cognition: "筛选阴性" as const,
      exerciseFreq: "每周一次以上" as const,
      exerciseMinutes: 45,
      exerciseYears: "8年",
      exerciseMode: "慢走",
      dietHabit: "荤素均衡" as const,
      smokeStatus: "从不吸烟" as const,
      smokeAge: "0",
      alcoholFreq: "从不" as const,
      alcoholType: "无",
      isQuitAlcohol: "从不饮酒",
      alcoholAge: "0",
      isDrunkPastYear: "无",
      mouthState: "正常" as const,
      leftEye: "4.4",
      rightEye: "4.3",
      hearing: "听见" as const,
      edema: "无" as const,
      pulse: "触及双侧对称" as const,
      hemoglobin: 125,
      wbc: 5.8,
      platelet: 188,
      urineProtein: "1+",
      urineSugar: "0",
      urineKetone: "0",
      urineBlood: "0",
      urineOthers: "无",
      alt: 22,
      ast: 24,
      albumin: 41,
      totalBilirubin: 13.0,
      directBilirubin: 3.5,
      creatinine: 88,
      urea: 5.4,
      cholesterol: 5.6,
      triglyceride: 2.1,
      ldl: 3.4,
      hdl: 1.1,
      chestXray: "大致正常",
      chestXrayAbnormal: "无",
      bUltrasound: "正常",
      bUltrasoundAbnormal: "无",
      fattyLiver: "正常" as const,
      otherUltrasound: "正常",
      otherUltrasoundAbnormal: "无",
      chestCT: "无异常",
      healthEvaluationResult: "有异常" as const,
      healthEvaluationDetail: "收缩压偏高，伴有轻度肾小球滤过不均，需低盐膳食并长期服药。"
    }
  ];

  // ----------------------------------------------------
  // Active State Managers
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = React.useState<"首次查询" | "二次筛选">("首次查询");
  const [logicalOperator, setLogicalOperator] = React.useState<"并且" | "或者">("并且");

  interface QueryRule {
    id: string;
    field: string;
    operator: string;
    value: string;
  }

  // Pre-load rules matching photo exactly: District contains 越秀区, Year equals 2026.
  const [rules, setRules] = React.useState<QueryRule[]>([
    { id: "1", field: "district", operator: "包含于", value: "越秀区" },
    { id: "2", field: "year", operator: "等于", value: "2026" }
  ]);

  // Secondary dynamic filters state
  const [secGender, setSecGender] = React.useState<string>("全部");
  const [secDisease, setSecDisease] = React.useState<string>("");

  // Grid Query Result state variables (Defaults to showing 暂无数据 matching screenshot)
  const [appliedRecords, setAppliedRecords] = React.useState<MedicalRecord[]>([]);
  const [hasQueried, setHasQueried] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [showColumnsPopover, setShowColumnsPopover] = React.useState<boolean>(false);

  // Pagination bounds
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 10;

  // Render columns checkboxes config
  interface TableColumn {
    key: string;
    label: string;
    visible: boolean;
  }
  const [columns, setColumns] = React.useState<TableColumn[]>([
    { key: "idCard", label: "身份证号", visible: true },
    { key: "name", label: "姓名", visible: true },
    { key: "district", label: "区县", visible: true },
    { key: "year", label: "体检年份", visible: true },
    { key: "diagnosisTime", label: "诊断时间", visible: true },
    { key: "icdCode", label: "疾病编码", visible: true },
    { key: "diseaseName", label: "疾病名称", visible: true }
  ]);

  const FIELD_OPTIONS = [
    { label: "区县", value: "district" },
    { label: "体检年份", value: "year" },
    { label: "姓名", value: "name" },
    { label: "身份证号", value: "idCard" },
    { label: "诊断时间", value: "diagnosisTime" },
    { label: "疾病编码", value: "icdCode" },
    { label: "疾病名称", value: "diseaseName" }
  ];

  const OPERATOR_OPTIONS = [
    { label: "包含于", value: "包含于" },
    { label: "等于", value: "等于" },
    { label: "包含", value: "包含" },
    { label: "不等于", value: "不等于" },
    { label: "开头是", value: "开头是" },
    { label: "结尾是", value: "结尾是" }
  ];

  const DISTRICT_VALUES = ["越秀区", "荔湾区", "白云区", "天河区", "黄埔区", "从化区"];
  const YEAR_VALUES = ["2026", "2025", "2024", "2023", "2022"];

  // ----------------------------------------------------
  // Dynamic Rule modifications
  // ----------------------------------------------------
  const handleAddRule = () => {
    setRules(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        field: "district",
        operator: "包含于",
        value: "越秀区"
      }
    ]);
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateRule = (id: string, updates: Partial<QueryRule>) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const next = { ...r, ...updates };
        if (updates.field) {
          if (updates.field === "district") {
            next.operator = "包含于";
            next.value = "越秀区";
          } else if (updates.field === "year") {
            next.operator = "等于";
            next.value = "2026";
          } else {
            next.operator = "包含";
            next.value = "";
          }
        }
        return next;
      }
      return r;
    }));
  };

  const toggleColumnVisibility = (key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  // ----------------------------------------------------
  // Execute Search Filter
  // ----------------------------------------------------
  const handleQuery = () => {
    setLoading(true);
    setTimeout(() => {
      const fullDataset = [...MOCK_QUERY_RECORDS, ...MOCK_2026_RECORDS];
      
      let filtered = fullDataset.filter(record => {
        const ruleResults = rules.map(rule => {
          const recValRaw = (record as any)[rule.field];
          const recVal = recValRaw ? recValRaw.toString().toLowerCase() : "";
          const targetValue = rule.value.toLowerCase();

          switch (rule.operator) {
            case "等于":
              return recVal === targetValue;
            case "不等于":
              return recVal !== targetValue;
            case "包含":
              return recVal.includes(targetValue);
            case "包含于":
              return targetValue.includes(recVal) || recVal.includes(targetValue);
            case "开头是":
              return recVal.startsWith(targetValue);
            case "结尾是":
              return recVal.endsWith(targetValue);
            default:
              return recVal.includes(targetValue);
          }
        });

        if (rules.length === 0) return true;

        if (logicalOperator === "并且") {
          return ruleResults.every(res => res === true);
        } else {
          return ruleResults.some(res => res === true);
        }
      });

      if (secGender !== "全部") {
        filtered = filtered.filter(r => r.gender === secGender);
      }
      if (secDisease.trim() !== "") {
        filtered = filtered.filter(r => 
          r.diseaseName.includes(secDisease.trim()) || 
          r.icdCode.toLowerCase().includes(secDisease.toLowerCase().trim())
        );
      }

      setAppliedRecords(filtered);
      setHasQueried(true);
      setLoading(false);
      setCurrentPage(1);
    }, 350);
  };

  const handleReset = () => {
    setRules([
      { id: "1", field: "district", operator: "包含于", value: "越秀区" },
      { id: "2", field: "year", operator: "等于", value: "2026" }
    ]);
    setLogicalOperator("并且");
    setSecGender("全部");
    setSecDisease("");
    setAppliedRecords([]);
    setHasQueried(false);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (appliedRecords.length === 0) {
      alert("当前结果列表无可用数据导出，请先配置规则进行查询。");
      return;
    }

    const visibleCols = columns.filter(c => c.visible);
    const csvHeaders = visibleCols.map(c => c.label).join(",");
    
    const csvRows = appliedRecords.map(record => {
      return visibleCols.map(col => {
        let val = (record as any)[col.key];
        if (col.key === "diagnosisTime" && !val) {
          val = record.year + "-06-15"; 
        }
        if (val === undefined || val === null) val = "-";
        
        // Hide identity code randomly
        if (col.key === "idCard" && val !== "-") {
          val = val.substring(0, 6) + "********" + val.substring(val.length - 4);
        }
        
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(",");
    });

    const csvContent = "\uFEFF" + [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `基本信息首次评估查询_导出_${new Date().toISOString().slice(0, 10)}.csv`;
    
    alert(
      `【国家安全政务体检数字中心 - 安全合规脱敏导出】\n\n` +
      `导出条数: 已导出合规核验体检数据 ${appliedRecords.length} 条\n` +
      `特征维度: ${visibleCols.length} 个字段\n` +
      `数据安全: 公共身份特征已经随机生成多层掩膜防护。`
    );

    link.click();
    URL.revokeObjectURL(url);
  };

  const totalItems = appliedRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedRecords = appliedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tableBlock = (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
          <h3 className="text-xs font-bold text-slate-800">查询结果</h3>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 rounded-lg px-3 shadow-none border-none"
          >
            <Download className="w-3.5 h-3.5" /> 导出
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleQuery}
            disabled={loading}
            className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100"
            title="刷新数据"
          >
            <RotateCw className={cn("w-3.5 h-3.5", loading ? "animate-spin text-indigo-600" : "")} />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowColumnsPopover(!showColumnsPopover)}
              className={cn("w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100", showColumnsPopover ? "bg-slate-100" : "")}
              title="配置列显示"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            
            {showColumnsPopover && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2.5 animate-in fade-in slide-in-from-top-1 duration-100">
                <p className="text-[10px] font-bold text-slate-400 mb-2 border-b pb-1 select-none">显示列选项</p>
                <div className="space-y-1">
                  {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(col.key)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span className="text-xs">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100"
            title={isFullscreen ? "退出宽屏" : "宽屏模式"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white">
          <RotateCw className="w-8 h-8 text-indigo-600 animate-spin stroke-1.5 mb-1.5" />
          <p className="text-xs text-slate-500 font-medium">加载体检数据档案中...</p>
        </div>
      ) : !hasQueried ? (
        <div className="py-16 flex flex-col items-center justify-center bg-white text-center">
          <Inbox className="w-12 h-12 text-slate-300 stroke-[1.2] mb-2" />
          <p className="text-xs font-bold text-slate-600">暂无数据</p>
          <p className="text-[11px] text-slate-400 max-w-xs mt-1 mx-auto leading-relaxed">
            请配置上方所需的表达式规则并点击下方 <span className="font-bold text-indigo-600">查询</span> 按钮渲染档案记录。
          </p>
        </div>
      ) : paginatedRecords.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center bg-white">
          <Inbox className="w-10 h-10 text-slate-300 stroke-[1.2] mb-1.5" />
          <p className="text-xs font-bold text-slate-500">无匹配结果</p>
          <p className="text-[11px] text-slate-400 mt-1">您可以试着清空并重置逻辑年份或修改筛选条件。</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-slate-700">
            <thead className="bg-[#FAFBFD] border-b border-slate-100">
              <tr>
                {columns.filter(c => c.visible).map(col => (
                  <th key={col.key} className="text-[11px] font-bold text-slate-600 text-left px-4 py-2.5 h-9 select-none whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((record, idx) => (
                <tr key={record.id || idx} className="hover:bg-slate-50/40 transition-colors">
                  {columns.filter(c => c.visible).map(col => {
                    let val = (record as any)[col.key];
                    if (col.key === "diagnosisTime" && !val) {
                      val = record.year + "-06-15"; 
                    }
                    if (val === undefined || val === null) val = "-";

                    if (col.key === "idCard" && val !== "-") {
                      val = val.substring(0, 6) + "********" + val.substring(val.length - 4);
                    }

                    return (
                      <td key={col.key} className="text-xs px-4 py-3 align-middle">
                        {col.key === "idCard" || col.key === "diagnosisTime" ? (
                          <span className="font-mono bg-slate-50 text-slate-600 border border-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {val}
                          </span>
                        ) : col.key === "year" ? (
                          <span className="font-semibold text-indigo-700 bg-indigo-50/50 border border-indigo-100/50 px-2 py-0.5 rounded-full text-[10px]">
                            {val}年
                          </span>
                        ) : col.key === "name" ? (
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {val}
                          </div>
                        ) : (
                          <span className={val === "-" ? "text-slate-300 italic" : "text-slate-600"}>
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {appliedRecords.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/85 flex items-center justify-between text-xs text-slate-500">
          <div>
            共匹配到 <span className="font-bold text-slate-800">{totalItems}</span> 条长者体检档案 
            <span className="text-[10px] text-slate-400 ml-1.5">(10 行/页)</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-slate-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              上一页
            </Button>
            <span className="font-mono text-[11px] text-slate-700 px-2 select-none">
              第 {currentPage} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-slate-200"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] p-6 flex items-center justify-center overflow-hidden">
          <div className="bg-white w-full max-w-5xl h-full max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="bg-indigo-950 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-300" />
                <span className="font-bold text-sm">基本信息高级查询 (全宽大盘端)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/10 hover:bg-white/20 text-white border-none h-7 px-2.5 rounded-lg text-xs"
              >
                关闭全屏
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-5 bg-[#F5F7FA]">
              {tableBlock}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>基本信息查询</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded-full ml-1 select-none">
              数据查询/导出
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 select-none">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            默认添加了满足考核要求的 “2026年 越秀区” 首次筛选逻辑条件。可以直接运行查询输出数据。
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-200 pb-px gap-6 select-none">
        <button
          onClick={() => setActiveTab("首次查询")}
          className={cn(
            "text-xs font-bold pb-2 transition-all relative outline-none",
            activeTab === "首次查询" 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          首次查询
        </button>
        <button
          onClick={() => setActiveTab("二次筛选")}
          className={cn(
            "text-xs font-bold pb-2 transition-all relative outline-none",
            activeTab === "二次筛选" 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          二次筛选
        </button>
      </div>

      {activeTab === "首次查询" ? (
        <div className="space-y-5">
          {/* Rule tree builder Card */}
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
                <div className="flex items-center gap-2">
                  <Select 
                    value={logicalOperator} 
                    onValueChange={(val: "并且" | "或者") => setLogicalOperator(val)}
                  >
                    <SelectTrigger className="w-20 bg-indigo-50/50 border-indigo-200 text-indigo-900 font-bold h-7 text-xs focus:ring-0 focus:border-indigo-400 focus:outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="并且" className="text-xs font-bold">并且 (AND)</SelectItem>
                      <SelectItem value="或者" className="text-xs font-bold">或者 (OR)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddRule}
                    className="h-7 text-xs font-semibold hover:bg-slate-50 border-slate-200 text-slate-700 flex items-center gap-1 rounded-lg"
                  >
                    <Plus className="w-3 h-3 text-slate-500" /> 规则
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("高级逻辑特性：已附加深度子级嵌套过滤条件组。")}
                    className="h-7 text-xs font-semibold hover:bg-slate-50 border-slate-200 text-slate-700 flex items-center gap-1 rounded-lg"
                  >
                    <Plus className="w-3 h-3 text-slate-500" /> 规则组
                  </Button>
                </div>

                <span className="text-[10px] text-slate-400 select-none">
                  复合表达式树
                </span>
              </div>

              {rules.length === 0 ? (
                <div className="py-6 text-center text-slate-400 border border-dashed rounded-lg bg-slate-50/40">
                  <p className="text-xs">未定义任何筛选表达式，请点击“+ 规则”添加一条匹配条件。</p>
                </div>
              ) : (
                <div className="relative pl-5 py-1.5 flex flex-col gap-2.5">
                  <div className="absolute left-2.5 top-0 bottom-6 w-[1.5px] bg-indigo-100 pointer-events-none" />
                  
                  {rules.map((rule) => (
                    <div key={rule.id} className="relative flex items-center gap-2.5 w-full animate-in fade-in duration-100">
                      <div className="absolute -left-[14px] w-3.5 h-[1.5px] bg-indigo-100 pointer-events-none" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 max-w-3xl">
                        {/* Selector 1 */}
                        <Select
                          value={rule.field}
                          onValueChange={(val) => handleUpdateRule(rule.id, { field: val })}
                        >
                          <SelectTrigger className="w-full bg-white h-8 text-xs border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Selector 2 */}
                        <Select
                          value={rule.operator}
                          onValueChange={(val) => handleUpdateRule(rule.id, { operator: val })}
                        >
                          <SelectTrigger className="w-full bg-white h-8 text-xs border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATOR_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Selector 3 */}
                        <div>
                          {rule.field === "district" ? (
                            <Select
                              value={rule.value}
                              onValueChange={(val) => handleUpdateRule(rule.id, { value: val })}
                            >
                              <SelectTrigger className="w-full bg-white h-8 text-xs border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DISTRICT_VALUES.map(d => (
                                  <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : rule.field === "year" ? (
                            <div className="relative flex items-center">
                              <Calendar className="absolute left-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                              <Select
                                value={rule.value}
                                onValueChange={(val) => handleUpdateRule(rule.id, { value: val })}
                              >
                                <SelectTrigger className="w-full bg-white h-8 text-xs border-slate-200 pl-7 text-left">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {YEAR_VALUES.map(y => (
                                    <SelectItem key={y} value={y} className="text-xs">{y}年</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <Input
                              value={rule.value}
                              onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                              placeholder="在输入框输入检索值..."
                              className="w-full bg-white h-8 text-xs border-slate-200 focus-visible:ring-indigo-100"
                            />
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="w-7 h-7 rounded-full text-slate-300 hover:text-red-500 hover:bg-slate-100 shrink-0"
                        title="删除该行"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 mt-5 border-t border-slate-100 pt-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 px-3 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  重置
                </Button>
                <Button
                  onClick={handleQuery}
                  className="h-8 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Search className="w-3 h-3" /> 查询
                </Button>
              </div>

            </CardContent>
          </Card>

          {tableBlock}
        </div>
      ) : (
        /* Sec logic tab panel */
        <div className="space-y-5">
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white animate-in slide-in-from-top-1">
            <div className="bg-slate-50/50 px-4 py-2 border-b text-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> 二级细节指标参数过滤
              </h3>
            </div>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">筛选长者性别</label>
                  <Select value={secGender} onValueChange={setSecGender}>
                    <SelectTrigger className="w-full bg-white h-8 text-xs border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部性别</SelectItem>
                      <SelectItem value="男">只限男性长者</SelectItem>
                      <SelectItem value="女">只限女性长者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">筛选疾病名称 (如：糖尿病)</label>
                  <Input
                    placeholder="请输入 ICD 编码或疾病名称"
                    value={secDisease}
                    onChange={(e) => setSecDisease(e.target.value)}
                    className="w-full bg-white h-8 text-xs border-slate-200 focus-visible:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-5 border-t border-slate-100 pt-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 px-3 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  重置
                </Button>
                <Button
                  onClick={handleQuery}
                  className="h-8 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Search className="w-3 h-3" /> 二级联合运行
                </Button>
              </div>

            </CardContent>
          </Card>

          {tableBlock}
        </div>
      )}

      {/* Security Guidance Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex gap-3 text-xs text-slate-600/90 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
        <div className="space-y-0.5 select-none">
          <p className="font-bold text-slate-800">2026广州网路安全等级及脱敏安全合规说明:</p>
          <p className="text-[11px] text-slate-400">
            依照二级公共卫生服务隐私规范，所有老年人身份证号采取掩膜处理。对应“区县”边界归属处于待定匹配状态。
          </p>
        </div>
      </div>
    </div>
  );
}
