import * as React from "react";
import { 
  HeartCrack, 
  Search, 
  RefreshCcw, 
  Archive, 
  CheckCircle, 
  AlertTriangle, 
  Building,
  Info,
  Calendar,
  XCircle,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  SelectValue,
} from "@/components/ui/select";

interface DeceasedRecord {
  idCard: string;
  name: string;
  county: string;
  town: string;
  deathDate: string;
  causeOfDeath: string;
  icd10: string;
  matchedSource: string;
  archiveStatus: "pending" | "archived";
  archiveDate?: string;
  operator?: string;
}

const INITIAL_DECEASED: DeceasedRecord[] = [
  {
    idCard: "440103194505205678",
    name: "李奶奶",
    county: "越秀区",
    town: "北京街道",
    deathDate: "2024-03-12",
    causeOfDeath: "急性心肌梗死",
    icd10: "I21.9",
    matchedSource: "全民健康信息平台 & 市公安死亡人口比对",
    archiveStatus: "archived",
    archiveDate: "2024-03-24",
    operator: "张医疗"
  },
  {
    idCard: "440111194208081234",
    name: "陈大爷",
    county: "白云区",
    town: "同和街道",
    deathDate: "2025-11-20",
    causeOfDeath: "肺源性心脏病",
    icd10: "I27.9",
    matchedSource: "民政殡葬网络数据比对",
    archiveStatus: "pending",
  },
  {
    idCard: "440106193910106666",
    name: "魏大叔",
    county: "天河区",
    town: "石牌街道",
    deathDate: "2026-02-15",
    causeOfDeath: "阿尔茨海默病 (晚期衰竭)",
    icd10: "G30.9",
    matchedSource: "跨省医保异地结算死亡退保记录",
    archiveStatus: "pending",
  }
];

