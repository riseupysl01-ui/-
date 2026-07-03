import * as React from "react";
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Calendar as CalendarIcon,
  Search,
  History,
  FileText,
  User,
  Heart,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Sparkles,
  HelpCircle,
  Stethoscope,
  Activity,
  HeartPulse,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MOCK_TASKS } from "@/lib/mockData";
import { ImportTask } from "@/types";

interface ClinicalRecord {
  year: string;
  status: "normal" | "warning";
  
  // Cat 1 Basic
  institution: string;
  examDate: string;
  bpSummary: string;
  bmiSummary: string;
  
  // Cat 2 Physical Examination
  bloodPressure: { leftSystolic: number; leftDiastolic: number; rightSystolic: number; rightDiastolic: number };
  height: number;
  weight: number;
  waist: number;
  bmi: number;
  whtr: number; // 腰高比
  toothLoss: "normal" | "partial" | "severe";
  vision: { left: number; right: number };
  hearing: "normal" | "impaired";
  edema: "none" | "mild" | "severe";
  dorsalisPedis: "normal" | "attenuated" | "absent";

  // Cat 3 Lab tests
  blood: { wbc: string; rbc: string; hb: number };
  urine: { protein: string; sugar: string };
  bloodSugar: number;
  hba1c: string;
  ecg: "正常心电图" | "窦性心律不齐" | "房颤" | "ST-T段缺血性改变";
  liver: { alt: number; ast: number; sbil: string };
  renal: { scr: number; bun: string };
  bloodLipid: { tc: string; tg: string; hdl: string; ldl: string };
  chestXray: "正常" | "有陈旧性病灶" | "肺部异常";
  ultrasoundAbdomen: "肝胆胰脾未见明显异常" | "轻度脂肪肝" | "中度脂肪肝并胆囊结石";
  ultrasoundOthers: string;
  chestCt: "慢性支气管沿表现" | "正常";

  // Cat 4 Sickness control & list
  medications: string;
  outcomes: string[];
  icdCodes: string[];

  // Cat 5 Advice & Life Habits
  selfState: "优" | "良" | "一般" | "差";
  selfCareScore: number; // 0-20. 0-3 self, 4-8 mild, 9-18 mid, >=19 severe dependency
  exercise: "每周1-2次" | "每天常规" | "极少/不运动";
  diet: "荤素搭配" | "清淡" | "偏咸偏油腻";
  smoking: "不吸烟" | "已戒烟" | "吸烟 (10支/天)";
  drinking: "不饮酒" | "偶饮酒" | "经常饮酒";
  evaluation: string;
  anomalyDetail: string;
}

interface MockPersonProfile {
  idCard: string;
  name: string;
  gender: "male" | "female";
  age: number;
  county: string;
  town: string;
  site: string;
  isDeceased: boolean;
  deceasedStatus?: string;
  hasPlExams: boolean; // has physical exams at all
  chronicList: string[];
  years: { year: string; hasData: boolean; hasWarning: boolean }[];
  examsData: Record<string, ClinicalRecord>;
}

