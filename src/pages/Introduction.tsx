import * as React from "react";
import { 
  MapPin, 
  CalendarDays,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const cdcBanner = "/src/assets/images/chongqing_cdc_banner_1780391574990.png";

export function IntroductionPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header Area */}
      <div className="relative overflow-hidden rounded-2xl text-white p-8 md:p-12 shadow-md min-h-[320px] flex items-center">
        {/* Background Image */}
        <img 
          src={cdcBanner} 
          alt="重庆市疾病预防控制中心" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        {/* Elegant overlay to ensure text is perfectly legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-900/20 z-0"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 text-xs px-3 py-1 font-medium">
            国家重点公共卫生监测项目
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            老年人健康队列构建与智能分析平台
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-normal leading-relaxed max-w-2xl">
            本平台面向大规模特定地区老年群体，通过健康建档、年度体检数据导入、定期微观随访与直报匹配，深入追踪慢病结局事件，为基层公卫服务与流行病学研究提供全周期科研数据资产。
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>覆盖12个区县</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-200 border-l border-white/20 pl-4">
              <CalendarDays className="w-3.5 h-3.5 text-blue-300" />
              <span>追踪年限: 2019 - 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-200 border-l border-white/20 pl-4">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>三级等保安全合规</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