export function DeathArchivingPage() {
  const [records, setRecords] = React.useState<DeceasedRecord[]>(INITIAL_DECEASED);
  const [countyFilter, setCountyFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchVal, setSearchVal] = React.useState("");

  // Review modal
  const [selectedRecord, setSelectedRecord] = React.useState<DeceasedRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleArchiveSingle = (idCard: string) => {
    const timestamp = new Date().toISOString().substring(0, 10);
    setRecords(prev => prev.map(rec => {
      if (rec.idCard === idCard) {
        return {
          ...rec,
          archiveStatus: "archived",
          archiveDate: timestamp,
          operator: "当前公卫审核员"
        };
      }
      return rec;
    }));
    alert("该长者建档档案已正式予以【死亡归档】。系统已联动更新其时间线状态、年度在册基盘与多病种随访模型。");
  };

  const handleBatchArchive = () => {
    const pendings = records.filter(r => r.archiveStatus === "pending");
    if (pendings.length === 0) {
      alert("当前没有待复核的死亡档案。");
      return;
    }
    if (confirm(`是否一键将当前所有的 ${pendings.length} 名待核定死亡长者进行批量归档归藏？`)) {
      const timestamp = new Date().toISOString().substring(0, 10);
      setRecords(prev => prev.map(rec => {
        if (rec.archiveStatus === "pending") {
          return {
            ...rec,
            archiveStatus: "archived",
            archiveDate: timestamp,
            operator: "超级管理员批量"
          };
        }
        return rec;
      }));
      alert("批量一键归档成功！");
    }
  };

  const handleResetRecord = (idCard: string) => {
    if (confirm("是否撤回归档，使其重新进入‘待复核’生命周期节点？")) {
      setRecords(prev => prev.map(rec => {
        if (rec.idCard === idCard) {
          return {
            ...rec,
            archiveStatus: "pending",
            archiveDate: undefined,
            operator: undefined
          };
        }
        return rec;
      }));
    }
  };

  const filteredRecords = records.filter(item => {
    const matchCounty = countyFilter === "all" || item.county === countyFilter;
    const matchStatus = statusFilter === "all" || item.archiveStatus === statusFilter;
    const matchText = searchVal === "" || 
      item.name.includes(searchVal) || 
      item.idCard.includes(searchVal) || 
      item.causeOfDeath.includes(searchVal);
    
    return matchCounty && matchStatus && matchText;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HeartCrack className="w-5 h-5 text-gray-500" />
            <span>死亡信息归档管理</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            比对公安户籍、民政殡葬及公卫平台直报系统，对随访队列中确认终反应的高龄死亡长者档案进行结案、确诊因分析与归类。
          </p>
        </div>
        <Button className="bg-slate-700 hover:bg-slate-800 gap-1.5 h-9" onClick={handleBatchArchive}>
          <Archive className="w-4 h-4" /> 批量一键归档
        </Button>
      </div>

      {/* Query filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">所属公卫区县</span>
            <Select value={countyFilter} onValueChange={setCountyFilter}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9">
                <SelectValue placeholder="全部区县" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全公区</SelectItem>
                <SelectItem value="荔湾区">荔湾区</SelectItem>
                <SelectItem value="越秀区">越秀区</SelectItem>
                <SelectItem value="白云区">白云区</SelectItem>
                <SelectItem value="天河区">天河区</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">复核归档节点</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部历史状态</SelectItem>
                <SelectItem value="pending">待复核 (系统初筛匹配)</SelectItem>
                <SelectItem value="archived">已复核 (确认死亡归档)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 ">
            <span className="text-xs font-semibold text-gray-500 uppercase">查找长者</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索姓名、死亡因或原证号..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="pl-9 h-9" 
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="h-9 w-full gap-1.5" onClick={() => { setCountyFilter("all"); setStatusFilter("all"); setSearchVal(""); }}>
              <RefreshCcw className="w-3.5 h-3.5" /> 重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>身份证标识 & 姓名</TableHead>
                <TableHead>原公卫属区</TableHead>
                <TableHead>系统匹配死亡时间</TableHead>
                <TableHead>核心死因明细</TableHead>
                <TableHead>ICD-10码</TableHead>
                <TableHead>可信匹配源</TableHead>
                <TableHead>复核归并状态</TableHead>
                <TableHead className="text-right">审核选项</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <TableRow key={rec.idCard} className="hover:bg-slate-50/20 text-xs">
                    <TableCell>
                      <div className="font-semibold text-slate-800">{rec.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{rec.idCard}</div>
                    </TableCell>
                    <TableCell>{rec.county} / {rec.town}</TableCell>
                    <TableCell className="font-semibold text-rose-700 italic">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {rec.deathDate}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{rec.causeOfDeath}</TableCell>
                    <TableCell className="font-mono text-xs">{rec.icd10}</TableCell>
                    <TableCell className="text-gray-500 max-w-[200px] truncate" title={rec.matchedSource}>
                      {rec.matchedSource}
                    </TableCell>
                    <TableCell>
                      {rec.archiveStatus === "archived" ? (
                        <div className="space-y-0.5">
                          <Badge className="bg-green-100 text-green-700 border-none hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> 已归档结案</Badge>
                          <div className="text-[9px] text-gray-400">
                            操作: {rec.operator}（{rec.archiveDate}）
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-none hover:bg-amber-200 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> 待核定匹配</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {rec.archiveStatus === "pending" ? (
                          <Button 
                            className="bg-slate-800 hover:bg-slate-900 text-white h-8 text-xs font-semibold gap-1"
                            onClick={() => handleArchiveSingle(rec.idCard)}
                          >
                            确认归档退出
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 h-8 text-xs"
                            onClick={() => handleResetRecord(rec.idCard)}
                          >
                            撤销死亡归档
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-slate-400 italic">
                    暂无符合条件的死亡核查单据记录。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info notice box */}
      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-4 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">死亡结项归并系统提示:</p>
          <p>
            1. 一经确认归档，该身份证号下的档案将自动从各社区家庭医生服务系统的“活跃体检督促名单”中剔除，不再参与各乡镇月度常住人口失访提醒统计。
          </p>
          <p>
            2. 根本死因采用国际 ICD-10 标准，有利于在统计分析随访模块进行多因合并生存周期和心律等并发终点趋势评估。
          </p>
        </div>
      </div>
    </div>
  );
}
