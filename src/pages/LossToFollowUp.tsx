import * as React from "react";
import { 
  Users, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XSquare, 
  AlertTriangle, 
  Clipboard,
  Search,
  UserCheck,
  RefreshCcw,
  CalendarDays,
  Activity,
  Heart
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

interface LostParticipant {
  idCard: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  county: string;
  town: string;
  registrationSite: string;
  phone: string;
  address: string;
  lastExamYear: number;
  yearsWithoutExam: number;
  chronicInfo: string[];
  deceasedStatus: string;
  followUpStatus: "pending" | "processing" | "followed" | "lost_contact" | "deceased";
  claimedBy?: string;
  method?: string;
  result?: string;
  notes?: string;
  updatedAt?: string;
}

const INITIAL_LOST: LostParticipant[] = [
  {
    idCard: "440111195211118888",
    name: "王伯伯",
    gender: "male",
    age: 74,
    county: "白云区",
    town: "同和街道",
    registrationSite: "同和中心卫生院",
    phone: "13511022933",
    address: "同和白山二坊13号",
    lastExamYear: 2023,
    yearsWithoutExam: 3, // Since current year is 2026!
    chronicInfo: ["慢性支气管炎"],
    deceasedStatus: "存活",
    followUpStatus: "pending",
  },
  {
    idCard: "440103195101019999",
    name: "陈大娘",
    gender: "female",
    age: 75,
    county: "荔湾区",
    town: "彩虹街道",
    registrationSite: "西园社区卫健服务站",
    phone: "13922114400",
    address: "中山八路南一巷3号",
    lastExamYear: 2022,
    yearsWithoutExam: 4,
    chronicInfo: ["高血压", "轻度贫血"],
    deceasedStatus: "存活",
    followUpStatus: "processing",
    claimedBy: "李医生 (金花社区)"
  },
  {
    idCard: "440105194812318888",
    name: "赵叔叔",
    gender: "male",
    age: 77,
    county: "海珠区",
    town: "昌岗街道",
    registrationSite: "昌岗街第一社区医院",
    phone: "13600115566",
    address: "细岗东三街42号501",
    lastExamYear: 2023,
    yearsWithoutExam: 3,
    chronicInfo: ["未见明显慢病"],
    deceasedStatus: "存活",
    followUpStatus: "followed",
    claimedBy: "苏护士",
    method: "上门随访",
    result: "已联系并补体检",
    notes: "长者因先前骨折，行动不便故未去体检。本次上门解释后，家属已开车带去补做体检复核。",
    updatedAt: "2026-06-01"
  }
];

export function LossToFollowUpPage() {
  const [data, setData] = React.useState<LostParticipant[]>(INITIAL_LOST);
  const [districtFilter, setDistrictFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Backfill model state
  const [selectedPerson, setSelectedPerson] = React.useState<LostParticipant | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Follow Up Back-fill fields
  const [contactResult, setContactResult] = React.useState("已联系并补体检");
  const [followUpMethod, setFollowUpMethod] = React.useState("电话");
  const [followUpNotes, setFollowUpNotes] = React.useState("");

  // Counter outstanding
  const pendingCount = data.filter(d => d.followUpStatus === "pending" || d.followUpStatus === "processing").length;

  const handleClaim = (idCard: string) => {
    setData(prev => prev.map(p => {
      if (p.idCard === idCard) {
        return {
          ...p,
          claimedBy: "当前管理员 (卫健委)",
          followUpStatus: "processing"
        };
      }
      return p;
    }));
    alert("成功认领！该失访长者已纳入您的‘随访处理中’队列。");
  };

  const handleOpenBackfill = (person: LostParticipant) => {
    setSelectedPerson(person);
    setContactResult(person.result || "已联系并补体检");
    setFollowUpMethod(person.method || "电话");
    setFollowUpNotes(person.notes || "");
    setIsModalOpen(true);
  };

  const handleSaveBackfill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson) return;

    if (followUpNotes.trim().length > 200) {
      alert("备注字数不能超过200字");
      return;
    }

    const timestamp = new Date().toISOString().substring(0, 10);

    setData(prev => prev.map(p => {
      if (p.idCard === selectedPerson.idCard) {
        let finalStatus: LostParticipant["followUpStatus"] = "followed";
        if (contactResult === "失联") finalStatus = "lost_contact";
        if (contactResult === "已死亡") finalStatus = "deceased";

        return {
          ...p,
          followUpStatus: finalStatus,
          result: contactResult,
          method: followUpMethod,
          notes: followUpNotes,
          updatedAt: timestamp,
          claimedBy: p.claimedBy || "当前管理员 (卫健委)",
          deceasedStatus: contactResult === "已死亡" ? "已死亡" : p.deceasedStatus
        };
      }
      return p;
    }));

    setIsModalOpen(false);
    alert("失访核查结果回填成功！");
  };

  const filteredData = data.filter(item => {
    const matchCounty = districtFilter === "all" || item.county === districtFilter;
    const matchText = searchQuery === "" || 
      item.name.includes(searchQuery) || 
      item.idCard.includes(searchQuery) ||
      item.phone.includes(searchQuery);
    return matchCounty && matchText;
  });

  const getFollowUpStatusBadge = (status: LostParticipant["followUpStatus"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200"><Clock className="w-3 h-3 mr-1" /> 待随访</Badge>;
      case "processing":
        return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"><Activity className="w-3 h-3 mr-1 animate-pulse" /> 随访追踪中</Badge>;
      case "followed":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> 已随访回填</Badge>;
      case "lost_contact":
        return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"><XSquare className="w-3 h-3 mr-1" /> 已失联（核定）</Badge>;
      case "deceased":
        return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200">已归类死亡</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            失访者随访提醒与社区随访 
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <b>失访核定规则：</b>历史年度有体检记录、本研究年度无档案接收且处于在世状态。由辖区责任家庭团队追踪激活。
          </p>
        </div>
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded p-2.5 flex items-center gap-1.5 max-w-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>待办事宜：有 {pendingCount} 名往届未体体检队列长者需本周联系！</span>
        </div>
      </div>

      {/* Query panel */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">所属公卫区县</span>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9">
                <SelectValue placeholder="全部区县" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全市辖区</SelectItem>
                <SelectItem value="白云区">白云区</SelectItem>
                <SelectItem value="荔湾区">荔湾区</SelectItem>
                <SelectItem value="海珠区">海珠区</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">核对检索</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索失访姓名、电话、身份证号码..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9" 
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="h-9 w-full gap-1.5" onClick={() => { setDistrictFilter("all"); setSearchQuery(""); }}>
              <RefreshCcw className="w-3.5 h-3.5" /> 重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Lost list */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>证件号 & 姓名</TableHead>
                  <TableHead className="w-16">基本</TableHead>
                  <TableHead>区县/街镇</TableHead>
                  <TableHead>初次建档公卫网点</TableHead>
                  <TableHead>最近体检 & 空缺</TableHead>
                  <TableHead>合并慢病病史</TableHead>
                  <TableHead>追踪状态</TableHead>
                  <TableHead className="text-right">对接操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((person) => (
                  <TableRow key={person.idCard} className="hover:bg-slate-50/20 text-xs">
                    <TableCell>
                      <div className="font-semibold text-slate-800">{person.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{person.idCard}</div>
                    </TableCell>
                    <TableCell>
                      <span>{person.gender === "male" ? "男" : "女"} ({person.age}岁)</span>
                    </TableCell>
                    <TableCell>
                      <span>{person.county}</span>
                      <div className="text-[10px] text-gray-500">{person.town}</div>
                    </TableCell>
                    <TableCell className="text-gray-500">{person.registrationSite}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-800">{person.lastExamYear}年</div>
                      <div className="text-red-500 font-bold text-[10px] bg-red-50/50 inline-block px-1.5 py-0.2 rounded mt-0.5">
                        逾期未体检: {person.yearsWithoutExam}年
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {person.chronicInfo.map((info, idx) => (
                          <Badge key={idx} variant="outline" className="font-normal text-[9px] text-slate-500 py-0">{info}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getFollowUpStatusBadge(person.followUpStatus)}
                        {person.claimedBy && (
                          <div className="text-[9px] text-gray-400 font-medium">
                            认领人: {person.claimedBy}
                          </div>
                        )}
                        {person.result && (
                          <div className="text-[10px] text-emerald-700 bg-green-50 px-1 py-0.2 rounded inline-block">
                            方式: {person.method} / {person.result}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {!person.claimedBy && (
                        <Button variant="outline" size="sm" className="h-8 text-blue-600 gap-1" onClick={() => handleClaim(person.idCard)}>
                          <UserCheck className="w-3.5 h-3.5" /> 分医认领键
                        </Button>
                      )}
                      {person.claimedBy && person.followUpStatus !== "followed" && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs font-semibold gap-1" onClick={() => handleOpenBackfill(person)}>
                          <Clipboard className="w-3.5 h-3.5" /> 回填随访结果
                        </Button>
                      )}
                      {person.followUpStatus === "followed" && (
                        <Button variant="ghost" size="sm" className="h-8 text-slate-500" onClick={() => handleOpenBackfill(person)}>
                          查看日志/修改
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-16 text-center text-slate-400 font-medium">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-20 text-blue-500" />
              <h3>本年度暂无失访人员</h3>
              <p className="text-xs text-gray-400 mt-1">当前所选辖区内，所有档案长者均已按时完成年度追踪体检，或转入相应终点归档。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backfill Dialog Modal */}
      {isModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                回填失访社区随访结果 – {selectedPerson.name}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBackfill} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-500">本人大号:</span> {selectedPerson.phone}
                </div>
                <div>
                  <span className="font-semibold text-gray-500">最近体检:</span> {selectedPerson.lastExamYear}年
                </div>
                <div className="col-span-2 mt-1">
                  <span className="font-semibold text-gray-500">现登记地址:</span> {selectedPerson.address}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">联系随访结果 (必填)</label>
                <Select value={contactResult} onValueChange={setContactResult}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="已联系并补体检">已联系并补体检 (长者已同意于近期前往预约)</SelectItem>
                    <SelectItem value="已联系未体检">已联系未体检 (本人确认在世，但拒绝常规体检)</SelectItem>
                    <SelectItem value="失联">失联 (电话持续停机，居委多次上门无此人)</SelectItem>
                    <SelectItem value="拒访问">拒访 (脾气暴躁或家属多次拒绝合作)</SelectItem>
                    <SelectItem value="已死亡">已死亡 (经家属口头确认或居委备案)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">随访追踪方式</label>
                <Select value={followUpMethod} onValueChange={setFollowUpMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="电话">电话联系 (高效常规随访)</SelectItem>
                    <SelectItem value="上门">上门入户 (家庭责任医生随访服务)</SelectItem>
                    <SelectItem value="其他">其他 (如：诊疗机构直接核销等)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">详细随访备注记录 (最多200字)</label>
                <textarea 
                  placeholder="请输入本次失访联系与动员的详细摘要。如家人联系方式、更改地址备注说明等..." 
                  value={followUpNotes} 
                  onChange={(e) => setFollowUpNotes(e.target.value)} 
                  className="w-full min-h-[90px] border rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  required 
                />
              </div>

              <div className="text-[10px] text-gray-400">
                提示：回填保存后，系统会自动更新该对象的随访判定状态，随访时间自动录入为：2026-06-02，归档责任人为当前管理员。
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" className="h-9" onClick={() => setIsModalOpen(false)}>
                  返回
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-9 font-semibold">
                  保存在案
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
