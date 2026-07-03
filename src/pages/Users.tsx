
import { UserCog, Plus, Search, Mail, Phone } from "lucide-react";
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

export function UsersPage() {
  const users = [
    { id: '1', name: '张三', username: 'admin', role: '超级管理员', dept: '信息中心', status: 'active', lastLogin: '2024-04-11 10:30' },
    { id: '2', name: '李四', username: 'li_si', role: '街道管理员', dept: '金花街道', status: 'active', lastLogin: '2024-04-10 15:45' },
    { id: '3', name: '王五', username: 'wang_wu', role: '社区医生', dept: '西村社区', status: 'inactive', lastLogin: '2024-03-20 09:12' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理系统登录账号及其所属部门和角色。</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" /> 新增用户
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="搜索姓名、账号或手机号..." className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>账号</TableHead>
                <TableHead>所属部门</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后登录时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-mono text-xs">{user.username}</TableCell>
                  <TableCell className="text-sm text-gray-500">{user.dept}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Badge className="bg-green-50 text-green-700 border-green-100">启用</Badge>
                    ) : (
                      <Badge className="bg-gray-50 text-gray-500 border-gray-100">禁用</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" className="text-blue-600 h-auto p-0 text-sm">重置密码</Button>
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
