import * as React from "react";
import { 
  X, 
  Clock, 
  CheckCircle, 
  Radio, 
  User, 
  Calendar,
  Layers,
  Database,
  Search,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FollowUpMockPerson } from "@/data/followup_data";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  person: FollowUpMockPerson | null;
}

export function HistoryDialog({ isOpen, onClose, person }: HistoryDialogProps) {
  if (!isOpen || !person) return null;

  // Let's generate some realistic mock history records depending on the person
  const hasHistory = person.id !== "3" && person.id !== "8"; // some have history, some don't

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#1e293b] text-white p-4.5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-sm">随访归档历史记录检索</h3>
              <p className="text-[10px] text-slate-300">档案库老人基本信息：{person.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            id="close-history-dialog-btn"
            className="text-slate-400 hover:text-white hover:bg-slate-850 p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Patient Overview Summary */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex justify-between items-center">
            <div>
              <span className="text-slate-500">证件号：</span><span className="font-mono text-slate-900 font-semibold">{person.idCard}</span>
            </div>
            <div>
              <span className="text-slate-500">电话：</span><span className="font-mono text-slate-900 font-semibold">{person.phone}</span>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b pb-1.5 border-slate-100">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>历史电子病历与随访阶段 (跨系统比对)</span>
            </div>

            {hasHistory ? (
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Record 1 */}
                <div className="relative pl-7 text-xs space-y-1">
                  <span className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-teal-100 border border-teal-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900">2025年度国家基本公卫大筛查(常规体检)</span>
                    <span className="text-[10px] text-slate-400">2025-08-14</span>
                  </div>
                  <p className="text-slate-600">
                    随访结论：健在。血压控制理想 (132/80 mmHg)，空腹血糖正常。建议加强日常快步锻炼，减少食盐摄入。
                  </p>
                  <p className="text-[10px] text-slate-400">随访人：李明 | 随访方式：入户随签</p>
                </div>

                {/* Record 2 */}
                <div className="relative pl-7 text-xs space-y-1">
                  <span className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-slate-150 border border-slate-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">2024年度慢性合并症复核随访</span>
                    <span className="text-[10px] text-slate-400">2024-05-22</span>
                  </div>
                  <p className="text-slate-600">
                    随访结论：健在。新确诊伴发慢性病大类，已转介区人民医院专科复查，建立专项精细管理方案。
                  </p>
                  <p className="text-[10px] text-slate-400">随访人：陈医生 | 随访方式：电话访问</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-350 mx-auto" />
                <p className="text-xs text-slate-500">全新队列卡，该居民建档后暂未录入过历史阶段随访记录</p>
              </div>
            )}
          </div>

          {/* Pending notification block */}
          <div className="mt-6 p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-950 flex gap-2.5">
            <Database className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">「数据仓接口联调提示」</p>
              <p className="leading-relaxed">
                当前老人的跨地区历史随访接口 (API-CLINIC-RECORDS-SYNC) 正在进行联调测试。此高保真交互已展现基本状态。在后续数据同步打通后，可支持完整病历追踪导入。
              </p>
            </div>
          </div>
        </div>

        {/* Action column */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 shrink-0 flex justify-end">
          <Button 
            onClick={onClose}
            id="close-history-dialog-confirm"
            className="bg-slate-800 hover:bg-slate-900 border-none text-white text-xs px-5 py-1.5"
          >
            已阅并关闭
          </Button>
        </div>

      </div>
    </div>
  );
}
