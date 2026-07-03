import * as React from "react";
import { 
  Download, 
  FileSpreadsheet, 
  Search, 
  RefreshCcw, 
  Send, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  History,
  FileCheck2,
  Trash2,
  Lock,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  FileX2
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

interface ExportApplicant {
  id: string;
  purpose: string;
  scope: string;
  reason: string;
  status: "draft" | "pending" | "processing" | "approved" | "rejected" | "expired";
  createdAt: string;
  operator: string;
  rejectionReason?: string;
  downloadUrl?: string;
  expiryDate?: string;
}

const INITIAL_REQUEST_LOGS: ExportApplicant[] = [
  {
    id: "EXP-2026-001",
    purpose: "荔湾区高血压并发症流调科研项目",
    scope: "2024-2025年 荔湾区 - 生物指标异常名单",
    reason: "用于心血管危险等级相关前瞻性关联分析，仅供统计教研室内部脱敏评估。",
    status: "approved",
    createdAt: "2026-05-28 09:12",
    operator: "张医研",
    downloadUrl: "#",
    expiryDate: "2026-06-05"
  },
  {
    id: "EXP-2026-002",
    purpose: "全市老年慢病肥胖率共患统计",
    scope: "2023年 全市 - BMI/腰围极度偏高档案",
    reason: "分析越秀区、海珠区常住人口膳食多病同患病规律。",
    status: "rejected",
    createdAt: "2026-05-30 14:20",
    operator: "张医研",
    rejectionReason: "申请导出范围超出其基层用户的角色权限。请缩减区域至本辖区后再提报。",
  },
  {
    id: "EXP-2026-003",
    purpose: "白云区同和街道体检结存报告",
    scope: "2024年 白云区 同和街道 - 全部随访记录",
    reason: "用于协助各社区居委开展失访人员的随访电话校对。",
    status: "pending",
    createdAt: "2026-06-01 10:15",
    operator: "白云公卫主管",
  }
];

export function CohortExportPage({ mode = "request" }: { mode?: "request" | "approve" }) {
  const [diseaseFilter, setDiseaseFilter] = React.useState("all");
  const [yearFilter, setYearFilter] = React.useState("all");
  const [districtFilter, setDistrictFilter] = React.useState("all");
  const [deceasedFilter, setDeceasedFilter] = React.useState("all");
  const [searchName, setSearchName] = React.useState("");
  const [searchIdCard, setSearchIdCard] = React.useState("");

  // Persistent shared state between Request and Approve screens using LocalStorage
  const [requestLogs, setRequestLogs] = React.useState<ExportApplicant[]>(() => {
    const saved = localStorage.getItem("export_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse request logs from localStorage", e);
      }
    }
    return INITIAL_REQUEST_LOGS;
  });

  React.useEffect(() => {
    localStorage.setItem("export_requests", JSON.stringify(requestLogs));
  }, [requestLogs]);

  const [hasSearched, setHasSearched] = React.useState(false);

  // Modal form states for requesting
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [exportPurpose, setExportPurpose] = React.useState("");
  const [exportScope, setExportScope] = React.useState("");
  const [exportReason, setExportReason] = React.useState("");
  const [resubmittingId, setResubmittingId] = React.useState<string | null>(null);

  // Inline audit state (for rejecting requests with reasons)
  const [rejectingId, setRejectingId] = React.useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = React.useState("");
  const [auditFilter, setAuditFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");

  // Simulated search list results
  const mockRecordList = [
    { id: "1", name: "张大爷", idCard: "4401031•••••••1234", year: "2023", district: "荔湾区", chronic: "高血压, 糖尿病", icd: "I10/E11", deceased: "存活" },
    { id: "2", name: "王伯伯", idCard: "4401111•••••••8888", year: "2023", district: "白云区", chronic: "慢性支气管炎", icd: "J41", deceased: "存活" },
    { id: "3", name: "刘阿姨", idCard: "4401061•••••••2222", year: "2023", district: "天河区", chronic: "糖尿病", icd: "E11", deceased: "存活" },
    { id: "4", name: "李奶奶", idCard: "4401031•••••••5678", year: "2023", district: "越秀区", chronic: "高血压, 冠心病", icd: "I10/I25", deceased: "已死亡 (2024)" },
  ];

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleReset = () => {
    setDiseaseFilter("all");
    setYearFilter("all");
    setDistrictFilter("all");
    setDeceasedFilter("all");
    setSearchName("");
    setSearchIdCard("");
    setHasSearched(false);
  };

  const handleOpenSubmit = () => {
    const sc = `【${yearFilter === "all" ? "全部年份" : yearFilter + "年"}】【${districtFilter === "all" ? "全市及辖区" : districtFilter}选区】【慢病:${diseaseFilter === "all" ? "不限" : diseaseFilter}】大类脱敏文件`;
    setExportScope(sc);
    setExportPurpose("");
    setExportReason("");
    setResubmittingId(null);
    setIsSubmitModalOpen(true);
  };

  const handleOpenResubmit = (log: ExportApplicant) => {
    setResubmittingId(log.id);
    setExportScope(log.scope);
    setExportPurpose(log.purpose);
    setExportReason(log.reason);
    setIsSubmitModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exportPurpose.trim() || !exportReason.trim()) {
      alert("请填写完整的导出用途与申请理由！");
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (resubmittingId) {
      setRequestLogs(prev => prev.map(log => {
        if (log.id === resubmittingId) {
          return {
            ...log,
            purpose: exportPurpose,
            scope: exportScope,
            reason: exportReason,
            status: "pending",
            createdAt: timestamp,
            rejectionReason: undefined
          };
        }
        return log;
      }));
    } else {
      const newRequest: ExportApplicant = {
        id: "EXP-2026-" + Math.floor(Math.random() * 900 + 100),
        purpose: exportPurpose,
        scope: exportScope,
        reason: exportReason,
        status: "pending",
        createdAt: timestamp,
        operator: "研究专员"
      };
      setRequestLogs(prev => [newRequest, ...prev]);
    }

    setIsSubmitModalOpen(false);
    alert("导出申请已成功提报！请在下方列表跟踪审批结果。");
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm("是否撤销/删除此条申请？")) {
      setRequestLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  // Actions for the Auditor (mode === "approve")
  const handleApproveRequest = (id: string) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const expiryStr = expiry.toISOString().replace('T', ' ').substring(0, 11);

    setRequestLogs(prev => prev.map(log => {
      if (log.id === id) {
        return {
          ...log,
          status: "approved",
          expiryDate: expiryStr,
          rejectionReason: undefined
        };
      }
      return log;
    }));
    alert("该导出请求已通过安全审核，已生成下载授权及加密安全凭记！");
  };

  const handleOpenRejectDialog = (id: string) => {
    setRejectingId(id);
    setRejectReasonInput("");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReasonInput.trim()) {
      alert("请填写驳回理由！");
      return;
    }

    setRequestLogs(prev => prev.map(log => {
      if (log.id === rejectingId) {
        return {
          ...log,
          status: "rejected",
          rejectionReason: rejectReasonInput
        };
      }
      return log;
    }));

    setRejectingId(null);
    setRejectReasonInput("");
    alert("已将该数据导出申请驳回，并附带了具体的安全整改意见。");
  };

  const getStatusBadge = (status: ExportApplicant["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><CheckCircle className="w-3 h-3 mr-1" /> 审批通过</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none animate-pulse"><Clock className="w-3 h-3 mr-1" /> 待审批</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock className="w-3 h-3 mr-1" /> 数据打包中</Badge>;
      case "rejected":
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none"><XCircle className="w-3 h-3 mr-1" /> 申请驳回</Badge>;
      case "expired":
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none"><AlertTriangle className="w-3 h-3 mr-1" /> 链接已过期</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none">草稿</Badge>;
    }
  };

  const filteredRequestsForAudit = requestLogs.filter(log => {
    if (auditFilter === "all") return true;
    return log.status === auditFilter;
  });

  const pendingCount = requestLogs.filter(l => l.status === "pending").length;
  const approvedCount = requestLogs.filter(l => l.status === "approved").length;
  const rejectedCount = requestLogs.filter(l => l.status === "rejected").length;

  if (mode === "approve") {
    // AUDITOR INTERFACE (审核导出)
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              <span>老年队列数据导出安全审核</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              保密合规官和公卫数据管理员专用终端：负责审查队列数据导出目的、关联研究课题和审计日志。
            </p>
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <Lock className="w-3 h-3 mr-1" /> 管理员合规审计中
          </Badge>
        </div>

        {/* Dynamic Auditor Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">待审核申请数</p>
                <h3 className="text-xl font-bold text-gray-900">{pendingCount} 件</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">累计批准导出</p>
                <h3 className="text-xl font-bold text-gray-900">{approvedCount} 件</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
                <FileX2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">安全驳回件数</p>
                <h3 className="text-xl font-bold text-gray-900">{rejectedCount} 件</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-indigo-50/20">
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-indigo-600/70 font-semibold">安全脱敏级别</p>
                <h3 className="text-sm font-bold text-indigo-900">中国公卫GDPR极度脱敏</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs & Content Table */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">安全准入待决与历史决策列表</CardTitle>
              <CardDescription className="text-xs">
                双重审核规范，导出范围覆盖12个区县老年建档档案。
              </CardDescription>
            </div>
            {/* Elegant Selector Tab */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              <Button 
                variant={auditFilter === "all" ? "secondary" : "ghost"} 
                size="sm"
                className="h-7 text-xs font-medium" 
                onClick={() => setAuditFilter("all")}
              >
                全部 ({requestLogs.length})
              </Button>
              <Button 
                variant={auditFilter === "pending" ? "secondary" : "ghost"} 
                size="sm"
                className="h-7 text-xs font-medium text-blue-600" 
                onClick={() => setAuditFilter("pending")}
              >
                待审核 ({pendingCount})
              </Button>
              <Button 
                variant={auditFilter === "approved" ? "secondary" : "ghost"} 
                size="sm"
                className="h-7 text-xs font-medium text-green-600" 
                onClick={() => setAuditFilter("approved")}
              >
                已通过 ({approvedCount})
              </Button>
              <Button 
                variant={auditFilter === "rejected" ? "secondary" : "ghost"} 
                size="sm"
                className="h-7 text-xs font-medium text-rose-600" 
                onClick={() => setAuditFilter("rejected")}
              >
                已驳回 ({rejectedCount})
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequestsForAudit.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
                <FileCheck2 className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs">暂无筛选条件下的导出提报审批件。</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>单号</TableHead>
                    <TableHead>流调用途 / 数据范围 / 理由保证</TableHead>
                    <TableHead>提请时间</TableHead>
                    <TableHead>当前状态</TableHead>
                    <TableHead>提请人</TableHead>
                    <TableHead className="text-right">审核操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequestsForAudit.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/20">
                      <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
                      <TableCell className="max-w-[420px]">
                        <div className="font-semibold text-gray-800 text-xs">{log.purpose}</div>
                        <div className="text-[10px] text-indigo-600 mt-0.5 font-semibold">{log.scope}</div>
                        <div className="text-[11px] text-gray-500 mt-1 italic block max-w-md bg-slate-50 p-2 rounded-sm border border-slate-100">
                          <span className="font-bold not-italic">说明：</span>{log.reason}
                        </div>
                        {log.rejectionReason && (
                          <div className="bg-rose-50 text-rose-700 text-[10px] p-2 rounded mt-2 border border-rose-100/50">
                            <span className="font-bold">驳回裁决书：</span> {log.rejectionReason}
                          </div>
                        )}
                        {log.status === "approved" && log.expiryDate && (
                          <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-sm inline-block mt-2 font-mono">
                            授信单有效期至: {log.expiryDate} (数据服务已隔离生成)
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{log.createdAt}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="text-xs">{log.operator}</TableCell>
                      <TableCell className="text-right">
                        {log.status === "pending" ? (
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold h-8 gap-1"
                              onClick={() => handleApproveRequest(log.id)}
                            >
                              <ThumbsUp className="w-3 h-3" /> 同意
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50 text-xs font-semibold h-8 gap-1"
                              onClick={() => handleOpenRejectDialog(log.id)}
                            >
                              <ThumbsDown className="w-3 h-3" /> 驳回
                            </Button>
                          </div>
                        ) : log.status === "approved" ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 pointer-events-none">
                            已签署授权
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-100 pointer-events-none">
                            已裁决驳回
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reject Dialog Popup */}
        {rejectingId && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg border max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b bg-rose-50/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>批示驳回意见: {rejectingId}</span>
                </h2>
                <button 
                  onClick={() => setRejectingId(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmReject} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">填写详细驳回意见或安全整改提示：</label>
                  <textarea 
                    placeholder="例如：申请导出范围中包含本区县以外的其他街道，请在导出条件中剔除以满足最小限度获取原则。或者说明研究用途不详，请重填关联课题。" 
                    value={rejectReasonInput} 
                    onChange={(e) => setRejectReasonInput(e.target.value)} 
                    className="w-full min-h-[110px] border border-rose-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-500 outline-none"
                    required 
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" className="h-8.5 text-xs" onClick={() => setRejectingId(null)}>
                    取消
                  </Button>
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-xs h-8.5 gap-1.5 text-white">
                    <ThumbsDown className="w-3.5 h-3.5" /> 确认签署驳回
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // APPLICANT INTERFACE (申请导出)
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">老年队列数据安全导出申请</h1>
          <p className="text-sm text-gray-500 mt-1">
            配置研究队列的筛选组合，在下方预览脱敏成集效果，继而向管理层提交安全审批，以获得加密导出。
          </p>
        </div>
      </div>

      {/* Grid of multi-dimensional filtering */}
      <Card className="border-none shadow-sm space-y-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">疾病诊断情况</span>
              <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                  <SelectValue placeholder="全慢病筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限慢病类型</SelectItem>
                  <SelectItem value="高血压">高血压</SelectItem>
                  <SelectItem value="糖尿病">糖尿病</SelectItem>
                  <SelectItem value="冠心病">冠心病</SelectItem>
                  <SelectItem value="慢性支气管炎">慢性支气管炎</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">检查年度</span>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                  <SelectValue placeholder="年度筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限年份</SelectItem>
                  <SelectItem value="2024">2024年</SelectItem>
                  <SelectItem value="2023">2023年</SelectItem>
                  <SelectItem value="2022">2022年</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">归属辖区县</span>
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                  <SelectValue placeholder="选择所属区县" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全市 (12个区县)</SelectItem>
                  <SelectItem value="荔湾区">荔湾区</SelectItem>
                  <SelectItem value="越秀区">越秀区</SelectItem>
                  <SelectItem value="白云区">白云区</SelectItem>
                  <SelectItem value="天河区">天河区</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">慢病死亡随访情况</span>
              <Select value={deceasedFilter} onValueChange={setDeceasedFilter}>
                <SelectTrigger className="w-full bg-slate-50 border-gray-100">
                  <SelectValue placeholder="生存死亡情况" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">生存+包含死亡归档</SelectItem>
                  <SelectItem value="living">仅限生存者队列</SelectItem>
                  <SelectItem value="deceased">已死亡（已归档）人群</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase">长者姓名</span>
              <Input 
                placeholder="请输入长者姓名模糊匹配" 
                value={searchName} 
                onChange={(e) => setSearchName(e.target.value)} 
                className="bg-slate-50 border-gray-100 h-9"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">身份证 ID / 证件号</span>
              <Input 
                placeholder="请输入精确18位身份证号检索" 
                value={searchIdCard} 
                onChange={(e) => setSearchIdCard(e.target.value)} 
                className="bg-slate-50 border-gray-100 h-9 animate-fade-in"
              />
            </div>

            <div className="flex gap-2 items-end pt-1">
              <Button variant="outline" className="h-9 flex-1 gap-1.5" onClick={handleReset}>
                <RefreshCcw className="w-3.5 h-3.5" /> 重置
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 h-9 flex-1 gap-1.5" onClick={handleSearch}>
                <Search className="w-3.5 h-3.5" /> 检索预览
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Query Preview Section */}
      {hasSearched ? (
        <Card className="border-none shadow-sm animate-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="pb-3 border-b flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold">检索预览 (已根据查询条件匹配到 4 本常住老人档案)</CardTitle>
              <CardDescription className="text-xs">
                出于个人数据安全，所有敏感信息已于前端脱敏。批量完整导出包含该人群的多维档案。
              </CardDescription>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-1.5 h-9 shrink-0" onClick={handleOpenSubmit}>
              <Send className="w-4 h-4" /> 申请数据导出并提交审核
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>脱敏证件号</TableHead>
                  <TableHead>年份</TableHead>
                  <TableHead>区县</TableHead>
                  <TableHead>主要慢性病</TableHead>
                  <TableHead>ICD-10</TableHead>
                  <TableHead>随访结局</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecordList.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-semibold text-gray-800">{rec.name}</TableCell>
                    <TableCell className="font-mono text-xs">{rec.idCard}</TableCell>
                    <TableCell>{rec.year}年</TableCell>
                    <TableCell>{rec.district}</TableCell>
                    <TableCell>{rec.chronic}</TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">{rec.icd}</TableCell>
                    <TableCell>
                      {rec.deceased.includes("死亡") ? (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">{rec.deceased}</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{rec.deceased}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm h-36 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
          <FileSpreadsheet className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-xs">请配置上方随访、区县及年份的过滤项，点击“检索预览”核查符合区域老龄数据集。</p>
        </Card>
      )}

      {/* Approval and Logs */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">我的数据安全导出申请记录</CardTitle>
            <CardDescription className="text-xs">
              跟踪本账户提请的流调和统计导出安全状态批号。通过后可在 7 天内解密下载数据包。
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <Lock className="w-3 h-3 mr-1" /> 已接入合规机制
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>申请单号</TableHead>
                <TableHead>导出用途与范围描述</TableHead>
                <TableHead>提请时间</TableHead>
                <TableHead>当前审批状态</TableHead>
                <TableHead>提报人</TableHead>
                <TableHead className="text-right">工作指令</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/20">
                  <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
                  <TableCell className="max-w-[420px]">
                    <div className="font-semibold text-gray-800 text-xs truncate">{log.purpose}</div>
                    <div className="text-[10px] text-indigo-600 mt-0.5 font-bold">{log.scope}</div>
                    <div className="text-[11px] text-gray-500 mt-1 italic block max-w-sm truncate">{log.reason}</div>
                    {log.rejectionReason && (
                      <div className="bg-rose-50 text-rose-700 text-[10px] p-2.5 rounded mt-2 border border-rose-100">
                        <span className="font-bold block text-rose-900 mb-0.5">⚠️ 合规部驳回意见:</span> 
                        {log.rejectionReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{log.createdAt}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-xs">{log.operator}</TableCell>
                  <TableCell className="text-right">
                    {log.status === "approved" && (
                      <div className="space-y-1">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs h-8 gap-1.5"
                          onClick={() => alert(`正在解密批交数据... \n已生成安全令牌 ${log.id} \n已将包含4条脱敏及体检完整归档信息的 Excel 包安全写入下载通道。`)}
                        >
                          <Download className="w-3 h-3" /> 下载 (Excel/CSV)
                        </Button>
                        <div className="text-[9px] text-gray-400 block pr-1">
                          有效期至: {log.expiryDate}
                        </div>
                      </div>
                    )}
                    {log.status === "rejected" && (
                      <div className="flex justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 h-8"
                          onClick={() => handleOpenResubmit(log)}
                        >
                          重调条件并提报
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 h-8 font-semibold"
                          onClick={() => handleDeleteRequest(log.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                    {log.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8"
                        onClick={() => handleDeleteRequest(log.id)}
                      >
                        撤销申请
                      </Button>
                    )}
                    {log.status === "expired" && (
                      <span className="text-xs text-gray-400 italic">包已清理</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Safety Policy Hint */}
      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex gap-4 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">老年健康网络脱敏规范与导出准则:</p>
          <p>1. 数据包包含患者姓名、年龄、家族用药清单，符合中国GDPR、网络数据安全法。导出日志将纳入各区卫健审计追责凭证。</p>
          <p>2. 科研成果发表时需声明在多学科公卫体系下的归口，不得泄露参与队列高龄老人的具体身份证详情与详细门牌居住信息。</p>
        </div>
      </div>

      {/* Request Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                {resubmittingId ? `修改导出安全提报: ${resubmittingId}` : "提请队列数据安全导出申请"}
              </h2>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">自动解析的导出范围 (不可更改)</label>
                <Input value={exportScope} className="bg-slate-100 cursor-not-allowed text-xs font-mono" readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">导出目的/关联研究课题</label>
                <Input 
                  placeholder="例：2026年度基层慢性非传染病分级治理流调课题" 
                  value={exportPurpose} 
                  onChange={(e) => setExportPurpose(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">研究用途、使用人安全说明及审计保证描述</label>
                <textarea 
                  placeholder="详情补充具体如何脱敏，如何保证数据仅限于该课题不予以二次网络分发，保障患者知情权限。" 
                  value={exportReason} 
                  onChange={(e) => setExportReason(e.target.value)} 
                  className="w-full min-h-[100px] border rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  required 
                />
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-lg text-[10px] text-indigo-900 leading-normal">
                安全承诺：本人确认此数据仅供特定研究所用。导出文件名中将不携带完整的真实身份证，对未公开的成果将遵循数据隔离原则存放安全终端。
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" className="h-9" onClick={() => setIsSubmitModalOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-9 gap-1.5">
                  <Send className="w-4 h-4" /> 提报安全审批网关
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
