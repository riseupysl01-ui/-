import * as React from "react";
import { 
  BarChart3, 
  Tv2, 
  ArrowLeftRight, 
  FileDown, 
  Map, 
  Calendar, 
  ShieldAlert,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Flame,
  Info
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

export function StatsPresenterPage() {
  const [currentYear, setCurrentYear] = React.useState("2024");
  const [currentDistrict, setCurrentDistrict] = React.useState("全市汇总");
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isDemoMode, setIsDemoMode] = React.useState(false);

  const timestamp = new Date().toISOString().substring(0, 10);

  const slides = [
    {
      title: "长者队列年度总体体检覆盖率",
      subtitle: "依据 2024 年度常住家庭签约基准比对",
      metric: "74.1%",
      subtext: "累计体检人数: 122,420 人 (常住老年总人口: 165,210)",
      description: "本市老年人基本档案年度覆盖率自2019年的45%上升至74.1%。其中越秀区（79.2%）及荔湾区（75.7%）表现突出；远郊白云区由于流动基盘大，覆盖率暂低（70.0%）。",
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "跨年肥胖率与中心性肥胖演进",
      subtitle: "身体质量指数 (BMI) 与腰高比 (WHtR) 叠加指数",
      metric: "11.2%",
      subtext: "肥胖率平均: 11.2% (腰高比超标 WHtR > 0.50 比例高达30.4%)",
      description: "追踪数据表明，多达 30.4% 的在世老人在年度体检中测得中心性肥胖（男性腰围≥90cm，女性腰围≥85cm）。肥胖长者中合并高血压及糖尿病的多病共存倾向是正常体重者的 2.85 倍。",
      color: "from-violet-600 to-purple-800"
    },
    {
      title: "高血压及糖尿病分项治疗与控制力",
      subtitle: "心脑血管慢性暴露分级危险追踪",
      metric: "42.5%",
      subtext: "高血压控制率: 42.5% | 糖尿病控制率: 35.2%",
      description: "高血压整体管理患者中服药率（治疗率）达到 72.4%，但规范服药、合理膳食达致血压控制合格（收缩压持续<140且舒张压<90）者仅占比 42.5%。糖尿病控制难度依然极大。",
      color: "from-emerald-600 to-teal-700"
    },
    {
      title: "呼吸系统四大疾病细分暴露率",
      subtitle: "按 ICD-10 病病登记溯源",
      metric: "4.2%",
      subtext: "COPD(慢阻肺)占比 4.2% | 哮喘持续占比 1.8% | 尘肺 0.3%",
      description: "慢性阻塞性肺疾病（COPD）占总受检队列首要呼吸受损因，尤其与长年累积吸烟史（目前吸烟率22%）显著正相关。尘肺及矽肺多高发于白云、黄埔工业背景老工龄长者。",
      color: "from-rose-600 to-orange-700"
    }
  ];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex];

  const triggerExport = (format: "Excel" | "PNG" | "PDF") => {
    alert(
      `正在为您导出演示报告...\n\n标题: ${currentSlide.title}\n年份: ${currentYear}年\n区县: ${currentDistrict}\n时间: ${timestamp} 04:19\n格式: ${format}\n导出状态: 已纳入安全系统凭证。`
    );
  };

  return (
    <div className={`space-y-6 ${isDemoMode ? "p-8 max-w-6xl mx-auto border-4 border-double border-indigo-200 bg-white shadow-xl rounded-2xl animate-in zoom-in-95 duration-300" : "animate-in fade-in duration-500"}`}>
      
      {/* Dynamic demo heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-bold text-xs mb-1 gap-1">
            <Sparkles className="w-3 h-3" /> 大屏幕演示汇报模式
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900">健康统计演示与导出仪表盘</h1>
          <p className="text-xs text-gray-500 mt-1">
            大屏幕演示支持对重点公共卫生流调成果进行汇报，同时保留图表标题、筛选区县、生成时间戳防篡改导出。
          </p>
        </div>

        <div className="flex gap-2 shrink-0 self-end md:self-auto">
          <Button 
            variant={isDemoMode ? "destructive" : "outline"}
            className="gap-1.5 h-9 font-semibold text-xs transition-colors"
            onClick={() => setIsDemoMode(!isDemoMode)}
          >
            <Tv2 className="w-4 h-4" /> 
            {isDemoMode ? "退出汇报卡片模式" : "全幅汇报模式"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 h-9 font-semibold text-xs gap-1.5" onClick={() => triggerExport("Excel")}>
            <Download className="w-3.5 h-3.5" /> 导出本卡数据 (CSV)
          </Button>
        </div>
      </div>

      {/* Screen Presentation Slide Component */}
      <div className={`rounded-xl p-8 text-white bg-gradient-to-br ${currentSlide.color} shadow-lg relative min-h-[340px] flex flex-col justify-between transition-all duration-500`}>
        <div className="absolute top-4 right-4 text-xs text-white/50 font-mono">
          Slide {currentSlideIndex + 1} of {slides.length}
        </div>

        {/* Filter contextual status displayed directly on report */}
        <div className="flex items-center gap-3">
          <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            {currentYear}年度
          </Badge>
          <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            区域: {currentDistrict}
          </Badge>
          <span className="text-xs text-white/60 font-mono">
            生成指纹: ST-{currentSlideIndex}-2026-62
          </span>
        </div>

        {/* Meta body */}
        <div className="my-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{currentSlide.title}</h2>
            <p className="text-white/70 text-xs mt-1 font-medium">{currentSlide.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            <div className="text-5xl font-extrabold tracking-tight font-mono">{currentSlide.metric}</div>
            <div className="text-white/80 text-xs font-semibold bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg">
              {currentSlide.subtext}
            </div>
          </div>

          <p className="text-white/90 text-sm leading-relaxed max-w-4xl pt-2">
            {currentSlide.description}
          </p>
        </div>

        {/* Presenter Footer Toolbar */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-white/50 leading-relaxed font-mono">
            研究出处：广州公卫老龄病理队列数据库 | 核发时间: {timestamp}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white" onClick={handlePrev}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white" onClick={handleNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Presentation customizer menu */}
      <Card className="border-none shadow-sm pb-4">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-semibold">演示及防篡改导出设定</CardTitle>
          <CardDescription className="text-xs">
            演示过滤参数与报告抬头绑定机制，将在此打包为图片/PDF等凭。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">演示年份</label>
            <Select value={currentYear} onValueChange={setCurrentYear}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024 汇总基准</SelectItem>
                <SelectItem value="2023">2023 汇总基准</SelectItem>
                <SelectItem value="2022">2022 汇总基准</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">演示区划</label>
            <Select value={currentDistrict} onValueChange={setCurrentDistrict}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全市汇总">全市合并大屏</SelectItem>
                <SelectItem value="荔湾区">荔湾区分会场</SelectItem>
                <SelectItem value="越秀区">越秀区分会场</SelectItem>
                <SelectItem value="白云区">白云区分会场</SelectItem>
                <SelectItem value="天河区">天河区分会场</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <Button className="bg-slate-800 hover:bg-slate-900 h-9 font-semibold text-xs flex-1 gap-1.5" onClick={() => triggerExport("PNG")}>
              <Printer className="w-3.5 h-3.5" /> 导出至高清幻灯片 (PNG)
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 h-9 font-semibold text-xs flex-1 gap-1.5" onClick={() => triggerExport("PDF")}>
              <FileDown className="w-3.5 h-3.5" /> 导出系统宣贯长文 (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex gap-4 text-xs text-indigo-950">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">演示导出防伪签名通知:</p>
          <p>
            为响应国家数字医疗防伪安全号召，在大屏进行成果截屏或下载打印文件时，报告页底将以防篡改机制直接携带您的管理员账号信息、当前下载IP与微秒级高敏时间戳水印。
          </p>
        </div>
      </div>
    </div>
  );
}
