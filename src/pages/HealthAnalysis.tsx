
import * as React from "react";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Filter, 
  Download, 
  BarChart3, 
  Users, 
  Activity,
  Heart,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MOCK_TREND_DATA } from "@/lib/mockData";

// Highly polished, robust trend series for basic health indicators aligning with previous simple card values
const MOCK_GENERAL_TRENDS: Record<string, { year: string; [key: string]: any }[]> = {
  "平均年龄": [
    { year: '2019', '荔湾区': 71.1, '越秀区': 71.5, '海珠区': 71.2, '天河区': 70.8, '白云区': 70.5, '全市平均': 71.0 },
    { year: '2020', '荔湾区': 71.4, '越秀区': 71.9, '海珠区': 71.5, '天河区': 71.1, '白云区': 70.8, '全市平均': 71.3 },
    { year: '2021', '荔湾区': 71.8, '越秀区': 72.3, '海珠区': 71.9, '天河区': 71.4, '白云区': 71.2, '全市平均': 71.7 },
    { year: '2022', '荔湾区': 72.2, '越秀区': 72.7, '海珠区': 72.2, '天河区': 71.7, '白云区': 71.5, '全市平均': 72.1 },
    { year: '2023', '荔湾区': 72.5, '越秀区': 73.1, '海珠区': 72.6, '天河区': 72.1, '白云区': 71.8, '全市平均': 72.4 }
  ],
  "吸烟率": [
    { year: '2019', '荔湾区': 20.1, '越秀区': 19.8, '海珠区': 20.5, '天河区': 18.2, '白云区': 21.4, '全市平均': 20.0 },
    { year: '2020', '荔湾区': 19.8, '越秀区': 19.4, '海珠区': 20.1, '天河区': 17.8, '白云区': 20.9, '全市平均': 19.6 },
    { year: '2021', '荔湾区': 19.4, '越秀区': 19.0, '海珠区': 19.7, '天河区': 17.3, '白云区': 20.3, '全市平均': 19.1 },
    { year: '2022', '荔湾区': 19.0, '越秀区': 18.6, '海珠区': 19.2, '天河区': 16.9, '白云区': 19.8, '全市平均': 18.7 },
    { year: '2023', '荔湾区': 18.5, '越秀区': 18.1, '海珠区': 18.7, '天河区': 16.4, '白云区': 19.4, '全市平均': 18.5 }
  ],
  "饮酒率": [
    { year: '2019', '荔湾区': 13.5, '越秀区': 12.8, '海珠区': 13.1, '天河区': 11.9, '白云区': 14.5, '全市平均': 13.2 },
    { year: '2020', '荔湾区': 13.2, '越秀区': 12.5, '海珠区': 12.8, '天河区': 11.6, '白云区': 14.1, '全市平均': 12.8 },
    { year: '2021', '荔湾区': 12.9, '越秀区': 12.1, '海珠区': 12.4, '天河区': 11.2, '白云区': 13.7, '全市平均': 12.5 },
    { year: '2022', '荔湾区': 12.6, '越秀区': 11.8, '海珠区': 12.1, '天河区': 10.9, '白云区': 13.3, '全市平均': 12.1 },
    { year: '2023', '荔湾区': 12.2, '越秀区': 11.5, '海珠区': 11.8, '天河区': 10.5, '白云区': 12.9, '全市平均': 12.2 }
  ],
  "超重率": [
    { year: '2019', '荔湾区': 30.2, '越秀区': 29.8, '海珠区': 30.5, '天河区': 31.2, '白云区': 31.8, '全市平均': 30.7 },
    { year: '2020', '荔湾区': 30.8, '越秀区': 30.4, '海珠区': 31.1, '天河区': 31.9, '白云区': 32.4, '全市平均': 31.3 },
    { year: '2021', '荔湾区': 31.4, '越秀区': 31.0, '海珠区': 31.7, '天河区': 32.5, '白云区': 33.1, '全市平均': 31.9 },
    { year: '2022', '荔湾区': 32.0, '越秀区': 31.6, '海珠区': 32.3, '天河区': 33.2, '白云区': 33.8, '全市平均': 32.6 },
    { year: '2023', '荔湾区': 32.4, '越秀区': 32.1, '海珠区': 32.9, '天河区': 33.8, '白云区': 34.5, '全市平均': 32.4 }
  ],
  "肥胖率": [
    { year: '2019', '荔湾区': 14.2, '越秀区': 13.8, '海珠区': 14.5, '天河区': 15.1, '白云区': 15.6, '全市平均': 14.6 },
    { year: '2020', '荔湾区': 14.6, '越秀区': 14.1, '海珠区': 14.8, '天河区': 15.5, '白云区': 16.1, '全市平均': 15.0 },
    { year: '2021', '荔湾区': 15.0, '越秀区': 14.5, '海珠区': 15.2, '天河区': 15.9, '白云区': 16.5, '全市平均': 15.4 },
    { year: '2022', '荔湾区': 15.4, '越秀区': 14.9, '海珠区': 15.6, '天河区': 16.3, '白云区': 17.0, '全市平均': 15.8 },
    { year: '2023', '荔湾区': 15.8, '越秀区': 15.2, '海珠区': 16.0, '天河区': 16.7, '白云区': 17.5, '全市平均': 15.8 }
  ],
  "低体重率": [
    { year: '2019', '荔湾区': 5.1, '越秀区': 4.8, '海珠区': 4.9, '天河区': 4.2, '白云区': 4.5, '全市平均': 4.7 },
    { year: '2020', '荔湾区': 4.9, '越秀区': 4.6, '海珠区': 4.7, '天河区': 4.0, '白云区': 4.3, '全市平均': 4.5 },
    { year: '2021', '荔湾区': 4.7, '越秀区': 4.4, '海珠区': 4.5, '天河区': 3.8, '白云区': 4.1, '全市平均': 4.3 },
    { year: '2022', '荔湾区': 4.5, '越秀区': 4.2, '海珠区': 4.3, '天河区': 3.6, '白云区': 3.9, '全市平均': 4.1 },
    { year: '2023', '荔湾区': 4.2, '越秀区': 4.0, '海珠区': 4.1, '天河区': 3.4, '白云区': 3.7, '全市平均': 4.2 }
  ],
  "中心性肥胖（腰围）": [
    { year: '2019', '荔湾区': 26.5, '越秀区': 25.9, '海珠区': 26.8, '天河区': 27.5, '白云区': 28.2, '全市平均': 27.0 },
    { year: '2020', '荔湾区': 27.1, '越秀区': 26.5, '海珠区': 27.4, '天河区': 28.1, '白云区': 28.9, '全市平均': 27.6 },
    { year: '2021', '荔湾区': 27.7, '越秀区': 27.1, '海珠区': 28.0, '天河区': 28.8, '白云区': 29.6, '全市平均': 28.2 },
    { year: '2022', '荔湾区': 28.3, '越秀区': 27.6, '海珠区': 28.6, '天河区': 29.5, '白云区': 30.3, '全市平均': 28.9 },
    { year: '2023', '荔湾区': 28.5, '越秀区': 28.1, '海珠区': 29.2, '天河区': 30.1, '白云区': 31.0, '全市平均': 28.5 }
  ],
  "体检覆盖率": [
    { year: '2019', '荔湾区': 65.2, '越秀区': 68.4, '海珠区': 64.9, '天河区': 61.2, '白云区': 55.6, '全市平均': 63.1 },
    { year: '2020', '荔湾区': 68.1, '越秀区': 71.2, '海珠区': 67.4, '天河区': 64.7, '白云区': 58.9, '全市平均': 66.1 },
    { year: '2021', '荔湾区': 72.4, '越秀区': 75.8, '海珠区': 71.1, '天河区': 68.3, '白云区': 61.2, '全市平均': 69.8 },
    { year: '2022', '荔湾区': 76.5, '越秀区': 79.1, '海珠区': 74.8, '天河区': 72.4, '白云区': 65.3, '全市平均': 73.6 },
    { year: '2023', '荔湾区': 79.8, '越秀区': 82.5, '海珠区': 78.2, '天河区': 76.1, '白云区': 69.4, '全市平均': 77.2 }
  ],
  "中心性肥胖（腰高比）": [
    { year: '2019', '荔湾区': 32.1, '越秀区': 31.5, '海珠区': 32.4, '天河区': 33.1, '白云区': 34.0, '全市平均': 32.6 },
    { year: '2020', '荔湾区': 32.7, '越秀区': 32.1, '海珠区': 33.0, '天河区': 33.7, '白云区': 34.7, '全市平均': 33.2 },
    { year: '2021', '荔湾区': 33.3, '越秀区': 32.7, '海珠区': 33.6, '天河区': 34.4, '白云区': 35.4, '全市平均': 33.9 },
    { year: '2022', '荔湾区': 33.9, '越秀区': 33.2, '海珠区': 34.2, '天河区': 35.1, '白云区': 36.1, '全市平均': 34.5 },
    { year: '2023', '荔湾区': 34.1, '越秀区': 33.7, '海珠区': 34.8, '天河区': 35.7, '白云区': 36.8, '全市平均': 34.1 }
  ],
  "脂肪肝患病率": [
    { year: '2019', '荔湾区': 18.5, '越秀区': 17.9, '海珠区': 18.8, '天河区': 19.5, '白云区': 20.2, '全市平均': 19.0 },
    { year: '2020', '荔湾区': 19.1, '越秀区': 18.5, '海珠区': 19.4, '天河区': 20.1, '白云区': 20.9, '全市平均': 19.6 },
    { year: '2021', '荔湾区': 19.7, '越秀区': 19.1, '海珠区': 20.0, '天河区': 20.8, '白云区': 21.6, '全市平均': 20.2 },
    { year: '2022', '荔湾区': 20.3, '越秀区': 19.6, '海珠区': 20.6, '天河区': 21.5, '白云区': 22.3, '全市平均': 20.9 },
    { year: '2023', '荔湾区': 20.5, '越秀区': 20.1, '海珠区': 21.2, '天河区': 22.1, '白云区': 23.0, '全市平均': 20.5 }
  ]
};

