import * as React from "react";
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  RefreshCcw, 
  Edit3, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface DistrictTown {
  id: string;
  monitorCode: string;
  monitorName: string;
  townCode: string;
  townName: string;
  villageCode: string;
  villageName: string;
}

const INITIAL_DATA: DistrictTown[] = [
  { id: "1", monitorCode: "MND-440103", monitorName: "荔湾监测点", townCode: "440103001000", townName: "金花街道", villageCode: "440103001001", villageName: "桃源社区" },
  { id: "2", monitorCode: "MND-440103", monitorName: "荔湾监测点", townCode: "440103002000", townName: "西村街道", villageCode: "440103002003", villageName: "广雅社区" },
  { id: "3", monitorCode: "MND-440104", monitorName: "越秀监测点", townCode: "440104005000", townName: "北京街道", villageCode: "440104005002", villageName: "盐运西社区" },
  { id: "4", monitorCode: "MND-440104", monitorName: "越秀监测点", townCode: "440104008000", townName: "东山街道", villageCode: "440104008005", villageName: "达道里社区" },
  { id: "5", monitorCode: "MND-440111", monitorName: "白云监测点", townCode: "440111006000", townName: "同和街道", villageCode: "440111006002", villageName: "白山社区" },
  { id: "6", monitorCode: "MND-440106", monitorName: "天河监测点", townCode: "440106002000", townName: "林和街道", villageCode: "440106002001", villageName: "雅苑社区" },
];

export function DistrictMaintenancePage() {
  const [data, setData] = React.useState<DistrictTown[]>(INITIAL_DATA);
  const [searchMonitor, setSearchMonitor] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Edit / Add modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<DistrictTown | null>(null);

  // Form Fields
  const [monitorCode, setMonitorCode] = React.useState("");
  const [monitorName, setMonitorName] = React.useState("");
  const [townCode, setTownCode] = React.useState("");
  const [townName, setTownName] = React.useState("");
  const [villageCode, setVillageCode] = React.useState("");
  const [villageName, setVillageName] = React.useState("");

  const filteredData = data.filter(item => {
    const matchMonitor = searchMonitor === "all" || item.monitorName === searchMonitor;
    const matchText = searchQuery === "" || 
      item.townName.includes(searchQuery) || 
      item.villageName.includes(searchQuery) || 
      item.monitorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.townCode.includes(searchQuery) ||
      item.villageCode.includes(searchQuery);
    return matchMonitor && matchText;
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setMonitorCode("MND-4401" + Math.floor(Math.random() * 90 + 10));
    setMonitorName("荔湾监测点");
    setTownCode("440103" + Math.floor(Math.random() * 900000 + 100000));
    setTownName("");
    setVillageCode("440103" + Math.floor(Math.random() * 900000 + 100000));
    setVillageName("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DistrictTown) => {
    setEditItem(item);
    setMonitorCode(item.monitorCode);
    setMonitorName(item.monitorName);
    setTownCode(item.townCode);
    setTownName(item.townName);
    setVillageCode(item.villageCode);
    setVillageName(item.villageName);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条监测点及乡镇村居配置吗？")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monitorCode.trim() || !monitorName.trim() || !townCode.trim() || !townName.trim() || !villageCode.trim() || !villageName.trim()) {
      alert("请完整填写所有必填字段");
      return;
    }

    if (editItem) {
      // Edit
      setData(prev => prev.map(item => {
        if (item.id === editItem.id) {
          return { ...item, monitorCode, monitorName, townCode, townName, villageCode, villageName };
        }
        return item;
      }));
    } else {
      // New
      const newItem: DistrictTown = {
        id: Math.random().toString(36).substr(2, 9),
        monitorCode,
        monitorName,
        townCode,
        townName,
        villageCode,
        villageName
      };
      setData(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">区县及乡镇信息维护</h1>
          <p className="text-sm text-gray-500 mt-1">
            设置和管理平台各监测点、乡镇街道、村居社区的层级和代码划分。
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" /> 新增监测点村居
        </Button>
      </div>

      {/* Query Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase">监测点名称</span>
            <Select value={searchMonitor} onValueChange={setSearchMonitor}>
              <SelectTrigger className="w-full bg-slate-50 border-gray-100 h-9">
                <SelectValue placeholder="全部监测点" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部监测点</SelectItem>
                <SelectItem value="荔湾监测点">荔湾监测点</SelectItem>
                <SelectItem value="越秀监测点">越秀监测点</SelectItem>
                <SelectItem value="白云监测点">白云监测点</SelectItem>
                <SelectItem value="天河监测点">天河监测点</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">模糊检索</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索乡镇/街道、村居社区、代码或关键字..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9" 
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 w-full h-9" 
              onClick={() => { setSearchQuery(""); setSearchMonitor("all"); }}
            >
              <RefreshCcw className="w-4 h-4" /> 重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid table */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>监测点代码</TableHead>
                <TableHead>监测点名称</TableHead>
                <TableHead>乡镇街道代码</TableHead>
                <TableHead>乡镇街道名称</TableHead>
                <TableHead>村居代码</TableHead>
                <TableHead>村居名称</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/20">
                    <TableCell className="font-mono text-xs text-gray-700">{item.monitorCode}</TableCell>
                    <TableCell className="font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {item.monitorName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{item.townCode}</TableCell>
                    <TableCell className="text-gray-900">{item.townName}</TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{item.villageCode}</TableCell>
                    <TableCell className="text-gray-900">{item.villageName}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2 pt-2.5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-blue-600 hover:text-blue-700 border-gray-100 hover:border-blue-100 bg-white" 
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> 修改
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-100 hover:border-red-100 bg-white" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> 删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-slate-400 italic">
                    无匹配结果，请重新更换筛选条件。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interactive Modal for adding / editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                {editItem ? "修改监测点及村居配置" : "新开监测点及村居"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">监测点代码 *</label>
                  <Input 
                    placeholder="如：MND-440103" 
                    value={monitorCode} 
                    onChange={(e) => setMonitorCode(e.target.value)} 
                    required 
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">监测点名称 *</label>
                  <Select value={monitorName} onValueChange={setMonitorName}>
                    <SelectTrigger className="w-full bg-white h-9">
                      <SelectValue placeholder="选择所属监测点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="荔湾监测点">荔湾监测点</SelectItem>
                      <SelectItem value="越秀监测点">越秀监测点</SelectItem>
                      <SelectItem value="白云监测点">白云监测点</SelectItem>
                      <SelectItem value="天河监测点">天河监测点</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">乡镇街道代码 *</label>
                  <Input 
                    placeholder="如：440103001000" 
                    value={townCode} 
                    onChange={(e) => setTownCode(e.target.value)} 
                    required 
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">乡镇街道名称 *</label>
                  <Input 
                    placeholder="如：金花街道" 
                    value={townName} 
                    onChange={(e) => setTownName(e.target.value)} 
                    required 
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">村居代码 *</label>
                  <Input 
                    placeholder="如：440103001001" 
                    value={villageCode} 
                    onChange={(e) => setVillageCode(e.target.value)} 
                    required 
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">村居名称 *</label>
                  <Input 
                    placeholder="如：桃源社区" 
                    value={villageName} 
                    onChange={(e) => setVillageName(e.target.value)} 
                    required 
                    className="h-9"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" className="h-9" onClick={() => setIsModalOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-9">
                  提交保存
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
