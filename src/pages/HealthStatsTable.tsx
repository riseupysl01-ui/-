import * as React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Activity, 
  Filter, 
  Download, 
  RefreshCcw, 
  SlidersHorizontal,
  BadgeAlert,
  ChevronDown,
  Info,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistrictStat {
  district: string;
  population: number; // 常住人口 (来自人口维护)
  examCount: number; // 体检人数
  coverageRate: string; // 体检覆盖率 = 体检人数 / 人口
  avgAge: number;
  smokingRate: string;
  drinkingRate: string;
  overweightRate: string;
  obesityRate: string;
  underweightRate: string;
  waistToHeightRatio: string; // 腰高比 = 腰围 / 身高
  centralObesityRate: string;
  hypertensionPrevalence: string;
  hypertensionTreatment: string;
  hypertensionControl: string;
  diabetesPrevalence: string;
  diabetesTreatment: string;
  diabetesControl: string;
  fattyLiver: string; // 脂肪肝 (B超含有 脂肪肝 关键字占比)
  copdRate: string; // 慢阻肺
  asthmaRate: string; // 哮喘
  silicosisRate: string; // 尘肺
  bronchiectasizeRate: string; // 支气管扩张
  anemia: string;
  multimorbidity: string; // 多病共存
  disability: string; // 失能
  mortalityRate: string; // 死亡率
}

const DISTRICT_STATS_2024: DistrictStat[] = [
  {
    district: "荔湾区",
    population: 45000,
    examCount: 34100,
    coverageRate: "75.7%",
    avgAge: 73.2,
    smokingRate: "18.2%",
    drinkingRate: "11.1%",
    overweightRate: "34.5%",
    obesityRate: "11.2%",
    underweightRate: "4.8%",
    waistToHeightRatio: "0.54",
    centralObesityRate: "28.5%",
    hypertensionPrevalence: "49.1%",
    hypertensionTreatment: "72.4%",
    hypertensionControl: "42.5%",
    diabetesPrevalence: "15.8%",
    diabetesTreatment: "65.4%",
    diabetesControl: "35.2%",
    fattyLiver: "22.5%",
    copdRate: "4.2%",
    asthmaRate: "1.8%",
    silicosisRate: "0.3%",
    bronchiectasizeRate: "0.4%",
    anemia: "6.0%",
    multimorbidity: "21.2%",
    disability: "4.5%",
    mortalityRate: "1.25%",
  },
  {
    district: "越秀区",
    population: 38000,
    examCount: 30120,
    coverageRate: "79.2%",
    avgAge: 74.5,
    smokingRate: "15.4%",
    drinkingRate: "9.2%",
    overweightRate: "32.1%",
    obesityRate: "10.1%",
    underweightRate: "5.1%",
    waistToHeightRatio: "0.52",
    centralObesityRate: "26.1%",
    hypertensionPrevalence: "49.5%",
    hypertensionTreatment: "78.2%",
    hypertensionControl: "44.9%",
    diabetesPrevalence: "16.2%",
    diabetesTreatment: "69.1%",
    diabetesControl: "38.5%",
    fattyLiver: "20.1%",
    copdRate: "3.8%",
    asthmaRate: "1.5%",
    silicosisRate: "0.1%",
    bronchiectasizeRate: "0.2%",
    anemia: "6.5%",
    multimorbidity: "22.5%",
    disability: "4.8%",
    mortalityRate: "1.32%",
  },
  {
    district: "白云区",
    population: 52000,
    examCount: 36400,
    coverageRate: "70.0%",
    avgAge: 71.8,
    smokingRate: "22.5%",
    drinkingRate: "14.8%",
    overweightRate: "36.8%",
    obesityRate: "12.8%",
    underweightRate: "4.2%",
    waistToHeightRatio: "0.55",
    centralObesityRate: "31.2%",
    hypertensionPrevalence: "49.8%",
    hypertensionTreatment: "68.5%",
    hypertensionControl: "38.1%",
    diabetesPrevalence: "16.5%",
    diabetesTreatment: "60.2%",
    diabetesControl: "31.1%",
    fattyLiver: "25.2%",
    copdRate: "5.1%",
    asthmaRate: "2.1%",
    silicosisRate: "0.6%",
    bronchiectasizeRate: "0.5%",
    anemia: "6.8%",
    multimorbidity: "19.5%",
    disability: "4.1%",
    mortalityRate: "1.10%",
  },
  {
    district: "天河区",
    population: 31000,
    examCount: 22800,
    coverageRate: "73.5%",
    avgAge: 70.9,
    smokingRate: "14.1%",
    drinkingRate: "12.4%",
    overweightRate: "30.5%",
    obesityRate: "9.5%",
    underweightRate: "4.5%",
    waistToHeightRatio: "0.51",
    centralObesityRate: "23.4%",
    hypertensionPrevalence: "44.8%",
    hypertensionTreatment: "75.1%",
    hypertensionControl: "46.2%",
    diabetesPrevalence: "13.2%",
    diabetesTreatment: "71.5%",
    diabetesControl: "40.1%",
    fattyLiver: "19.4%",
    copdRate: "3.2%",
    asthmaRate: "1.2%",
    silicosisRate: "0.1%",
    bronchiectasizeRate: "0.3%",
    anemia: "5.5%",
    multimorbidity: "17.4%",
    disability: "3.2%",
    mortalityRate: "0.95%",
  }
];