const GENERAL_METRIC_INSIGHTS: Record<string, string> = {
  "平均年龄": "随着我市健康养老生态工程持续推行，老年人体检参与率以及健康素养水平稳健上升。数据反馈，近五年来各区受体检人均年龄呈现规律性高龄化发展形态，以越秀区、荔湾区老城区在全省老龄化发展中最具代表性，应持续强化基层医疗健康顾问覆盖，引导‘老有所医、老有所康’。",
  "吸烟率": "在控烟宣讲制度以及呼吸系统慢病干预的正面激励下，本市老年人生活行为方式有明显改善。近五年全市平均老年人吸烟率从 20.0% 显性回落至 18.5%，这一正向变化以天河区青年/老龄人交叠宣推最快。未来，针对白云区及边缘区县高龄吸烟群体的帮扶干预仍是首要挑战。",
  "饮酒率": "在非疾病伴随阶段，老年群体偶尔或微量饮用滋补药酒、客家黄酒的生活特性常态化存在。近五年统计数据总体维持在 12% ~ 13.5% 的低缓区间波动，没有大范围酗酒或醉酒异常。医生管理体系应对心血管等高风险体检异常老人进行更加明确而严格的限酒医学宣贯。",
  "超重率": "得益于整体生活滋润水平显著提升，我市老年人超重率（BMI 处于 24.0~27.9）近五年呈现微增走势，白云区因社区农业活动比重对冲较为和缓，而天河区、越秀区等高密度城市居民区随生活甜油盐涉入及常态化静坐，超重率增长更快，需注重社区健康配餐引导。",
  "肥胖率": "重度肥胖（BMI>=28.0）直接挂钩老年高血压、2型糖尿病 and 心血管急性事件风险。全市及各区肥胖率近五年略有攀升，白云区从15.6%缓慢增加至17.5%，由于其在慢性病发病机制中属于致病始动因子，需大力发挥家医签约网格优势，提供点对点精准减重控脂干预。",
  "低体重率": "本市低体重老年人群（BMI < 18.5）近五年占比一直被牢牢控制在 4.2% 以下，这切实印证了‘一区一特色’的暖心惠老配餐服务和生活营养保障救助网底极其牢固。对于极少数因独居、失能、重病导致的突发性消瘦、低体重，呼吁各辖区卫生服务站积极提供个案专项营养膳食跟进。",
  "中心性肥胖（腰围）": "腹型/中心性肥胖（男性腰围>=90cm，女性腰围>=85cm）是反映代偿性高胰岛素血症、脂肪肝和冠心病患病的‘警示灯’。当前全市中心性肥胖率仍属偏高趋势（平均28.5%），越秀区和白云区涨势依然明显，有条件的体检网点需在常规大生化检查的同时，加强多维度生活习惯测评，普及科学量腰围规范。",
  "体检覆盖率": "体检覆盖率是我市实现老龄公共卫生服务均等化的硬性绩效考评基础指标。近五年来，荔湾、越秀、海珠等老城区在全省养老关爱网格赋能下，老年人体检覆盖率在2023年已跨过80%大关，这体现了家医网格签约服务的深入推进。天河区、白云区也已分别推进至76.1%和69.4%，未来需要进一步填补外围边缘地带长者的服务触达空白。",
  "中心性肥胖（腰高比）": "腰高比（Waist-to-Height Ratio, WHtR >= 0.5）是评估老年人心血管内脏脂肪蓄积的一流敏感指标。全市及各区腰高比超负荷均值处于34.1%高位水平徘徊，说明超三分之一的长者存在实质内脏脂肪过量堆积所诱发的代谢失衡风险，社区公共宣教中需要大力指导多段腰围及腰高比测量。",
  "脂肪肝患病率": "非酒精性脂肪性肝病（NAFLD）在老年人体检超声或血生化异常检出中十分高发。数据显示我市老年人平均脂肪肝患病率逼近20.5%红线。白云区的脂肪肝平均患病率达23.0%，这同不规律日常膳食、高脂及高碳水结构息息相关，亟需家医顾问提供深入浅出的抗炎护肝营养膳食方案。"
};

