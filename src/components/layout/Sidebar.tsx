
import * as React from "react";
import { 
  Users, 
  FileText, 
  ClipboardCheck, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  UserCog,
  ChevronDown,
  ChevronRight,
  Database,
  Map,
  Download,
  AlertTriangle,
  HeartCrack,
  TrendingUp,
  Tv2,
  Dna,
  FlaskConical,
  Activity,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  icon?: React.ReactNode;
  id: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "基本信息维护",
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    id: "basic-info-folder",
    children: [
      { title: "老年队列构建简介", id: "introduction", icon: <FileText className="w-4 h-4 text-emerald-400" /> },
      { title: "人口信息维护", id: "population-maintenance", icon: <Users className="w-4 h-4 text-emerald-400" /> },
      { title: "区县及乡镇信息维护", id: "district-maintenance", icon: <Map className="w-4 h-4 text-emerald-400" /> },
    ]
  },
  {
    title: "老年人队列数据导入与导出",
    icon: <ClipboardCheck className="w-4 h-4 text-blue-400" />,
    id: "data-io-folder",
    children: [
      {
        title: "老年人基础信息",
        icon: <FileText className="w-4 h-4 text-blue-400" />,
        id: "elderly-basic-info-folder",
        children: [
          { title: "基础信息导入", id: "profiling", icon: <FileText className="w-4 h-4 text-blue-400" /> },
        ]
      },
      {
        title: "老年人体检信息",
        icon: <ClipboardCheck className="w-4 h-4 text-blue-400" />,
        id: "exam-data-folder",
        children: [
          { title: "体检基本信息导入", id: "exam-data", icon: <ClipboardCheck className="w-4 h-4 text-blue-400" /> },
          { title: "基本信息查询", id: "basic-info-query", icon: <Search className="w-4 h-4 text-blue-400" /> },
        ]
      },
      {
        title: "老年队列数据导出",
        id: "cohort-export-folder",
        icon: <Download className="w-4 h-4 text-blue-400" />,
        children: [
          { title: "申请导出", id: "export-request", icon: <FileText className="w-4 h-4 text-blue-400" /> },
          { title: "审核导出", id: "export-approve", icon: <ShieldCheck className="w-4 h-4 text-blue-400" /> },
        ]
      },
    ]
  },
  {
    title: "队列随访信息",
    icon: <Activity className="w-4 h-4 text-orange-400" />,
    id: "followup-folder",
    children: [
      { title: "查询队列随访情况", id: "follow-up-query", icon: <Search className="w-4 h-4 text-orange-400" /> },
      { title: "失访者随访提醒", id: "lost-follow-up", icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
      { title: "死亡信息归档", id: "death-archiving", icon: <HeartCrack className="w-4 h-4 text-orange-400" /> },
    ]
  },
  {
    title: "统计分析",
    icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
    id: "stats-folder",
    children: [
      { title: "老年人健康指标", id: "health-indicator-trends", icon: <TrendingUp className="w-4 h-4 text-indigo-400" /> },
      { title: "健康统计表", id: "health-stats-table", icon: <FileSpreadsheet className="w-4 h-4 text-indigo-400" /> },
      { title: "健康统计演示和导出", id: "health-stats-export", icon: <Tv2 className="w-4 h-4 text-indigo-400" /> },
    ]
  },
  {
    title: "生物标本",
    icon: <FlaskConical className="w-4 h-4 text-pink-400" />,
    id: "specimens-folder",
    children: [
      { title: "生物标本", id: "specimens", icon: <Dna className="w-4 h-4 text-pink-400" /> },
    ]
  },
  {
    title: "用户配置权限",
    icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    id: "permissions-folder",
    children: [
      { title: "角色层级管理", id: "roles", icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
      { title: "公卫用户管理", id: "users", icon: <UserCog className="w-4 h-4 text-purple-400" /> },
    ]
  }
];

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export function Sidebar({ activeId, onNavigate }: SidebarProps) {
  const [expanded, setExpanded] = React.useState<string[]>([
    "basic-info-folder", 
    "data-io-folder", 
    "elderly-basic-info-folder",
    "exam-data-folder",
    "followup-folder", 
    "stats-folder", 
    "specimens-folder"
  ]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded.includes(item.id);
    const isActive = activeId === item.id;

    return (
      <div key={item.id} className="space-y-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
            onNavigate(item.id);
          }}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
            level === 0 ? "font-semibold tracking-wide" : "font-normal",
            isActive 
              ? "bg-blue-600 text-white shadow-sm font-semibold" 
              : hasChildren && level === 0 
                ? "hover:bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
            level > 0 && "ml-0"
          )}
        >
          <div className="flex items-center gap-2.5 truncate max-w-[210px]">
            {item.icon}
            <span className="truncate">{item.title}</span>
            {item.id === "lost-follow-up" && (
              <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-none shrink-0 ml-1 animate-pulse">
                3
              </span>
            )}
          </div>
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className={cn(
            "space-y-1 border-l border-slate-800",
            level === 0 ? "ml-4 pl-2" : "ml-6 pl-2"
          )}>
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-[#0a122c] text-white flex flex-col h-screen shrink-0 shadow-xl border-r border-[#1a233d]">
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center shadow-md shadow-blue-500/20">
          <Activity className="text-white w-4 h-4 animate-pulse" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-sm tracking-tight truncate">健康队列公卫管理系统</h1>
          <span className="text-[10px] text-emerald-400 font-semibold block">四期综合科研级</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-2 space-y-2">
          {NAV_ITEMS.map((item) => renderNavItem(item))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-800 text-[10px] text-white/30 text-center">
        © 2026 老年健康队列管理平台 v4
      </div>
    </div>
  );
}