export function HealthStatsTablePage() {
  const [selectedYear, setSelectedYear] = React.useState("2024");
  const [selectedMetricGroup, setSelectedMetricGroup] = React.useState<"all" | "metabolic" | "cardio" | "pulmonary" | "classic">("all");
  const [selectedDistrict, setSelectedDistrict] = React.useState("all");

  const filteredStats = DISTRICT_STATS_2024.filter(item => 
    selectedDistrict === "all" || item.district === selectedDistrict
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            健康统计表
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            动态按整年度、区县分类计算体检覆盖率、腰高比、肺部疾病（尘肺/哮喘）及脂肪肝筛出比率等多病同患核心指标。
          </p>
        </div>
        <Button variant="outline" className="gap-2 h-9">
          <Download className="w-4 h-4" /> 导出本期分析报表 (Excel)
        </Button>
      </div>

      {/* Control filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-wrap md:flex-nowrap gap-4 items-end">
          <div className="space-y-1 w-full md:w-36 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase">统计基准年</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024 统计年度</SelectItem>
                <SelectItem value="2023">2023 统计年度</SelectItem>
                <SelectItem value="2022">2022 统计年度</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 w-full md:w-44 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase">选择区县划分</span>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全市各区合并(横向比对)</SelectItem>
                <SelectItem value="荔湾区">荔湾区</SelectItem>
                <SelectItem value="越秀区">越秀区</SelectItem>
                <SelectItem value="白云区">白云区</SelectItem>
                <SelectItem value="天河区">天河区</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 w-full">
            <span className="text-xs font-semibold text-gray-500 uppercase">指标板块聚焦切换</span>
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border">
              <button 
                onClick={() => setSelectedMetricGroup("all")}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${selectedMetricGroup === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                综合覆盖
              </button>
              <button 
                onClick={() => setSelectedMetricGroup("metabolic")}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${selectedMetricGroup === "metabolic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                代谢与超肥肥 (腰高比/脂肪肝)
              </button>
              <button 
                onClick={() => setSelectedMetricGroup("cardio")}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${selectedMetricGroup === "cardio" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                心脑血管(高患/控率/疗率)
              </button>
              <button 
                onClick={() => setSelectedMetricGroup("pulmonary")}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${selectedMetricGroup === "pulmonary" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                呼吸病细分 (4种慢肺病)
              </button>
              <button 
                onClick={() => setSelectedMetricGroup("classic")}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${selectedMetricGroup === "classic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                经典共患与随防结局 (自理/死亡)
              </button>
            </div>
          </div>

          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => {
            setSelectedYear("2024");
            setSelectedMetricGroup("all");
            setSelectedDistrict("all");
          }}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="text-xs">
                <TableHead className="font-bold text-slate-800 shrink-0 sticky left-0 bg-slate-50 border-r z-10 w-24">
                  区县名称
                </TableHead>

                {/* Group and selective headers */}
                {(selectedMetricGroup === "all" || selectedMetricGroup === "metabolic") && (
                  <>
                    <TableHead className="font-semibold text-center text-slate-700">常住人口数</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">建档体检人数</TableHead>
                    <TableHead className="font-semibold text-center text-red-600 bg-red-50/20 font-bold">体检覆盖率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">年龄中值</TableHead>
                  </>
                )}

                {(selectedMetricGroup === "all" || selectedMetricGroup === "metabolic") && (
                  <>
                    <TableHead className="font-semibold text-center text-blue-600 font-bold">腰高比 (WHtR)</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">超重率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">肥胖率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">中心性肥胖率</TableHead>
                    <TableHead className="font-semibold text-center text-purple-600 font-bold">脂肪肝筛出率 (B超)</TableHead>
                  </>
                )}

                {(selectedMetricGroup === "all" || selectedMetricGroup === "cardio") && (
                  <>
                    <TableHead className="font-semibold text-center text-slate-700">高血压率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">高血压治疗</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">高血压控制</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">糖尿病率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">糖尿治疗</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">糖尿控制</TableHead>
                  </>
                )}

                {(selectedMetricGroup === "all" || selectedMetricGroup === "pulmonary") && (
                  <>
                    <TableHead className="font-semibold text-center text-indigo-600 font-bold">慢阻肺 (COPD)</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">哮喘率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">尘肺/矽肺</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">支气管扩张</TableHead>
                  </>
                )}

                {(selectedMetricGroup === "all" || selectedMetricGroup === "classic") && (
                  <>
                    <TableHead className="font-semibold text-center text-slate-700">贫血异常率</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">多病共存</TableHead>
                    <TableHead className="font-semibold text-center text-slate-700">重度失能率</TableHead>
                    <TableHead className="font-semibold text-center text-[#ff3b30] font-bold">粗死亡率</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStats.map((st, i) => (
                <TableRow key={st.district} className="hover:bg-slate-50/50 text-xs text-center">
                  <TableCell className="font-bold text-slate-800 text-left sticky left-0 bg-white border-r z-10">
                    {st.district}
                  </TableCell>

                  {(selectedMetricGroup === "all" || selectedMetricGroup === "metabolic") && (
                    <>
                      <TableCell>{st.population ? st.population.toLocaleString() : "-"}</TableCell>
                      <TableCell>{st.examCount ? st.examCount.toLocaleString() : "-"}</TableCell>
                      <TableCell className="bg-red-50/10 font-bold text-red-600 font-mono">{st.coverageRate}</TableCell>
                      <TableCell className="font-mono">{st.avgAge} 岁</TableCell>
                    </>
                  )}

                  {(selectedMetricGroup === "all" || selectedMetricGroup === "metabolic") && (
                    <>
                      <TableCell className="text-blue-600 font-bold font-mono">{st.waistToHeightRatio}</TableCell>
                      <TableCell className="font-mono">{st.overweightRate}</TableCell>
                      <TableCell className="font-mono">{st.obesityRate}</TableCell>
                      <TableCell className="font-mono">{st.centralObesityRate}</TableCell>
                      <TableCell className="text-purple-600 font-semibold font-mono">{st.fattyLiver}</TableCell>
                    </>
                  )}

                  {(selectedMetricGroup === "all" || selectedMetricGroup === "cardio") && (
                    <>
                      <TableCell className="font-mono">{st.hypertensionPrevalence}</TableCell>
                      <TableCell className="font-mono">{st.hypertensionTreatment}</TableCell>
                      <TableCell className="font-mono">{st.hypertensionControl}</TableCell>
                      <TableCell className="font-mono">{st.diabetesPrevalence}</TableCell>
                      <TableCell className="font-mono">{st.diabetesTreatment}</TableCell>
                      <TableCell className="font-mono">{st.diabetesControl}</TableCell>
                    </>
                  )}

                  {(selectedMetricGroup === "all" || selectedMetricGroup === "pulmonary") && (
                    <>
                      <TableCell className="text-indigo-600 font-semibold font-mono">{st.copdRate}</TableCell>
                      <TableCell className="font-mono">{st.asthmaRate}</TableCell>
                      <TableCell className="font-mono">{st.silicosisRate}</TableCell>
                      <TableCell className="font-mono">{st.bronchiectasizeRate}</TableCell>
                    </>
                  )}

                  {(selectedMetricGroup === "all" || selectedMetricGroup === "classic") && (
                    <>
                      <TableCell className="font-mono">{st.anemia}</TableCell>
                      <TableCell className="font-mono">{st.multimorbidity}</TableCell>
                      <TableCell className="font-mono text-red-600">{st.disability}</TableCell>
                      <TableCell className="text-red-700 font-bold font-mono">{st.mortalityRate}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats explanation rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <BadgeAlert className="w-4 h-4 text-amber-500" />
              <span>新增/定制健康公式解释：</span>
            </h4>
            <div className="space-y-1.5 leading-relaxed pl-1">
              <p>
                <b>1. 体检覆盖率 (%)</b> = 辖区常住体检结存数 / 辖区当年核定常住人口 × 100%。常住总人口于“人口基本维护”由统计部门下发结存。
              </p>
              <p>
                <b>2. 平均腰高比 (WHtR)</b> = 队列人群平均【腰围 / 身高】。该比率若高过 0.50 往往伴随内脏脂肪蓄积，对评估脑卒中有显著前瞻作用。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <span>呼吸道与脂肪肝特定比对条件：</span>
            </h4>
            <div className="space-y-1.5 leading-relaxed pl-1">
              <p>
                <b>3. 慢性呼吸系统疾病细分：</b> 按 ICD-10 进行匹配分类。目前系统包括 哮喘 (ICD-10: J45), 慢阻肺 (J44), 尘肺/矽肺 (J60-J65), 支气管扩张 (J47)。
              </p>
              <p>
                <b>4. 脂肪肝判定：</b> 依托年度体检腹部 B 超检查异常报告中，带有关键词【脂肪肝】、【肝硬化前期】或对应超声信号的异常样本占比。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