// Complete mock cohort profiles including physical exams and warning ranges
const COHORT_PROFILES: MockPersonProfile[] = [
  {
    idCard: "440103195001011234",
    name: "张大爷",
    gender: "male",
    age: 74,
    county: "荔湾区",
    town: "金花街道",
    site: "金花社区卫生中心",
    isDeceased: false,
    hasPlExams: true,
    chronicList: ["高血压", "糖尿病", "轻度脂肪肝"],
    years: [
      { year: "2024", hasData: true, hasWarning: true },
      { year: "2023", hasData: true, hasWarning: true },
      { year: "2022", hasData: true, hasWarning: false },
    ],
    examsData: {
      "2024": {
        year: "2024",
        status: "warning",
        institution: "金花社区卫生服务站及广州市一人民医院",
        examDate: "2024-04-12",
        bpSummary: "左侧: 145/95 mmHg (严重升高)",
        bmiSummary: "26.5 (偏胖), 腰高比 0.54 (超高风险)",
        bloodPressure: { leftSystolic: 145, leftDiastolic: 95, rightSystolic: 140, rightDiastolic: 92 },
        height: 1705 / 10,
        weight: 76.8,
        waist: 92,
        bmi: 26.5,
        whtr: 0.54,
        toothLoss: "partial",
        vision: { left: 4.5, right: 4.2 },
        hearing: "normal",
        edema: "none",
        dorsalisPedis: "attenuated",
        blood: { wbc: "6.2", rbc: "4.1", hb: 132 },
        urine: { protein: "-", sugar: "1+" },
        bloodSugar: 7.2,
        hba1c: "6.8%",
        ecg: "ST-T段缺血性改变",
        liver: { alt: 52, ast: 46, sbil: "11.2" },
        renal: { scr: 88, bun: "6.2" },
        bloodLipid: { tc: "5.82", tg: "2.10", hdl: "1.12", ldl: "3.45" },
        chestXray: "有陈旧性病灶",
        ultrasoundAbdomen: "轻度脂肪肝",
        ultrasoundOthers: "颈动脉硬化斑块形成",
        chestCt: "正常",
        medications: "硝苯地平控释片 30mg qd, 盐酸二甲双胍片 0.5g tid",
        outcomes: ["高血压病 (III期/极高危级)", "2型糖尿病", "脂肪肝异常变性"],
        icdCodes: ["I10", "E11", "K76.0"],
        selfState: "一般",
        selfCareScore: 3, // self care
        exercise: "每周1-2次",
        diet: "偏咸偏油腻",
        smoking: "不吸烟",
        drinking: "偶饮酒",
        evaluation: "高危多病共存状态下，血压舒张压偏高。BMI属于超重范围，伴内脏脂肪较厚、轻微颈动脉硬化。",
        anomalyDetail: "1.高血压未控制达标 2.空腹血糖偏高 3.轻度脂肪肝(超声) 4.心电图ST-T异常"
      },
      "2023": {
        year: "2023",
        status: "warning",
        institution: "金花社区卫生服务中心",
        examDate: "2023-04-10",
        bpSummary: "138/90 mmHg (临界高压)",
        bmiSummary: "26.2 (超重)",
        bloodPressure: { leftSystolic: 138, leftDiastolic: 90, rightSystolic: 135, rightDiastolic: 88 },
        height: 170,
        weight: 75.8,
        waist: 90,
        bmi: 26.2,
        whtr: 0.53,
        toothLoss: "normal",
        vision: { left: 4.6, right: 4.4 },
        hearing: "normal",
        edema: "none",
        dorsalisPedis: "normal",
        blood: { wbc: "5.8", rbc: "4.2", hb: 135 },
        urine: { protein: "-", sugar: "-" },
        bloodSugar: 6.8,
        hba1c: "6.5%",
        ecg: "窦性心律不齐",
        liver: { alt: 42, ast: 38, sbil: "10.5" },
        renal: { scr: 82, bun: "5.8" },
        bloodLipid: { tc: "5.45", tg: "1.85", hdl: "1.18", ldl: "3.20" },
        chestXray: "正常",
        ultrasoundAbdomen: "轻度脂肪肝",
        ultrasoundOthers: "无",
        chestCt: "正常",
        medications: "硝苯地平控释片 30mg qd",
        outcomes: ["高血压", "脂肪肝异常"],
        icdCodes: ["I10", "K76.0"],
        selfState: "良",
        selfCareScore: 2,
        exercise: "每周1-2次",
        diet: "荤素搭配",
        smoking: "不吸烟",
        drinking: "偶饮酒",
        evaluation: "高血压暴露可控范围，BMI超重，日常膳食结构基本合理，注意定期复核血脂血糖。",
        anomalyDetail: "1.合并轻微脂肪肝 2.窦性心律不齐 3.BMI偏重"
      },
      "2022": {
        year: "2022",
        status: "normal",
        institution: "金花社区卫生服务中心",
        examDate: "2022-04-11",
        bpSummary: "128/82 mmHg (正常)",
        bmiSummary: "24.2 (健康)",
        bloodPressure: { leftSystolic: 128, leftDiastolic: 82, rightSystolic: 125, rightDiastolic: 80 },
        height: 170,
        weight: 70.0,
        waist: 84,
        bmi: 24.2,
        whtr: 0.49,
        toothLoss: "normal",
        vision: { left: 4.8, right: 4.5 },
        hearing: "normal",
        edema: "none",
        dorsalisPedis: "normal",
        blood: { wbc: "5.5", rbc: "4.3", hb: 140 },
        urine: { protein: "-", sugar: "-" },
        bloodSugar: 5.8,
        hba1c: "5.8%",
        ecg: "正常心电图",
        liver: { alt: 35, ast: 32, sbil: "10.1" },
        renal: { scr: 78, bun: "5.5" },
        bloodLipid: { tc: "4.85", tg: "1.45", hdl: "1.32", ldl: "2.65" },
        chestXray: "正常",
        ultrasoundAbdomen: "轻度脂肪肝",
        ultrasoundOthers: "无",
        chestCt: "正常",
        medications: "无",
        outcomes: ["无特异慢病发作"],
        icdCodes: [],
        selfState: "优",
        selfCareScore: 0,
        exercise: "每天常规",
        diet: "清淡",
        smoking: "不吸烟",
        drinking: "不饮酒",
        evaluation: "老年健康状态评估优秀，各项生化及自理能力未见明显临床受损信号，建议适度开展户外体力活动。",
        anomalyDetail: "无"
      }
    }
  },
  {
    idCard: "440103194505205678",
    name: "李奶奶",
    gender: "female",
    age: 79,
    county: "越秀区",
    town: "北京街道",
    site: "北京街社区服务一站",
    isDeceased: true,
    deceasedStatus: "已宣告死亡其档案已归档结存 (自2024年3月)",
    hasPlExams: true,
    chronicList: ["高血压", "冠心病", "老年重度失能"],
    years: [
      { year: "2024", hasData: false, hasWarning: false }, // marked as Deceased/Archived
      { year: "2023", hasData: true, hasWarning: true }
    ],
    examsData: {
      "2023": {
        year: "2023",
        status: "warning",
        institution: "北京街卫生一站",
        examDate: "2023-08-15",
        bpSummary: "155/100 mmHg (重度偏高)",
        bmiSummary: "22.1 (体格适中), 重度自理能力减退 (失能)",
        bloodPressure: { leftSystolic: 155, leftDiastolic: 100, rightSystolic: 150, rightDiastolic: 95 },
        height: 155,
        weight: 53.0,
        waist: 82,
        bmi: 22.1,
        whtr: 0.52,
        toothLoss: "severe",
        vision: { left: 4.0, right: 3.8 },
        hearing: "impaired",
        edema: "mild",
        dorsalisPedis: "attenuated",
        blood: { wbc: "7.1", rbc: "3.5", hb: 105 }, // mild anemia
        urine: { protein: "1+", sugar: "-" },
        bloodSugar: 6.1,
        hba1c: "6.0%",
        ecg: "房颤",
        liver: { alt: 22, ast: 25, sbil: "9.2" },
        renal: { scr: 110, bun: "7.4" },
        bloodLipid: { tc: "5.10", tg: "1.60", hdl: "1.20", ldl: "3.10" },
        chestXray: "正常",
        ultrasoundAbdomen: "肝胆胰脾未见明显异常",
        ultrasoundOthers: "颈动脉重度斑块狭窄",
        chestCt: "慢性支气管沿表现",
        medications: "缬沙坦胶囊 80mg qd, 地高辛 0.125mg qd, 阿司匹林 100mg qd",
        outcomes: ["原发性高血压三期极高危", "冠状动脉粥样硬化性心脏病", "心房颤动", "轻度贫血"],
        icdCodes: ["I10", "I25.1", "I48", "D64.9"],
        selfState: "差",
        selfCareScore: 19, // Severe disability (失能) -> >=19
        exercise: "极少/不运动",
        diet: "清淡",
        smoking: "不吸烟",
        drinking: "不饮酒",
        evaluation: "长者生活完全无法自理，骨盆及髋突动作显著受阻，伴房颤及大循环高危合并。具有轻度失代偿性偏瘫或神经病变倾向，注意保暖防重度滑倒摔伤。",
        anomalyDetail: "1.舒张/收缩血压严重超出安全阈值 2.心电图心率极其不齐(房颤) 3.老年重度自理依赖（得分19分） 4.低血红蛋白反映贫血（105 g/L）"
      }
    }
  },
  {
    idCard: "440111195211118888",
    name: "王伯伯",
    gender: "male",
    age: 72,
    county: "白云区",
    town: "同和街道",
    site: "同和中心卫生院",
    isDeceased: false,
    hasPlExams: true,
    chronicList: ["慢阻肺(轻度)", "中心性肥胖"],
    years: [
      { year: "2024", hasData: false, hasWarning: false }, // hollow node, missing exam -> 失访
      { year: "2023", hasData: true, hasWarning: true }
    ],
    examsData: {
      "2023": {
        year: "2023",
        status: "warning",
        institution: "同和街道中心医院",
        examDate: "2023-11-20",
        bpSummary: "150/100 mmHg",
        bmiSummary: "28.2 (肥胖), 太空人肥胖 (中心性肥胖)",
        bloodPressure: { leftSystolic: 150, leftDiastolic: 100, rightSystolic: 145, rightDiastolic: 98 },
        height: 165,
        weight: 76.8,
        waist: 105,
        bmi: 28.2,
        whtr: 0.63, // WHtR = 105/165
        toothLoss: "normal",
        vision: { left: 4.7, right: 4.6 },
        hearing: "normal",
        edema: "none",
        dorsalisPedis: "normal",
        blood: { wbc: "8.5", rbc: "4.8", hb: 155 },
        urine: { protein: "-", sugar: "-" },
        bloodSugar: 8.5,
        hba1c: "7.1%",
        ecg: "正常心电图",
        liver: { alt: 48, ast: 42, sbil: "11.1" },
        renal: { scr: 80, bun: "6.0" },
        bloodLipid: { tc: "6.20", tg: "3.20", hdl: "1.05", ldl: "4.10" },
        chestXray: "肺部异常",
        ultrasoundAbdomen: "中度脂肪肝并胆囊结石",
        ultrasoundOthers: "无",
        chestCt: "慢性支气管沿表现",
        medications: "舒利迭吸入剂 bid, 地平/沙坦类抗压药",
        outcomes: ["慢性阻塞性肺疾病 (COPD)", "高血压病二期", "血脂异常", "偏重腹部内脏脂肪堆积"],
        icdCodes: ["J44", "I10", "E78.5"],
        selfState: "一般",
        selfCareScore: 2,
        exercise: "极少/不运动",
        diet: "偏咸偏油腻",
        smoking: "吸烟 (10支/天)",
        drinking: "经常饮酒",
        evaluation: "老年肺通气换气功能伴轻度慢病气阻(J44型)，腹部超声伴中重脂肪肝积存。因偏胖、常年烟酒，其脑和外周血管狭长，需严控食钠盐和酒精克数。",
        anomalyDetail: "1.血压舒张收缩过高 2.中腹部超高腰高比 0.63（中心肥胖） 3.空腹血脂高糖化超出安全区间 4.长期抽烟饮酒诱发肺部CT异常"
      }
    }
  }
];

