
import { ShieldCheck, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function RolesPage() {
  const roles = [
    { id: '1', name: '超级管理员', code: 'SUPER_ADMIN', desc: '拥有系统所有权限', userCount: 2, status: 'active' },
    { id: '2', name: '街道管理员', code: 'STREET_ADMIN', desc: '负责本街道数据导入与查询', userCount: 15, status: 'active' },
    { id: '3', name: '社区医生', code: 'COMMUNITY_DOCTOR', desc: '负责老年人健康数据录入', userCount: 45, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">角色管理</h1>
          <p className="text-sm text-gray-500 mt-1">配置系统角色及其对应的功能权限。</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" /> 新增角色
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="搜索角色名称或编码..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>角色名称</TableHead>
                <TableHead>角色编码</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>用户数量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="font-mono text-xs">{role.code}</TableCell>
                  <TableCell className="text-sm text-gray-500">{role.desc}</TableCell>
                  <TableCell>{role.userCount}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-50 text-green-700 border-green-100">正常</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" className="text-blue-600 h-auto p-0 text-sm">权限配置</Button>
                    <Button variant="link" className="text-gray-400 h-auto p-0 text-sm ml-4">编辑</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
