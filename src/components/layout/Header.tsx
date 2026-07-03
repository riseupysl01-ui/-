
import { Bell, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-500">当前位置：首页 / 健康数据管理</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <Badge className="absolute top-0 right-0 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
            3
          </Badge>
        </div>
        
        <div className="h-6 w-[1px] bg-gray-200" />
        
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-gray-100">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">管理员</p>
                  <p className="text-xs text-gray-500">超级管理员</p>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="w-4 h-4" /> 个人信息
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" /> 系统设置
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <HelpCircle className="w-4 h-4" /> 帮助文档
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-red-600">
              <LogOut className="w-4 h-4" /> 退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