export function ExamDataPage() {
  const [activeTab, setActiveTab] = React.useState<"viewer" | "import">("viewer");

  // Import sub-mode states
  const [tasks, setTasks] = React.useState<ImportTask[]>(MOCK_TASKS.filter(t => t.type === 'exam'));
  const [selectedYear, setSelectedYear] = React.useState<string>("2024");
  const [isUploading, setIsUploading] = React.useState(false);

  // Viewer sub-mode states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProfile, setSelectedProfile] = React.useState<MockPersonProfile | null>(COHORT_PROFILES[0]);
  const [currentExamYear, setCurrentExamYear] = React.useState<string>("2024");
  const [localLoading, setLocalLoading] = React.useState(false);
  const [collapsedCats, setCollapsedCats] = React.useState<Record<string, boolean>>({
    cat1: false, // basic: expanded by default
    cat2: true,
    cat3: true,
    cat4: true,
    cat5: true
  });

  const handleSearchProfile = () => {
    if (!searchQuery.trim()) {
      alert("请先输入长者姓名或身份证编号");
      return;
    }

    const q = searchQuery.trim();
    const found = COHORT_PROFILES.find(p => p.name.includes(q) || p.idCard.includes(q));
    if (found) {
      setSelectedProfile(found);
      const activeYears = found.years.filter(y => y.hasData);
      if (activeYears.length > 0) {
        setCurrentExamYear(activeYears[0].year);
      } else {
        setCurrentExamYear("");
      }
    } else {
      setSelectedProfile(null); // Triggers "查无此人，请先建档或导入档案。"
    }
  };

  const selectPreloadProfile = (p: MockPersonProfile | null) => {
    setLocalLoading(true);
    setSelectedProfile(p);
    if (p) {
      setSearchQuery(p.idCard);
      const activeYears = p.years.filter(y => y.hasData);
      if (activeYears.length > 0) {
        setCurrentExamYear(activeYears[0].year);
      } else {
        setCurrentExamYear("");
      }
    } else {
      setSearchQuery("440106199999999999");
    }
    setTimeout(() => {
      setLocalLoading(false);
    }, 450);
  };

  const handleTimelineYearChange = (year: string) => {
    setLocalLoading(true);
    setCurrentExamYear(year);
    setTimeout(() => {
      setLocalLoading(false);
    }, 400);
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCats(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Upload Simulation
  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newTask: ImportTask = {
        id: Math.random().toString(36).substr(2, 9),
        filename: `${selectedYear}年度体检直报库导入.xlsx`,
        type: 'exam',
        status: 'reading',
        progress: 0,
        createdAt: new Date().toLocaleString(),
        year: selectedYear,
        batchId: `BATCH-${selectedYear}-${Math.floor(Math.random() * 900 + 100)}`,
        operator: '管理员'
      };
      setTasks([newTask, ...tasks]);
      setIsUploading(false);
      alert("上传文件成功，正在通过前置警告/格式纠正比对框架校验库！");
    }, 1200);
  };

  const getImportTaskStatusBadge = (status: ImportTask['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">入库成功 (校验全通)</Badge>;
      case 'validating':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">逻辑复比对中</Badge>;
      case 'reading':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none animate-pulse">文件校验中</Badge>;
      case 'failed':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">校验不合规阻断</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* View Switcher Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">老年人体检数据库管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            四期临床增强模块：支持对各区社区核发大体检数据进行查摆、导入，并可按长者证件调阅全时期电子档案。
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-lg border shrink-0">
          <button 
            onClick={() => setActiveTab("viewer")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeTab === "viewer" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            <FileText className="w-4 h-4" /> 电子健康档案调阅
          </button>
          <button 
            onClick={() => setActiveTab("import")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeTab === "import" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            <Upload className="w-4 h-4" /> 体检数据比对导入
          </button>
        </div>
      </div>

      {activeTab === "viewer" ? (
        /* ARCHIVE VIEWER MODE */
        <div className="space-y-6">
          
          {/* Quick Select Panel & Search */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-4 pb-2 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-blue-600" />
                  <span>在册老年体检档案穿透调阅</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="text-gray-400 self-center">快速调阅样本:</span>
                  <button 
                    onClick={() => selectPreloadProfile(COHORT_PROFILES[0])}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    张大爷 (高危多病)
                  </button>
                  <button 
                    onClick={() => selectPreloadProfile(COHORT_PROFILES[1])}
                    className="bg-slate-100 text-slate-700 px-2 py-1 rounded hover:bg-slate-200"
                  >
                    李奶奶 (已死亡结案)
                  </button>
                  <button 
                    onClick={() => selectPreloadProfile(COHORT_PROFILES[2])}
                    className="bg-amber-50 text-amber-700 px-2 py-1 rounded hover:bg-amber-100"
                  >
                    王伯伯 (2024未检失访)
                  </button>
                  <button 
                    onClick={() => selectPreloadProfile(null)}
                    className="bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                  >
                    虚拟未建档人员
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="搜索身份证号或长者大名（例：试输入 '张大爷' 或 '440111195211118888' ）" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-6 font-semibold" onClick={handleSearchProfile}>
                检索电子健档档案
              </Button>
            </CardContent>
          </Card>

          {selectedProfile ? (
            /* DETAILED VIEWER CONTAINER */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
              
              {/* Local Loader */}
              {localLoading && (
                <div className="absolute inset-0 bg-white/75 z-20 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-1.5">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-xs text-gray-500 font-semibold font-mono">加载年度临床细分数据...</span>
                  </div>
                </div>
              )}

              {/* Patient Basic card + Time轴 */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile card */}
                <Card className="border-none shadow-sm relative overflow-hidden">
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                        {selectedProfile.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          {selectedProfile.name}
                          <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${selectedProfile.gender === "male" ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                            {selectedProfile.gender === "male" ? "男" : "女"}
                          </Badge>
                        </h3>
                        <p className="text-xs text-gray-400 font-medium font-mono">{selectedProfile.idCard}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 text-xs space-y-2 text-slate-600">
                      <div><span className="text-gray-400">目前年龄:</span> <span className="font-mono text-gray-900 font-semibold">{selectedProfile.age}岁</span></div>
                      <div><span className="text-gray-400">所属辖区:</span> <span className="text-gray-900 font-semibold">{selectedProfile.county} / {selectedProfile.town}</span></div>
                      <div><span className="text-gray-400">主要伴发慢病:</span> <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProfile.chronicList.map((c, cx) => (
                          <Badge key={cx} variant="secondary" className="text-[10px] bg-slate-100 hover:bg-slate-100 text-slate-600 font-normal py-0">{c}</Badge>
                        ))}
                      </div></div>
                    </div>

                    {selectedProfile.isDeceased && (
                      <div className="p-2.5 rounded bg-rose-50 border border-rose-100/50 text-rose-700 text-[10px] leading-relaxed flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        <div>
                          <p className="font-bold">生存结局终点已发生</p>
                          <p className="text-[9px] text-rose-600/80">{selectedProfile.deceasedStatus}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Years Timeline Card */}
                <Card className="border-none shadow-sm pb-5">
                  <CardHeader className="py-4 border-b">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      体检时间轴 & 跨年度核销节点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="relative border-l-2 border-gray-100 pl-5 space-y-6">
                      
                      {selectedProfile.years.map((y, yi) => {
                        const isCurrentActive = currentExamYear === y.year;
                        
                        return (
                          <div key={y.year} className="relative">
                            
                            {/* Node indicators icons */}
                            {y.hasData ? (
                              y.hasWarning ? (
                                <button 
                                  onClick={() => handleTimelineYearChange(y.year)}
                                  className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border bg-yellow-500 text-white shadow-sm ring-4 ring-yellow-100 cursor-pointer`}
                                  title="体检含有指标超出标准值(见警告黄框颜色)"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleTimelineYearChange(y.year)}
                                  className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border bg-green-600 text-white shadow-sm ring-4 ring-green-100 cursor-pointer`}
                                  title="本年度体检结果健康全项达标"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                </button>
                              )
                            ) : (
                              /* Empty node missing / deceased status logic */
                              selectedProfile.isDeceased && yi === 0 ? (
                                <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border bg-rose-700 text-white shadow-sm ring-4 ring-rose-100">
                                  <AlertTriangle className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border bg-slate-200 border-dashed text-slate-400">
                                  <Clock className="w-2.5 h-2.5" />
                                </div>
                              )
                            )}

                            {/* Node label Details */}
                            <div className="space-y-0.5 pl-2">
                              <button 
                                onClick={() => y.hasData && handleTimelineYearChange(y.year)}
                                className={`text-sm font-bold block ${isCurrentActive ? 'text-blue-600 underline font-extrabold' : y.hasData ? 'text-gray-900 hover:text-blue-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                              >
                                {y.year} 年度体检
                              </button>
                              {y.hasData ? (
                                <div className="text-[10px] text-gray-400">
                                  {y.hasWarning ? "异常超标警告" : "无异常病征"}
                                </div>
                              ) : (
                                selectedProfile.isDeceased && yi === 0 ? (
                                  <Badge className="bg-red-50 text-red-700 border-none hover:bg-red-50 text-[8px] py-0">已死亡（已归档）</Badge>
                                ) : (
                                  <Badge className="bg-slate-100 text-slate-400 border-none hover:bg-slate-100 text-[8px] py-0">未体检（判定失访）</Badge>
                                )
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right components: Collapsible categories displaying physical check detail */}
              <div className="lg:col-span-3 space-y-4">
                
                {currentExamYear && selectedProfile.examsData[currentExamYear] ? (
                  /* RENDER DETAILED EXAMS LISTED IN 5 SUB-CATEGORIES */
                  (() => {
                    const exam = selectedProfile.examsData[currentExamYear];

                    // Standard Warning Evaluator
                    const warningEvaluator = (label: string, value: any, ruleText: string, isTriggered: boolean) => {
                      if (isTriggered) {
                        return (
                          <div className="bg-yellow-50/70 border border-yellow-200/50 rounded-lg p-3 text-xs relative overflow-hidden group">
                            <span className="absolute top-1 right-2 inline-block bg-yellow-500 text-white text-[8px] px-1.5 rounded animate-pulse font-mono">
                              WARNING
                            </span>
                            <div className="font-semibold text-gray-500">{label}</div>
                            <div className="text-gray-900 font-bold mt-1 text-sm text-yellow-800">{value}</div>
                            <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>指标警戒区间: {ruleText}</span>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 text-xs">
                          <div className="font-semibold text-gray-400">{label}</div>
                          <div className="text-gray-800 font-semibold mt-1 text-sm">{value}</div>
                        </div>
                      );
                    };

                    return (
                      <div className="space-y-4">
                        
                        {/* Tab header badge */}
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-100 p-3 rounded-lg border">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            正在浏览：{currentExamYear} 年度体检电子副本存档
                          </span>
                          <span>最后核发签字网点: {exam.institution}</span>
                        </div>

                        {/* CAT 1: 老年人体检基本情况 */}
                        <div className="border bg-white rounded-xl shadow-sm overflow-hidden">
                          <button 
                            onClick={() => toggleCategory("cat1")}
                            className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 bg-slate-50 border-b cursor-pointer hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-2 text-blue-700">
                              <Stethoscope className="w-4 h-4 text-blue-600" />
                              一、老年人体检基本情况
                            </span>
                            {collapsedCats.cat1 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                          </button>
                          
                          {!collapsedCats.cat1 && (
                            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="p-3 bg-slate-50/50 rounded-lg text-xs">
                                <span className="text-gray-400">体检机构</span>
                                <p className="text-gray-800 font-semibold mt-0.5 truncate text-[11px]">{exam.institution}</p>
                              </div>
                              <div className="p-3 bg-slate-50/50 rounded-lg text-xs">
                                <span className="text-gray-400">体检签字时间</span>
                                <p className="text-gray-800 font-semibold font-mono mt-0.5">{exam.examDate}</p>
                              </div>
                              <div className="p-3 bg-slate-50/50 rounded-lg text-xs md:col-span-2">
                                <span className="text-gray-400">体检重要摘要及初筛</span>
                                <p className="text-indigo-600 font-bold text-xs mt-0.5">{exam.bpSummary} / {exam.bmiSummary}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CAT 2: 老年体格检查信息 */}
                        <div className="border bg-white rounded-xl shadow-sm overflow-hidden">
                          <button 
                            onClick={() => toggleCategory("cat2")}
                            className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 bg-slate-50 border-b cursor-pointer hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-2 text-rose-700">
                              <Activity className="w-4 h-4 text-rose-500" />
                              二、老年体格检查信息 (Physical Exams)
                            </span>
                            {collapsedCats.cat2 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                          </button>

                          {!collapsedCats.cat2 && (
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                {warningEvaluator("左侧收缩/舒张压", `${exam.bloodPressure.leftSystolic}/${exam.bloodPressure.leftDiastolic} mmHg`, "收缩压≥140 或 舒张压≥90", exam.bloodPressure.leftSystolic >= 140 || exam.bloodPressure.leftDiastolic >= 90)}
                                {warningEvaluator("右侧收缩/舒张压", `${exam.bloodPressure.rightSystolic}/${exam.bloodPressure.rightDiastolic} mmHg`, "收缩压≥140 或 舒张压≥90", exam.bloodPressure.rightSystolic >= 140 || exam.bloodPressure.rightDiastolic >= 90)}
                                {warningEvaluator("身体质量指数 (BMI)", `${exam.bmi} kg/㎡`, "BMI ≥ 24 超重，BMI ≥ 28 肥胖", exam.bmi >= 24)}
                                {warningEvaluator("腰高比 (WHtR)", exam.whtr.toFixed(2), "腰高比比值 > 0.50 (即高风险脂肪贮积)", exam.whtr > 0.50)}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs leading-normal bg-slate-50/20 p-3.5 rounded-lg border border-dashed">
                                <div><span className="text-gray-400">身高 / 体重 / 腰围:</span> <p className="text-gray-800 font-bold mt-1 font-mono">{exam.height}cm / {exam.weight}kg / {exam.waist}cm</p></div>
                                <div><span className="text-gray-400">齿裂情况:</span> <p className="text-gray-800 font-bold mt-1">{exam.toothLoss === "normal" ? "无缺损" : exam.toothLoss === "partial" ? "部分脱落" : "重度牙缺失"}</p></div>
                                <div><span className="text-gray-400">左/右眼裸眼视力:</span> <p className="text-gray-800 font-bold mt-1 font-mono">{exam.vision.left} / {exam.vision.right}</p></div>
                                <div><span className="text-gray-400">双耳听力:</span> <p className="text-gray-800 font-bold mt-1">{exam.hearing === "normal" ? "听力优良" : "轻度/重度受损"}</p></div>
                                <div className="mt-2"><span className="text-gray-400">下肢水肿:</span> <p className="text-gray-800 font-semibold mt-1">{exam.edema === "none" ? "无水肿" : "轻微足部凹陷水肿"}</p></div>
                                <div className="mt-2"><span className="text-gray-400">双足背动脉搏动:</span> <p className="text-gray-800 font-semibold mt-1">{exam.dorsalisPedis === "normal" ? "搏动双侧对称" : "搏动减缓或消失"}</p></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CAT 3: 老年人辅助检查情况 */}
                        <div className="border bg-white rounded-xl shadow-sm overflow-hidden">
                          <button 
                            onClick={() => toggleCategory("cat3")}
                            className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 bg-slate-50 border-b cursor-pointer hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-2 text-indigo-700">
                              <FlaskConical className="w-4 h-4 text-indigo-500" />
                              三、老年人体检生化辅助检查情况 (Labs)
                            </span>
                            {collapsedCats.cat3 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                          </button>

                          {!collapsedCats.cat3 && (
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                {warningEvaluator("空腹血糖 (FPG)", `${exam.bloodSugar} mmol/L`, "血糖 ≥ 6.1 mmol/L", exam.bloodSugar >= 6.1)}
                                {warningEvaluator("糖化血红蛋白 (HbA1c)", exam.hba1c, "糖化比率 ≥ 6.0%", parseFloat(exam.hba1c) >= 6.0)}
                                {warningEvaluator("心电图 (ECG)", exam.ecg, "窦性不齐、ST位改变或房颤", exam.ecg !== "正常心电图")}
                                {warningEvaluator("谷丙转氨酶 (ALT)", `${exam.liver.alt} U/L`, "转氨酶 ＞ 40 U/L", exam.liver.alt > 40)}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-100/30 p-3.5 rounded-lg border">
                                <div><span className="text-slate-400">血常规 WBC / Hb:</span> <p className="text-slate-800 font-bold mt-1 font-mono">{exam.blood.wbc} ×10⁹/L / Hb {exam.blood.hb} g/L</p></div>
                                <div><span className="text-slate-400">尿常规 尿蛋白/尿糖:</span> <p className="text-slate-800 font-bold mt-1 font-mono">PRO {exam.urine.protein} / GLU {exam.urine.sugar}</p></div>
                                <div><span className="text-slate-400">腹B超影像:</span> <p className="text-purple-600 font-bold mt-1">{exam.ultrasoundAbdomen}</p></div>
                                <div><span className="text-slate-400">胸部 X 线:</span> <p className="text-slate-800 font-semibold mt-1">{exam.chestXray}</p></div>
                                <div className="mt-2"><span className="text-slate-400">肾功能 Scr / 尿素氮:</span> <p className="text-slate-800 font-bold font-mono mt-1">{exam.renal.scr} μmol/L / BUN {exam.renal.bun}</p></div>
                                <div className="mt-2 col-span-3"><span className="text-slate-400">血分项 TC / TG / HDL / LDL:</span> <p className="text-indigo-700 font-mono font-bold mt-1">TC:{exam.bloodLipid.tc} | TG:{exam.bloodLipid.tg} | HDL:{exam.bloodLipid.hdl} | LDL:{exam.bloodLipid.ldl} mmol/L</p></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CAT 4: 健康问题与治疗情况 */}
                        <div className="border bg-white rounded-xl shadow-sm overflow-hidden">
                          <button 
                            onClick={() => toggleCategory("cat4")}
                            className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 bg-slate-50 border-b cursor-pointer hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-2 text-purple-700">
                              <HeartPulse className="w-4 h-4 text-purple-600" />
                              四、健康问题与药物治疗控制情况 (ICD-10)
                            </span>
                            {collapsedCats.cat4 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                          </button>

                          {!collapsedCats.cat4 && (
                            <div className="p-4 space-y-3.5 text-xs">
                              <div className="p-3 bg-violet-50/30 rounded-lg">
                                <span className="text-slate-400 font-semibold block uppercase">主长口服治疗用药清单:</span>
                                <p className="text-slate-800 font-bold mt-1 font-mono text-[11px]">{exam.medications}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <span className="text-slate-400 block font-semibold">随访结局临床慢病归巢:</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {exam.outcomes.map((out, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-100 font-semibold">{out}</Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <span className="text-slate-400 block font-semibold">国标对应 ICD-10 编码:</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5 font-mono">
                                    {exam.icdCodes.map((icd, idx) => (
                                      <Badge key={idx} className="bg-slate-800 text-white border-none">{icd}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CAT 5: 健康评价和健康指导 */}
                        <div className="border bg-white rounded-xl shadow-sm overflow-hidden">
                          <button 
                            onClick={() => toggleCategory("cat5")}
                            className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 bg-slate-50 border-b cursor-pointer hover:bg-slate-100/50"
                          >
                            <span className="flex items-center gap-2 text-teal-700">
                              <Heart className="w-4 h-4 text-teal-500" />
                              五、健康评估与生活指导随访 (Behavior)
                            </span>
                            {collapsedCats.cat5 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                          </button>

                          {!collapsedCats.cat5 && (
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                {warningEvaluator("自评健康分级", exam.selfState, "自评越差反映心血管预后越差", exam.selfState === "差")}
                                {warningEvaluator("自理评分 (ADL)", `${exam.selfCareScore} 分`, "得分≥19分判定重度失能（依赖他人）", exam.selfCareScore >= 19)}
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs">
                                  <div className="font-semibold text-gray-400">体育锻炼频数</div>
                                  <div className="text-gray-800 font-bold mt-1 text-[11px]">{exam.exercise}</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs">
                                  <div className="font-semibold text-gray-400">膳食习惯偏好</div>
                                  <div className="text-gray-800 font-bold mt-1 text-[11px]">{exam.diet}</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 text-xs border bg-slate-50/50 p-3.5 rounded-lg">
                                <div><span className="text-slate-400 block font-semibold">吸烟暴露:</span> <span className="font-bold text-slate-800 mt-1 block">{exam.smoking}</span></div>
                                <div><span className="text-slate-400 block font-semibold">饮酒习惯:</span> <span className="font-bold text-slate-800 mt-1 block">{exam.drinking}</span></div>
                                <div><span className="text-slate-400 block font-semibold">锻炼模式:</span> <span className="font-bold text-slate-800 mt-1 block">{exam.exercise}</span></div>
                              </div>

                              <div className="p-4 bg-slate-800 text-white rounded-lg text-xs space-y-2">
                                <div>
                                  <span className="text-slate-400 block font-semibold">医生临床评估词:</span>
                                  <p className="mt-1 font-semibold leading-relaxed text-indigo-200">{exam.evaluation}</p>
                                </div>
                                <div className="border-t border-white/10 pt-2">
                                  <span className="text-slate-400 block font-semibold">健康异常明细提示:</span>
                                  <p className="mt-1 text-rose-300 font-mono font-bold">{exam.anomalyDetail}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })()
                ) : (
                  <div className="border-2 border-dashed rounded-xl h-96 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <AlertTriangle className="w-12 h-12 mb-3 text-amber-500 animate-pulse" />
                    <h3 className="font-bold text-gray-800">暂无当年度体检记录</h3>
                    <p className="text-xs text-gray-400 max-w-sm mt-1">
                      此位长者当前选年份未提取到社区卫健委体检上报。您可以直接切换时间轴末端年份调阅历史档案。
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* EXCEPTION: NO SUCH PATIENT */
            <Card className="border-none shadow-sm p-16 text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
              <h2 className="text-lg font-bold text-gray-900 mb-1">查无此人，请先建档或导入档案</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed mt-2">
                系统未在 12 区县老年队列直报网络中检索到对应的身份证哈希。请前往左侧【老年人建档】菜单导入常住老龄大暴露表后再予调阅。
              </p>
              <Button variant="outline" className="mt-5 h-9" onClick={() => selectPreloadProfile(COHORT_PROFILES[0])}>
                返回首个示例人员
              </Button>
            </Card>
          )}

        </div>
      ) : (
        /* TRADITIONAL IMPORT TASK SHEETS MODE */
        <div className="space-y-6">
          
          {/* Quick Stats of upload caveats and errors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card className="border-none shadow-sm relative overflow-hidden">
              <CardHeader className="bg-red-50/50 border-b pb-3">
                <CardTitle className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>格式极严格校验阻断范围 (Error Region) —— 不落库</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs text-slate-600 leading-relaxed space-y-1">
                <p>下列任一字段存在逻辑越阈将<b>全行阻断、打回</b>并不予落库入表：</p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-gray-500">
                  <li>身份证号未填写或包含非法乱码，或者查无此人。</li>
                  <li>体检时间格式非 YYYY-MM-DD 或缺失。</li>
                  <li>体检机构名称空缺。</li>
                  <li>同一天同一人多次提报，则<b>仅保留最新一次落库档案</b>，前部自动废除作次主。</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-amber-50/50 border-b pb-3">
                <CardTitle className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>数值警告超标标记范围 (Caveat Region) —— 标黄入库</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs text-slate-600 leading-relaxed space-y-1">
                <p>数值轻微超标，<b>系统自动警告并入库</b>，但在各穿透终端予以黄色背景醒目提示：</p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-gray-500">
                  <li>收缩血压 ≥ 140 mmHg 或 舒张血压 ≥ 90 mmHg (高血压临界)。</li>
                  <li>腰围与身高比 WHtR 极大偏大 （WHtR ＞ 0.50）。</li>
                  <li>生活自理评分 (ADL) ≥ 19分（提示重度依靠他人护理，重度偏瘫失能）。</li>
                </ul>
              </CardContent>
            </Card>

          </div>

          {/* Quick upload control card */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-semibold">上传年度体检标准大表 Excel</CardTitle>
                  <CardDescription className="text-xs">
                    请选择您正在上报的体检核销年份，拖拽对应格式化的物理体查、 labs 生化总表。
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded border">
                    <span className="text-gray-400 font-medium pl-1">统计所属年份:</span>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[80px] bg-white border-gray-100 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024年</SelectItem>
                        <SelectItem value="2023">2023年</SelectItem>
                        <SelectItem value="2022">2022年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 h-9 shrink-0 gap-1.5 text-xs font-semibold" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    拖拽/上传大Excel表
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <Table>
                <TableHeader className="bg-slate-50/50 text-xs">
                  <TableRow>
                    <TableHead>上传文件名</TableHead>
                    <TableHead>运行状态</TableHead>
                    <TableHead>体检年期</TableHead>
                    <TableHead>内置调度批号</TableHead>
                    <TableHead>上报责任人</TableHead>
                    <TableHead>记录导入完成时间</TableHead>
                    <TableHead className="text-right">质量分析日志</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/20 text-xs text-slate-600">
                      <TableCell className="font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5 truncate max-w-sm">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                          <span>{task.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getImportTaskStatusBadge(task.status)}</TableCell>
                      <TableCell className="font-mono">{task.year}年</TableCell>
                      <TableCell className="font-mono text-slate-500 font-medium">{task.batchId || "TRANS-BATCH"}</TableCell>
                      <TableCell>{task.operator}</TableCell>
                      <TableCell className="text-gray-400 text-[10px]">{task.createdAt}</TableCell>
                      <TableCell className="text-right">
                        {task.status === "completed" ? (
                          <div className="text-[10px] text-green-700 font-semibold">
                            ✓ 校验无爆错落库完成
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">直报端读中...</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      )}

    </div>
  );
}
