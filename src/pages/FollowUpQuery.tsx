import * as React from "react";
import { 
  Search, 
  RefreshCcw, 
  Plus, 
  HelpCircle, 
  Activity, 
  HeartCrack, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  Check,
  Filter,
  ChevronRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// Import modular data structures and child widgets
import { 
  FollowUpMockPerson, 
  INITIAL_MOCK_PEOPLE, 
  CHRONIC_DISEASE_OPTIONS, 
  DISTRICT_TOWNS 
} from "@/data/followup_data";
import { FollowUpDrawer } from "@/components/followup/FollowUpDrawer";
import { HistoryDialog } from "@/components/followup/HistoryDialog";

// Toast Interface
interface ToastNotification {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
  description?: string;
}

export function FollowUpQueryPage() {
  // Main state holding the list of people
  const [people, setPeople] = React.useState<FollowUpMockPerson[]>(() => {
    // Attempt local storage retrieve for beautiful refresh-resilience
    const saved = localStorage.getItem("remix_followup_people");
    return saved ? JSON.parse(saved) : INITIAL_MOCK_PEOPLE;
  });

  // Save changes helper
  const savePeopleState = (updatedList: FollowUpMockPerson[]) => {
    setPeople(updatedList);
    localStorage.setItem("remix_followup_people", JSON.stringify(updatedList));
  };

  // Toast array state
  const [toasts, setToasts] = React.useState<ToastNotification[]>([]);

  // Show customized Toast notifications
  const triggerToast = (type: "success" | "warning" | "info", message: string, description?: string) => {
    const newId = Math.random().toString(36).substring(2, 9);
    const toast: ToastNotification = { id: newId, type, message, description };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newId));
    }, 5500);
  };

  // Query and Filter states (Active values in form inputs)
  const [filterIdCard, setFilterIdCard] = React.useState<string>("");
  const [filterGender, setFilterGender] = React.useState<string>("全部");
  const [filterEthnicity, setFilterEthnicity] = React.useState<string>("全部");
  const [filterCounty, setFilterCounty] = React.useState<string>("全部");
  const [selectedChronicDiseases, setSelectedChronicDiseases] = React.useState<string[]>([]);

  // Applied filter state (Triggered when clicking "查询" / Reset)
  const [appliedFilters, setAppliedFilters] = React.useState({
    idCard: "",
    gender: "全部",
    ethnicity: "全部",
    county: "全部",
    chronicDiseases: [] as string[]
  });

  // Action Drawer / Dialog trigger states
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);
  const [selectedPersonForFollow, setSelectedPersonForFollow] = React.useState<FollowUpMockPerson | null>(null);

  const [isOpenHistory, setIsOpenHistory] = React.useState<boolean>(false);
  const [selectedPersonForHistory, setSelectedPersonForHistory] = React.useState<FollowUpMockPerson | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 10;

  // Toggle chronic disease selection in filter panel
  const handleToggleDiseaseFilter = (disease: string) => {
    setSelectedChronicDiseases(prev => 
      prev.includes(disease) 
        ? prev.filter(d => d !== disease) 
        : [...prev, disease]
    );
  };

  // Handle Query Trigger
  const handleApplyFilter = () => {
    setAppliedFilters({
      idCard: filterIdCard.trim(),
      gender: filterGender,
      ethnicity: filterEthnicity,
      county: filterCounty,
      chronicDiseases: [...selectedChronicDiseases]
    });
    setCurrentPage(1);
    triggerToast("info", "查询筛选成功", `为您检索到相应的筛查队列老人数据。`);
  };

  // Handle Reset Trigger
  const handleResetFilters = () => {
    setFilterIdCard("");
    setFilterGender("全部");
    setFilterEthnicity("全部");
    setFilterCounty("全部");
    setSelectedChronicDiseases([]);

    setAppliedFilters({
      idCard: "",
      gender: "全部",
      ethnicity: "全部",
      county: "全部",
      chronicDiseases: []
    });
    setCurrentPage(1);
    triggerToast("success", "已重置检索环境", "条件清除完毕，表格已切换回默认数据集。");
  };

  // Apply actual filtering logic based on appliedFilters values
  const filteredPeople = people.filter(p => {
    // 1. ID card match (precise and partial search)
    if (appliedFilters.idCard) {
      const match = p.idCard.toLowerCase().includes(appliedFilters.idCard.toLowerCase()) || 
                    p.id.includes(appliedFilters.idCard);
      if (!match) return false;
    }

    // 2. Gender match
    if (appliedFilters.gender !== "全部" && p.gender !== appliedFilters.gender) {
      return false;
    }

    // 3. Ethnicity match
    if (appliedFilters.ethnicity !== "全部" && p.ethnicity !== appliedFilters.ethnicity) {
      return false;
    }

    // 4. District/Town match
    if (appliedFilters.county !== "全部" && p.county !== appliedFilters.county) {
      return false;
    }

    // 5. Chronic diseases match (Matches list of applied selectors: AND logic or OR depending on check. Let's do OR match for patient diseases list)
    if (appliedFilters.chronicDiseases.length > 0) {
      // Return true if senior has at least one of selected filters
      const hasDisease = appliedFilters.chronicDiseases.some(d => 
        p.diseases.some(pd => pd.includes(d))
      );
      if (!hasDisease) return false;
    }

    return true;
  });

  // Calculate pages
  const totalCount = filteredPeople.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedPeople = filteredPeople.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Status Badge Helper
  const getStatusBadge = (person: FollowUpMockPerson) => {
    switch (person.status) {
      case "active":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs text-[10px] hover:bg-emerald-50"><CheckCircle2 className="w-3 h-3 mr-1" /> 随访健在</Badge>;
      case "lost":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] hover:bg-amber-50"><AlertTriangle className="w-3 h-3 mr-1" /> 已失访</Badge>;
      case "deceased":
        return <Badge className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] hover:bg-slate-100"><HeartCrack className="w-3 h-3 mr-1" /> 核实已故(归档)</Badge>;
      case "new_outcome":
        return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold animate-pulse hover:bg-rose-50"><Activity className="w-3 h-3 mr-1" /> 随访新发慢病</Badge>;
    }
  };

  // Open "新增随访" Form Drawer
  const handleOpenFollowUp = (person: FollowUpMockPerson) => {
    setSelectedPersonForFollow(person);
    setIsOpenDrawer(true);
  };

  // Save new follow-up callback
  const handleSaveFollowUp = (
    personId: string, 
    updatedData: { 
      diseases: string[]; 
      isDeceased: boolean; 
      deathDate?: string; 
      lastFollowUpDate: string; 
      lastFollowUpMethod: string; 
      lastFollowUpInvestigator: string; 
      status: "active" | "deceased" | "lost" | "new_outcome"; 
    }
  ) => {
    const updatedList = people.map(p => {
      if (p.id === personId) {
        return {
          ...p,
          diseases: updatedData.diseases,
          status: updatedData.status,
          deathStatus: updatedData.isDeceased 
            ? `${updatedData.deathDate || updatedData.lastFollowUpDate} 去世` 
            : "-",
          lastFollowUpDate: updatedData.lastFollowUpDate,
          lastFollowUpMethod: updatedData.lastFollowUpMethod,
          lastFollowUpInvestigator: updatedData.lastFollowUpInvestigator
        };
      }
      return p;
    });

    savePeopleState(updatedList);
    setIsOpenDrawer(false);

    // Trigger Success Notification Dialogue
    triggerToast(
      "success", 
      "随访记录已保存，并同步更新老年人体检数据", 
      `已保存 ${selectedPersonForFollow?.name} 在 ${updatedData.lastFollowUpDate} 日的随访病志（方式：${updatedData.lastFollowUpMethod}，调查员：${updatedData.lastFollowUpInvestigator}）。体检判定更新为：[${updatedData.status === "deceased" ? "健在否：死亡重估" : "健在：合并症更新"}]`
    );
    setSelectedPersonForFollow(null);
  };

  // Open "历史记录" Dialog
  const handleOpenHistory = (person: FollowUpMockPerson) => {
    setSelectedPersonForHistory(person);
    setIsOpenHistory(true);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Dynamic Slide-in Toast Container */}
      <div className="fixed top-5 right-5 z-[100] space-y-3 max-w-md w-full">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-lg shadow-xl border flex gap-3 animate-in fade-in slide-in-from-right-5 duration-300 ${
              t.type === "success" ? "bg-teal-50 border-teal-200 text-teal-950" :
              t.type === "warning" ? "bg-red-50 border-red-200 text-red-950" :
              "bg-blue-50 border-blue-200 text-blue-950"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
              {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-red-650" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold">{t.message}</h4>
              {t.description && <p className="text-[11px] leading-relaxed opacity-90">{t.description}</p>}
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="ml-auto text-slate-400 hover:text-slate-700 self-start text-xs font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
            <span>基础公共卫生后台</span> <ChevronRight className="w-3 h-3" /> <span>队列随访信息</span> <ChevronRight className="w-3 h-3" /> <span className="text-slate-800">查询随访情况</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Activity className="w-6.5 h-6.5 text-teal-600" />
            查询队列随访情况
          </h1>
          <p className="text-xs mt-1.5 text-slate-500 leading-relaxed max-w-2xl">
            提供给基层卫生服务中心、镇卫生院建档人员调取重点老人的筛查结果，并录入、跟进最新的日常合并症随访志、自理能力评估，并可对异地死亡仓数据进行跨网络直报互审。
          </p>
        </div>
        
        {/* Grassroot Permission Header badge */}
        <div className="text-[11px] self-start sm:self-center bg-teal-50 border border-teal-150 p-2.5 rounded-lg flex items-center gap-2 text-teal-900 shadow-sm shrink-0">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <span className="block font-bold">基层随访账户：金花社区服务站</span>
            <span className="text-slate-400 text-[9px] block">权限模式：辖区老年数据双重防护过滤</span>
          </div>
        </div>
      </div>

      {/* Statistics indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "辖区纳入随访人口", count: people.length, suffix: "人", sub: "100%全人群比对覆盖", color: "text-slate-800" },
          { title: "在世管辖活跃状态", count: people.filter(p => !p.deathStatus.includes("去世")).length, suffix: "人", sub: "已建档长者持续督导", color: "text-emerald-700 bg-emerald-50/20" },
          { title: "核死归档数", count: people.filter(p => p.deathStatus.includes("去世")).length, suffix: "人", sub: "死亡数据仓直核结算", color: "text-slate-500 bg-slate-50" },
          { title: "随访判定失访数", count: people.filter(p => p.status === "lost").length, suffix: "人", sub: "重点关注，亟需联系", color: "text-amber-700 bg-amber-50/20" }
        ].map((kpi, idx) => (
          <Card key={idx} className="border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 bg-white">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold text-slate-500">{kpi.title}</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold tracking-tight ${kpi.color}`}>{kpi.count}</span>
                <span className="text-xs text-slate-400">{kpi.suffix}</span>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-400 py-0.5 px-1.5 rounded self-start">{kpi.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Side Card Container (筛选区) */}
      <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden" id="filter-container">
        
        {/* Filter Title Header */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-teal-600" />
            老年人随访数据综合检索与多维筛选中心
          </span>
          <span className="text-[10px] text-slate-400">支持精准与病理交叉检索</span>
        </div>

        <div className="p-5.5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Field 1: 身份证号/身份ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="filter-idcard-input">身份证号/身份ID</label>
              <Input 
                id="filter-idcard-input"
                placeholder="请输入精确身份证或ID"
                value={filterIdCard}
                onChange={(e) => setFilterIdCard(e.target.value)}
                className="bg-white text-xs"
              />
            </div>

            {/* Field 2: 性别 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="filter-gender-select">性别</label>
              <select 
                id="filter-gender-select"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="全部">全部性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>

            {/* Field 3: 民族 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="filter-ethnicity-select">民族</label>
              <select 
                id="filter-ethnicity-select"
                value={filterEthnicity}
                onChange={(e) => setFilterEthnicity(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="全部">全部民族</option>
                <option value="汉族">汉族</option>
                <option value="少数民族">少数民族</option>
              </select>
            </div>

            {/* Field 4: 区县(街道/镇/乡) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="filter-county-select">区县乡镇 (权限范围)</label>
              <select 
                id="filter-county-select"
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="全部">全部区县街道</option>
                {DISTRICT_TOWNS.map((dt) => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Field 5: 常见慢病多选 (12 options visual selector) */}
          <div className="space-y-2 py-1 bg-slate-50/50 p-3 rounded-lg border border-slate-200/50" id="chronic-multiselect">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>结合临床常见慢性病筛选 (支持多选组合：OR检索)</span>
              </span>
              {selectedChronicDiseases.length > 0 && (
                <span className="text-[10px] text-teal-800 bg-teal-50 py-0.5 px-2 rounded-full font-bold">
                  已选中 {selectedChronicDiseases.length} 个病种过滤
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CHRONIC_DISEASE_OPTIONS.map((choice) => {
                const isSelected = selectedChronicDiseases.includes(choice);
                return (
                  <button 
                    key={choice}
                    onClick={() => handleToggleDiseaseFilter(choice)}
                    id={`filter-disease-btn-${choice}`}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition flex items-center gap-1 cursor-pointer select-none ${
                      isSelected 
                        ? "bg-teal-600 text-white shadow-xs" 
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Actuations buttons */}
          <div className="flex justify-end gap-3 pt-2.5 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              id="filter-reset-btn"
              className="text-slate-650 hover:bg-slate-100 border-slate-305 text-xs font-semibold h-8.5 px-4 flex items-center gap-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              重置
            </Button>
            <Button 
              onClick={handleApplyFilter}
              id="filter-query-btn"
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold h-8.5 px-5 flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              查询队列
            </Button>
          </div>

        </div>
      </Card>

      {/* Data Table Section */}
      <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden">
        
        {/* Table summary panel */}
        <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700">队列人员随访状态一览表</span>
            <span className="text-[10px] bg-slate-200/70 text-slate-600 py-0.5 px-2 rounded-full font-bold">
              共 {filteredPeople.length} 条检索信息
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-medium">
            提示：高发新发随访状态使用红灯高亮；死亡老年人进行浅灰静息归档
          </div>
        </div>

        {/* Core Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/60 text-slate-700">
              <TableRow>
                <TableHead className="p-3">姓名</TableHead>
                <TableHead className="p-3">身份证号/身份ID</TableHead>
                <TableHead className="p-3 w-16 text-center">性别</TableHead>
                <TableHead className="p-3">本人电话</TableHead>
                <TableHead className="p-3 w-16 text-center">民族</TableHead>
                <TableHead className="p-3">居住区县/街道</TableHead>
                <TableHead className="p-3 max-w-sm">慢性合并症检测判定 (慢病大类)</TableHead>
                <TableHead className="p-3 text-center">死亡情况</TableHead>
                <TableHead className="p-3 text-center">最近随访进度</TableHead>
                <TableHead className="p-3 text-center min-w-44">操作</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {paginatedPeople.length > 0 ? (
                paginatedPeople.map((person) => {
                  const isDeceased = person.deathStatus !== "-";
                  return (
                    <TableRow 
                      key={person.id} 
                      className={`hover:bg-slate-50/20 transition ${isDeceased ? "bg-slate-50/50 text-slate-400 opacity-80" : ""}`}
                    >
                      {/* Name */}
                      <TableCell className="p-3 font-semibold text-slate-850">
                        {person.name}
                      </TableCell>

                      {/* ID Card */}
                      <TableCell className="p-3 font-mono text-[11px] font-semibold">
                        {person.idCard}
                      </TableCell>

                      {/* Gender */}
                      <TableCell className="p-3 text-center">
                        <span className={person.gender === "女" ? "text-purple-600" : "text-blue-600"}>
                          {person.gender}
                        </span>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="p-3 font-mono text-[11px]">
                        {person.phone}
                      </TableCell>

                      {/* Ethnicity */}
                      <TableCell className="p-3 text-center text-xs">
                        {person.ethnicity}
                      </TableCell>

                      {/* District / Town */}
                      <TableCell className="p-3 text-xs text-slate-500">
                        {person.county}
                      </TableCell>

                      {/* Chronic Diseases */}
                      <TableCell className="p-3 max-w-sm">
                        <div className="flex flex-wrap gap-1">
                          {person.diseases.length > 0 ? (
                            person.diseases.map((dis, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className={`text-[9px] font-medium ${
                                  dis.includes("新发") || person.status === "new_outcome"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200" 
                                    : "bg-teal-50 text-teal-700 border border-teal-150"
                                }`}
                              >
                                {dis}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">健康大筛查暂无阳性慢病</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Death Status */}
                      <TableCell className="p-3 text-center font-semibold text-xs">
                        {isDeceased ? (
                          <span className="text-rose-650 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center justify-center gap-1 max-w-36 mx-auto">
                            <Clock className="w-3 h-3 text-rose-500" />
                            {person.deathStatus}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>

                      {/* Recent Follow-up status */}
                      <TableCell className="p-3 text-center">
                        <div className="space-y-1">
                          {getStatusBadge(person)}
                          {person.lastFollowUpDate && (
                            <div className="text-[9px] text-slate-400 uppercase tracking-tight">
                              随访期:{person.lastFollowUpDate}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions Buttons */}
                      <TableCell className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* 新增随访 button */}
                          <Button 
                            size="sm"
                            onClick={() => handleOpenFollowUp(person)}
                            id={`add-follow-btn-${person.id}`}
                            className="bg-teal-605 text-white hover:bg-teal-700 shadow-xs text-[10px] font-bold h-7.5 py-0.5 px-3 flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            新增随访
                          </Button>

                          {/* 历史记录 button */}
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenHistory(person)}
                            id={`history-btn-${person.id}`}
                            className="text-slate-600 border-slate-250 hover:bg-slate-50 hover:text-slate-800 text-[10px] font-medium h-7.5 py-0.5 px-3 flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3 text-slate-400" />
                            历史记录
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-44 text-center text-slate-400 italic">
                    没有找到契合当前条件的随访记录。请在筛选区增加过滤、重设组合，或点击“重置”复原大底库。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Compact pagination footer (分页区) */}
        <div className="bg-slate-50/50 border-t border-slate-200 px-5 py-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            显示第 <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> 至{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            条记录，共 <span className="font-semibold text-slate-700">{totalCount}</span> 条
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">页码:</span>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-7 w-7 p-0 flex items-center justify-center border-slate-300 disabled:opacity-40"
              >
                &lt;
              </Button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <Button 
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-7 w-7 p-0 flex items-center justify-center text-[10px] ${
                    currentPage === idx + 1 
                      ? "bg-teal-600 hover:bg-teal-700 text-white font-bold" 
                      : "border-slate-300"
                  }`}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button 
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-7 w-7 p-0 flex items-center justify-center border-slate-300 disabled:opacity-40"
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>

      </Card>

      {/* Grassroot note bottom area */}
      <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex gap-4 text-xs text-teal-900 shadow-xs">
        <Info className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">基层随访业务重要提示:</p>
          <p className="leading-relaxed">
            1. 新增随访记录提交成功后，系统在发出反馈通知的同时，会<strong>自动提取 A10A 慢病勾选字段合并同步写入</strong>该老年人在公卫体检基础数据库中的患病数据记录，并触发随访属性的全局重算机制。<br />
            2. 本功能支持缓存离线工作流，对于入户或没有互联网基站的网络盲区，数据暂存于浏览器缓存，回到服务中心后系统会发起批量核销。
          </p>
        </div>
      </div>

      {/* 5. Follow Up Right Side Slider Drawer Modal component */}
      <FollowUpDrawer 
        isOpen={isOpenDrawer}
        onClose={() => {
          setIsOpenDrawer(false);
          setSelectedPersonForFollow(null);
          triggerToast("info", "已取消新增随访", "随访记录未保存，表单内容已被清空。");
        }}
        person={selectedPersonForFollow}
        onSave={handleSaveFollowUp}
      />

      {/* 6. History Popover Dialog component */}
      <HistoryDialog 
        isOpen={isOpenHistory}
        onClose={() => {
          setIsOpenHistory(false);
          setSelectedPersonForHistory(null);
        }}
        person={selectedPersonForHistory}
      />

    </div>
  );
}