export function HealthAnalysisPage() {
  const [selectedDisease, setSelectedDisease] = React.useState<string>("高血压");
  const [selectedMetric, setSelectedMetric] = React.useState<string>("患病率");
  const [selectedGeneralMetric, setSelectedGeneralMetric] = React.useState<string>("吸烟率");
  const [selectedGeneralYear, setSelectedGeneralYear] = React.useState<string>("全部");
  const [selectedGeneralDistrict, setSelectedGeneralDistrict] = React.useState<string>("全部");

  const districts = ["荔湾区", "越秀区", "海珠区", "天河区", "白云区"];
  const colors = ["#397ef5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Title & Action Tool Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">老年人健康指标</h1>
          <p className="text-sm text-gray-500 mt-1">可视化展示各区县老年人健康指标趋势及分布情况。</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 text-xs border-slate-200">
            <Download className="w-3.5 h-3.5" /> 导出分析报告
          </Button>
        </div>
      </div>

      {/* District / Year Combined Filter Row */}
      <Card className="border-none shadow-sm font-sans bg-slate-50/50">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">对比辖区:</span>
            <div className="flex gap-1">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">荔湾区</span>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded">越秀区</span>
              <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-semibold rounded">海珠区</span>
              <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-semibold rounded">天河区</span>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded">白云区</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:ml-4">
            <span className="text-xs font-bold text-gray-600">研究年份跨度:</span>
            <Select defaultValue="range">
              <SelectTrigger className="w-[150px] h-8 text-xs bg-white border-slate-200">
                <SelectValue placeholder="2019-2023年" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="range">2019-2023年 (近五年)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs ml-auto font-semibold">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> 重算趋势
          </Button>
        </CardContent>
      </Card>

      {/* ==================================================== */}
      {/* Upper Chart: General Lifestyles & Physical Indicators (Replaced kpis cards) */}
      {/* ==================================================== */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col xl:flex-row xl:items-center justify-between border-b pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base font-bold text-slate-800">一、基础统计指标</CardTitle>
            </div>
            <CardDescription className="text-xs text-gray-400 pl-7">
              集成并整合：平均年龄、控烟、体检覆盖率、腰高比、脂肪肝等多维度的规律展示。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">指标:</span>
              <Select value={selectedGeneralMetric} onValueChange={setSelectedGeneralMetric}>
                <SelectTrigger className="w-[155px] h-8 text-xs border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="平均年龄">平均年龄 (岁)</SelectItem>
                  <SelectItem value="吸烟率">吸烟率 (%)</SelectItem>
                  <SelectItem value="饮酒率">饮酒率 (%)</SelectItem>
                  <SelectItem value="超重率">超重率 (%)</SelectItem>
                  <SelectItem value="肥胖率">肥胖率 (%)</SelectItem>
                  <SelectItem value="低体重率">低体重率 (%)</SelectItem>
                  <SelectItem value="中心性肥胖（腰围）">中心性肥胖（腰围） (%)</SelectItem>
                  <SelectItem value="体检覆盖率">体检覆盖率 (%)</SelectItem>
                  <SelectItem value="中心性肥胖（腰高比）">中心性肥胖（腰高比） (%)</SelectItem>
                  <SelectItem value="脂肪肝患病率">脂肪肝患病率 (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">年份选择:</span>
              <Select value={selectedGeneralYear} onValueChange={setSelectedGeneralYear}>
                <SelectTrigger className="w-[100px] h-8 text-xs border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="全部">全部年份</SelectItem>
                  <SelectItem value="2019">2019年</SelectItem>
                  <SelectItem value="2020">2020年</SelectItem>
                  <SelectItem value="2021">2021年</SelectItem>
                  <SelectItem value="2022">2022年</SelectItem>
                  <SelectItem value="2023">2023年</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">区县选择:</span>
              <Select value={selectedGeneralDistrict} onValueChange={setSelectedGeneralDistrict}>
                <SelectTrigger className="w-[100px] h-8 text-xs border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="全部">全部区县</SelectItem>
                  <SelectItem value="荔湾区">荔湾区</SelectItem>
                  <SelectItem value="越秀区">越秀区</SelectItem>
                  <SelectItem value="海珠区">海珠区</SelectItem>
                  <SelectItem value="天河区">天河区</SelectItem>
                  <SelectItem value="白云区">白云区</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[360px] w-full">
            {selectedGeneralYear === "全部" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={MOCK_GENERAL_TRENDS[selectedGeneralMetric] || []}
                  margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    unit={selectedGeneralMetric === "平均年龄" ? "岁" : "%"}
                    domain={selectedGeneralMetric === "平均年龄" ? [68, 75] : ['auto', 'auto']}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5 }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '11px'
                    }}
                    formatter={(value: any) => [`${value}${selectedGeneralMetric === "平均年龄" ? "岁" : "%"}`]}
                  />
                  <Legend iconType="circle" verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }}/>
                  {districts.map((district, index) => {
                    const isSelected = selectedGeneralDistrict === "全部" || selectedGeneralDistrict === district;
                    const opacity = selectedGeneralDistrict === "全部" ? 1 : (isSelected ? 1 : 0.15);
                    const strokeWidth = isSelected ? (selectedGeneralDistrict === "全部" ? 2.5 : 4) : 1;
                    return (
                      <Line 
                        key={district}
                        type="monotone"
                        dataKey={district} 
                        name={district} 
                        stroke={colors[index]} 
                        strokeWidth={strokeWidth}
                        strokeOpacity={opacity}
                        dot={selectedGeneralDistrict === "全部" ? { r: 3.5, strokeWidth: 1.5 } : (isSelected ? { r: 5, strokeWidth: 1.5 } : false)}
                        activeDot={isSelected ? { r: 6, strokeWidth: 0 } : false}
                      />
                    );
                  })}
                  <Line 
                    type="monotone"
                    dataKey="全市平均" 
                    name="全市平均 (对照线)" 
                    stroke="#475569" 
                    strokeWidth={selectedGeneralDistrict === "全部" ? 2.5 : 1.5}
                    strokeOpacity={selectedGeneralDistrict === "全部" ? 1 : 0.4}
                    strokeDasharray="4 4"
                    dot={{ r: 3, strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (() => {
              // Get single year data
              const yearRow = (MOCK_GENERAL_TRENDS[selectedGeneralMetric] || []).find(
                d => d.year === selectedGeneralYear
              );
              if (!yearRow) return <div className="text-center text-xs text-gray-400 pt-12">未找到数据</div>;
              
              let singleYearData = districts.map((dist, idx) => ({
                name: dist,
                value: yearRow[dist],
                fill: colors[idx]
              }));
              
              singleYearData.push({
                name: "全市平均",
                value: yearRow["全市平均"],
                fill: "#475569"
              });

              // Filter district if selection is specific
              if (selectedGeneralDistrict !== "全部") {
                singleYearData = singleYearData.filter(
                  d => d.name === selectedGeneralDistrict || d.name === "全市平均"
                );
              }

              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={singleYearData}
                    margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      unit={selectedGeneralMetric === "平均年龄" ? "岁" : "%"}
                      domain={selectedGeneralMetric === "平均年龄" ? [65, 75] : ['auto', 'auto']}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        fontSize: '11px'
                      }}
                      formatter={(value: any) => [`${value}${selectedGeneralMetric === "平均年龄" ? "岁" : "%"}`]}
                    />
                    <Bar 
                      dataKey="value" 
                      name={selectedGeneralMetric}
                      radius={[3, 3, 0, 0]}
                      barSize={32}
                    >
                      {singleYearData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
          
          <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start gap-3">
            <Users className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-950">
              <p className="font-bold mb-1 flex items-center gap-1 text-indigo-900">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>基于五学年健康大盘对比 ({selectedGeneralMetric}) 结论分析:</span>
              </p>
              <p className="leading-relaxed text-slate-700">{GENERAL_METRIC_INSIGHTS[selectedGeneralMetric]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================================================== */}
      {/* Lower Chart: Chronic Disease Specific Prevalence Rates (Original diseases chart) */}
      {/* ==================================================== */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">二、疾病指标年度趋势分析（分区县对比）</CardTitle>
            </div>
            <CardDescription className="text-xs text-gray-400 pl-7">
              跟踪高血压、糖尿病、血脂异常、贫血在不同维度的历史治疗、预防控制率规律变化。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">查看疾病:</span>
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger className="w-[120px] h-8 text-xs border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="高血压">高血压</SelectItem>
                  <SelectItem value="糖尿病">糖尿病</SelectItem>
                  <SelectItem value="血脂异常">血脂异常</SelectItem>
                  <SelectItem value="贫血">贫血</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">评估维度:</span>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[100px] h-8 text-xs border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="患病率">患病率</SelectItem>
                  <SelectItem value="治疗率">治疗率</SelectItem>
                  <SelectItem value="控制率">控制率</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_TREND_DATA[selectedDisease] || []}
                margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  unit="%"
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    fontSize: '11px'
                  }}
                  formatter={(value: any) => [`${value}%`]}
                />
                <Legend iconType="rect" verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }}/>
                {districts.map((district, index) => (
                  <Bar 
                    key={district}
                    dataKey={district} 
                    name={district} 
                    fill={colors[index]} 
                    radius={[3, 3, 0, 0]}
                    barSize={16}
                  />
                ))}
                <Bar 
                  dataKey="全市平均" 
                  name="全市平均 (对照线)" 
                  fill="#64748b" 
                  radius={[3, 3, 0, 0]}
                  barSize={16}
                  fillOpacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-3">
            <Activity className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-950">
              <p className="font-bold mb-1 flex items-center gap-1 text-blue-900">
                <Award className="w-3.5 h-3.5" />
                <span>基于疾病网格 ({selectedDisease} - {selectedMetric}) 临床决策辅助:</span>
              </p>
              <p className="leading-relaxed text-slate-700">自 2019 年随访建档以来，各区县受体检居民的{selectedDisease}{selectedMetric}均呈现正向规律。其中，白云区与荔湾区在该项临床反馈上相对偏高。应提倡家庭医生网格化随访及多级医疗中心联合对重点患者实施‘一人一案’的用药控制管理，避免脑梗及外周动脉硬化等靶器官病变多发。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

