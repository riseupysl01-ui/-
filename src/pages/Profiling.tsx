import * as React from "react";
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_TASKS } from "@/lib/mockData";
import { ImportTask } from "@/types";

export function ProfilingPage() {
  const [tasks, setTasks] = React.useState<ImportTask[]>(MOCK_TASKS.filter(t => t.type === 'profiling'));
  const [isUploading, setIsUploading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newTask: ImportTask = {
        id: Math.random().toString(36).substr(2, 9),
        filename: '老年常驻名单_' + new Date().toLocaleDateString().replace(/\//g, '-') + '.xlsx',
        type: 'profiling',
        status: 'reading',
        progress: 0,
        createdAt: new Date().toLocaleString(),
        operator: '管理员'
      };
      setTasks([newTask, ...tasks]);
      setIsUploading(false);
      alert("批量建档表格已成功通过前置校验，正交接至公卫直报端入库处理！");
    }, 1200);
  };

  const filteredTasks = tasks.filter(task => 
    task.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: ImportTask['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> 入库完成</Badge>;
      case 'validating':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> 二期校验中</Badge>;
      case 'reading':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock className="w-3 h-3 mr-1 animate-pulse" /> 校验直报中</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none"><AlertCircle className="w-3 h-3 mr-1" /> 发生格式错误</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">老年基本信息导入 (档案建立)</h1>
          <p className="text-sm text-gray-500 mt-1">
            一批量接收户籍、基层签约及随访平台的老年常驻大表，建立首要暴露危险时间线。
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-9 text-xs font-semibold">
            <Download className="w-4 h-4" /> 导出标准模板
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 h-9 text-xs font-semibold" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            拖拽/上传建档文件
          </Button>
        </div>
      </div>

      {/* Traditional list cards */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">导入任务历史与直报核销状态</CardTitle>
            <CardDescription className="text-xs">
              追踪各基层医疗管委上传批量长者建档表格在后台的读、检验及落网状态。
            </CardDescription>
          </div>
          <div className="relative w-48 shrink-0">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            <Input 
              placeholder="过滤名..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="text-xs">
                <TableHead className="w-[180px]">文件名</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作人</TableHead>
                <TableHead>提交年月</TableHead>
                <TableHead>结果汇总</TableHead>
                <TableHead className="text-right">检验报告</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50/50 text-xs text-slate-600">
                    <TableCell className="font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5 truncate max-w-[170px]" title={task.filename}>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                        <span>{task.filename}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell className="text-xs font-semibold">{task.operator}</TableCell>
                    <TableCell className="text-gray-400 text-[10px]">{task.createdAt}</TableCell>
                    <TableCell>
                      {task.status === 'completed' && (
                        <div className="text-[10px] leading-relaxed">
                          总建卡: <span className="text-gray-900 font-bold">{task.totalCount}</span>
                          <div className="text-emerald-700">成功: {task.successCount}</div>
                          {task.failCount ? <div className="text-red-700 font-semibold">失败阻断: {task.failCount}</div> : null}
                        </div>
                      )}
                      {(task.status === 'reading' || task.status === 'validating') && (
                        <span className="text-[10px] text-gray-400 italic">正在转接卫健数据墙...</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {task.status === 'completed' && task.failCount && task.failCount > 0 && (
                        <Button variant="link" className="text-red-600 h-auto p-0 text-xs">下载格式问题日志</Button>
                      )}
                      {task.status === 'completed' && !task.failCount && (
                        <span className="text-xs text-green-700 font-medium">✓ 零格式报错</span>
                      )}
                      {task.status === 'failed' && (
                        <Button variant="link" className="text-red-600 h-auto p-0 text-xs">下载校验失败报告</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-44 text-center italic text-gray-400 text-xs">
                    没有符合搜索关键词的任务历史。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
