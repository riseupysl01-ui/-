import * as React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Activity, 
  TrendingUp, 
  Filter, 
  RefreshCcw, 
  Info,
  CalendarDays,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHRONIC_PREVALENCE_MOCK = [
  { year: "2019", "高血压患病率": 41.2, "糖尿病患病率": 11.5, "脑卒中患病率": 2.3, "慢阻肺患病率": 4.1 },
  { year: "2020", "高血压患病率": 42.4, "糖尿病患病率": 12.1, "脑卒中患病率": 2.5, "慢阻肺患病率": 4.3 },
  { year: "2021", "高血压患病率": 43.6, "糖尿病患病率": 12.8, "脑卒中患病率": 2.8, "慢阻肺患病率": 4.4 },
  { year: "2022", "高血压患病率": 44.9, "糖尿病患病率": 13.5, "脑卒中患病率": 3.1, "慢阻肺患病率": 4.6 },
  { year: "2023", "高血压患病率": 46.2, "糖尿病患病率": 14.1, "脑卒中患病率": 3.3, "慢阻肺患病率": 4.8 },
  { year: "2024", "高血压患病率": 47.1, "糖尿病患病率": 14.8, "脑卒中患病率": 3.6, "慢阻肺患病率": 4.9 },
];

const PHYSIOLOGICAL_TREND_MOCK = [
  { year: "2019", "舒张压均值": 81.2, "收缩压均值": 132.5, "空腹血糖均值": 5.82, "BMI 均值": 23.4, "失能率": 3.4 },
  { year: "2020", "舒张压均值": 81.8, "收缩压均值": 133.2, "空腹血糖均值": 5.89, "BMI 均值": 23.6, "失能率": 3.6 },
  { year: "2021", "舒张压均值": 82.1, "收缩压均值": 134.0, "空腹血糖均值": 5.94, "BMI 均值": 23.9, "失能率": 3.9 },
  { year: "2022", "舒张压均值": 82.5, "收缩压均值": 134.8, "空腹血糖均值": 6.01, "BMI 均值": 24.1, "失能率": 4.1 },
  { year: "2023", "舒张压均值": 82.9, "收缩压均值": 135.5, "空腹血糖均值": 6.08, "BMI 均值": 24.2, "失能率": 4.3 },
  { year: "2024", "舒张压均值": 83.1, "收缩压均值": 136.2, "空腹血糖均值": 6.12, "BMI 均值": 24.4, "失能率": 4.5 },
];

