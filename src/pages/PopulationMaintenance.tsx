import * as React from "react";
import { 
  Users, 
  Search, 
  Database, 
  RefreshCcw, 
  Plus, 
  FolderLock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function PopulationMaintenancePage() {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">人口信息维护</h1>
          <p className="text-sm text-gray-500 mt-1">
            维护各个地区的老年常住人口基础数据，用于测算各项公卫筛查与体检覆盖率（分母测算基准）。
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" disabled>
          <Plus className="w-4 h-4" /> 导入常住人口数
        </Button>
      </div>

      {/* Control Area */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="搜索区县名称或街道编码..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 h-9" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-9" onClick={() => setSearchValue("")}>
              <RefreshCcw className="w-3.5 h-3.5" /> 重置
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 h-9" disabled>
              导出人口模板
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table & Skeleton Area */}
      <Card className="border-none shadow-sm pb-8">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">地区人口登记表 (2019-2026)</CardTitle>
              <CardDescription className="text-xs">按年度常住基准核定，由网格及户籍口径统一备案。</CardDescription>
            </div>
            <Badge variant="outline" className="text-slate-500 bg-slate-50">
              数据锁定期：T-1
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FolderLock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">正在对接人口直报接口</h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
            此处展示由各街镇公共卫生管委会、户籍直报平台核定的老年常住人口统计，属于业务配置主键，目前接口对接中。
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="cursor-not-allowed" disabled>
              手动增录占位
            </Button>
            <Button size="sm" variant="secondary" className="cursor-not-allowed" disabled>
              刷新通信状态
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