export function HealthTrendsPage() {
  const [district, setDistrict] = React.useState("all");
  const [gender, setGender] = React.useState("all");
  const [ageRange, setAgeRange] = React.useState("all");
  const [isLoading, setIsLoading] = React.useState(false);

  // Future integration triggers
  const [enableCognitiveSource, setEnableCognitiveSource] = React.useState(false);

  const handleFilterChange = (type: string, val: string) => {
    setIsLoading(true);
    if (type === "district") setDistrict(val);
    if (type === "gender") setGender(val);
    if (type === "age") setAgeRange(val);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setIsLoading(true);
    setDistrict("all");
    setGender("all");
    setAgeRange("all");
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>健康指标变化趋势</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            追踪随访 cohorts 历年的生存、在册生化测量、吸烟饮酒以及生理指标跨年度的连续波动。
          </p>
        </div>
      </div>

      {/* Foldable controllers */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 所属辖区县
            </span>
            <Select value={district} onValueChange={(val) => handleFilterChange("district", val)}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9 text-xs">
                <SelectValue placeholder="全部区县" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全市合并数据</SelectItem>
                <SelectItem value="荔湾区">荔湾区</SelectItem>
                <SelectItem value="越秀区">越秀区</SelectItem>
                <SelectItem value="天河区">天河区</SelectItem>
                <SelectItem value="白云区">白云区</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">性别划分</span>
            <Select value={gender} onValueChange={(val) => handleFilterChange("gender", val)}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9 text-xs">
                <SelectValue placeholder="不限性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限性别</SelectItem>
                <SelectItem value="male">仅限男性长者</SelectItem>
                <SelectItem value="female">仅限女性长者</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">年龄阶段</span>
            <Select value={ageRange} onValueChange={(val) => handleFilterChange("age", val)}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9 text-xs">
                <SelectValue placeholder="不限年龄限值" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限年龄 (60岁+)</SelectItem>
                <SelectItem value="60-69">60岁 - 69岁</SelectItem>
                <SelectItem value="70-79">70岁 - 79岁</SelectItem>
                <SelectItem value="80+">80岁及以上高龄</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="h-9 w-full gap-1.5 text-xs font-semibold" onClick={handleReset}>
              <RefreshCcw className="w-3.5 h-3.5" /> 重置筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl transition-all">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-gray-500 font-semibold">正在依据队列子交叉集重算数据...</p>
            </div>
          </div>
        )}

        {/* Disability Rate and Cardiovascular trends */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>老年重要生理生理变动趋势 (均值波动)</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">物理体标指标</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              展示包含 BMI 指标波动、腰围体液均值、收缩压/舒张压均值多轴趋势
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PHYSIOLOGICAL_TREND_MOCK} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="收缩压均值" stroke="#ef4444" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey="舒张压均值" stroke="#fb923c" strokeWidth={1.5} />
                <Line type="monotone" dataKey="BMI 均值" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="空腹血糖均值" stroke="#10b981" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chronic Sickness Prevalence Rate */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>队列四大主要慢病随访结局累计患病率 (%)</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">慢病流行病率</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              根据基层卫健平台确诊建卡和二次死亡原因、ICD-10归口算出的患病暴露比值。
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHRONIC_PREVALENCE_MOCK} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="hypertensionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="高血压患病率" stroke="#f87171" fillOpacity={1} fill="url(#hypertensionGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="糖尿病患病率" stroke="#60a5fa" fillOpacity={1} fill="url(#dbGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="脑卒中患病率" stroke="#a78bfa" strokeWidth={1.5} />
                <Line type="monotone" dataKey="慢阻肺患病率" stroke="#2dd4bf" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disability Rate Area Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">老年自理评估失能变动率（%）</CardTitle>
            <CardDescription className="text-xs">
              根据老年生活自理能力评分（如：得分≥19分判定中重度依赖）算数统计。
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PHYSIOLOGICAL_TREND_MOCK} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="失能率" stroke="#64748b" fillOpacity={1} fill="url(#disGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Future Reserve / Config Area */}
        <Card className="border-none shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold">未来预留接口</span>
          </div>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              认知/脑退化与焦虑抑郁专项变化监测 (MMSE & GAD-7)
            </CardTitle>
            <CardDescription className="text-xs">
              预留微观量表指标：包含 AD8 超筛、焦虑值在随访周期内的波动率自拟分析。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-800 block">随访量表检测控制机制</span>
                <p className="text-[11px] text-gray-500 max-w-sm leading-relaxed">
                  目前体检数据一期/二期模板中暂未导入《生活自理MMSE认知测验》及《PHQ-9躯体焦虑表格》分项。点击右侧开关，可启动模拟源以预览脑功能科研分析区划。
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                <span className="text-xs text-gray-400">开启模拟看板</span>
                <button 
                  onClick={() => setEnableCognitiveSource(!enableCognitiveSource)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enableCognitiveSource ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${enableCognitiveSource ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {enableCognitiveSource ? (
              <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-purple-100 rounded-xl bg-purple-50/20 text-center p-6 animate-in slide-in-from-top-1 duration-200">
                <p className="text-xs text-purple-900 font-semibold mb-1">🧠 已加载脑退化与情绪匹配模拟源</p>
                <p className="text-[11px] text-gray-500 max-w-md">
                  二期预测表明，60岁以上多病共患人群中，伴随阿尔茨海默疑似前期退化比值为 2.45/百人，对抑郁多重筛查的符合倾向为 4.1%。具体指标待四期量表字段统一修订入库。
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="outline" className="bg-purple-100 border-none text-purple-700">MMSE: 均值26.4</Badge>
                  <Badge variant="outline" className="bg-indigo-100 border-none text-indigo-700">PHQ-9 异常率: 1.8%</Badge>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center border rounded-xl bg-slate-50 text-slate-400 text-center p-6">
                <AlertCircle className="w-8 h-8 mb-2 opacity-30 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-800">功能待确认 / 配置未启用</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">该量表数据缺乏真实体检入库来源支持，您可以启用模拟源进行预览。</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend guideline block */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4 text-xs text-slate-600">
        <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">图表交互操作指南:</p>
          <p>
            1. 支持点击对应图例 (Legend) 比如“空腹血糖均值”或“高血压患病率”等对序列折线实施一键隐藏或显现，方便单独查看或叠加横向比对。
          </p>
          <p>
            2. 数据均依据脱敏随访结局算数处理（去除了跨区县因随访失连和迁出导致的错误噪点）。
          </p>
        </div>
      </div>
    </div>
  );
}
