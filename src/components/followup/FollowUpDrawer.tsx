import * as React from "react";
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Info, 
  Sparkles, 
  Check, 
  Clipboard,
  Shield,
  Heart,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FollowUpMockPerson, 
  A10A_DISEASE_LIST,
  DiseaseDict
} from "@/data/followup_data";

interface FollowUpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  person: FollowUpMockPerson | null;
  onSave: (
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
  ) => void;
}

// Validation Error Interface
interface ValidationError {
  field: string;
  message: string;
}

export function FollowUpDrawer({ isOpen, onClose, person, onSave }: FollowUpDrawerProps) {
  if (!isOpen || !person) return null;

  // Form Section Navigation Active State
  const [activeTab, setActiveTab] = React.useState<string>("basic");

  // A10A search / filter state
  const [diseaseSearchQuery, setDiseaseSearchQuery] = React.useState<string>("");

  // Core Form Fields States
  const [followUpDate, setFollowUpDate] = React.useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [investigator, setInvestigator] = React.useState<string>("李明");
  const [followUpMethod, setFollowUpMethod] = React.useState<"电话" | "入户" | "其他">("入户");
  const [followUpMethodOther, setFollowUpMethodOther] = React.useState<string>("");

  const [isContacted, setIsContacted] = React.useState<"是" | "否" | "">("是");
  const [lostReason, setLostReason] = React.useState<"迁移" | "拒绝回答" | "其他" | "">("");
  const [lostReasonOther, setLostReasonOther] = React.useState<string>("");

  const [isAlive, setIsAlive] = React.useState<"是" | "否" | "">("是");

  // Death Info
  const [deathDate, setDeathDate] = React.useState<string>("");
  const [deathReason, setDeathReason] = React.useState<"意外死亡" | "死于疾病" | "自然死亡" | "">("");
  const [accidentalReason, setAccidentalReason] = React.useState<"跌倒" | "其他" | "">("");
  const [accidentalReasonOther, setAccidentalReasonOther] = React.useState<string>("");
  const [diseaseCategory, setDiseaseCategory] = React.useState<string>("");
  const [diseaseCategorySub, setDiseaseCategorySub] = React.useState<string>("");

  // Alive details
  const [hasMigrated, setHasMigrated] = React.useState<"是" | "否" | "">("否");
  const [addressProvinceCounty, setAddressProvinceCounty] = React.useState<string>("广东省广州市");
  const [addressCounty, setAddressCounty] = React.useState<string>(person.county.split("区")[0] + "区");
  const [addressTown, setAddressTown] = React.useState<string>(person.county.split("区")[1] || "");
  const [addressDetail, setAddressDetail] = React.useState<string>("");

  // Habits
  const [smokingStatus, setSmokingStatus] = React.useState<string>("从不吸烟");
  const [drinkingStatus, setDrinkingStatus] = React.useState<string>("从不饮酒");
  const [needLifeHelp, setNeedLifeHelp] = React.useState<string>("不需要帮助");

  // New disease flag and grid selection
  const [hasNewDiagnosis, setHasNewDiagnosis] = React.useState<"是" | "否" | "">("否");
  
  // A10A diseases mapping state
  const [checkedDiseases, setCheckedDiseases] = React.useState<
    Record<
      string, 
      {
        checked: boolean;
        diagnosedDate: string;
        diagnosedHospital: string;
        hospitalized: "是" | "否" | "";
        additionalInfo: string;
        tumorSite: string;
      }
    >
  >(() => {
    const records: Record<
      string, 
      {
        checked: boolean;
        diagnosedDate: string;
        diagnosedHospital: string;
        hospitalized: "是" | "否" | "";
        additionalInfo: string;
        tumorSite: string;
      }
    > = {};
    A10A_DISEASE_LIST.forEach((d) => {
      records[d.name] = {
        checked: false,
        diagnosedDate: "",
        diagnosedHospital: "",
        hospitalized: "",
        additionalInfo: "",
        tumorSite: "肺部"
      };
    });
    return records;
  });

  // Validation States
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [isSubmitTouched, setIsSubmitTouched] = React.useState<boolean>(false);

  // Group validation on inputs
  const validateForm = (): boolean => {
    const errorList: ValidationError[] = [];

    if (!followUpDate) {
      errorList.push({ field: "followUpDate", message: "随访日期不能为空" });
    }
    if (!investigator.trim()) {
      errorList.push({ field: "investigator", message: "调查员姓名不能为空" });
    }
    if (followUpMethod === "其他" && !followUpMethodOther.trim()) {
      errorList.push({ field: "followUpMethodOther", message: "请输入'其他'随访方式的补充说明" });
    }

    if (!isContacted) {
      errorList.push({ field: "isContacted", message: "请选择是否联系上调查对象" });
    }

    if (isContacted === "否") {
      if (!lostReason) {
        errorList.push({ field: "lostReason", message: "请选择失去联系的原因" });
      } else if (lostReason === "其他" && !lostReasonOther.trim()) {
        errorList.push({ field: "lostReasonOther", message: "请输入'其他'失联原因的具体说明" });
      }
    }

    if (isContacted === "是") {
      if (!isAlive) {
        errorList.push({ field: "isAlive", message: "请选择调查对象当前是否还健在" });
      } else if (isAlive === "否") {
        // Death Info Validation
        if (!deathDate) {
          errorList.push({ field: "deathDate", message: "请选择具体死亡时间" });
        }
        if (!deathReason) {
          errorList.push({ field: "deathReason", message: "请选择具体死亡原因" });
        } else {
          if (deathReason === "意外死亡") {
            if (!accidentalReason) {
              errorList.push({ field: "accidentalReason", message: "请选择意外死亡的具体情形" });
            } else if (accidentalReason === "其他" && !accidentalReasonOther.trim()) {
              errorList.push({ field: "accidentalReasonOther", message: "请输入其他意外死亡的具体原因" });
            }
          } else if (deathReason === "死于疾病") {
            if (!diseaseCategory) {
              errorList.push({ field: "diseaseCategory", message: "请选择死于疾病的疾病分类" });
            } else {
              // Sub-categories validation
              if (["脑血管病", "缺血性心脏病", "慢性阻塞性肺病"].includes(diseaseCategory) && !diseaseCategorySub) {
                errorList.push({ field: "diseaseCategorySub", message: "请选择具体二级疾病亚分类" });
              } else if (["高血压", "糖尿病", "恶性肿瘤", "其他"].includes(diseaseCategory) && !diseaseCategorySub.trim()) {
                errorList.push({ field: "diseaseCategorySub", message: "请输入该疾病的具体细分部位或大类说明" });
              }
            }
          }
        }
      } else {
        // Alive fields validation
        if (!hasMigrated) {
          errorList.push({ field: "hasMigrated", message: "请选择调查对象是否发生迁移" });
        } else if (hasMigrated === "是") {
          if (!addressCounty.trim()) errorList.push({ field: "addressCounty", message: "请输入迁移后的对应区/县" });
          if (!addressTown.trim()) errorList.push({ field: "addressTown", message: "请输入迁移后的对应乡/镇/街道" });
          if (!addressDetail.trim()) errorList.push({ field: "addressDetail", message: "请输入具体迁移后的详细地址/门牌号" });
        }

        if (!hasNewDiagnosis) {
          errorList.push({ field: "hasNewDiagnosis", message: "请确认是否有新诊断疾病" });
        } else if (hasNewDiagnosis === "是") {
          // Check if at least one checkbox is checked in disease list
          const checkedCount = (Object.values(checkedDiseases) as any[]).filter(v => v.checked).length;
          if (checkedCount === 0) {
            errorList.push({ field: "diseaseTable", message: "您选择了存在新诊断疾病，请至少在下方 A10A 疾病表格中勾选并填写一项新发慢性病。" });
          } else {
            // Check that checked rows have fully filled diagnosis dates and hospitals
            (Object.entries(checkedDiseases) as any[]).forEach(([diseaseName, v]) => {
              if (v.checked) {
                if (!v.diagnosedDate) {
                  errorList.push({ field: `disease_date_${diseaseName}`, message: `${diseaseName}的首次诊断时间不能为空` });
                }
                if (!v.diagnosedHospital.trim()) {
                  errorList.push({ field: `disease_hosp_${diseaseName}`, message: `${diseaseName}的首次诊断医院不能为空` });
                }
                if (!v.hospitalized) {
                  errorList.push({ field: `disease_hospz_${diseaseName}`, message: `请选择${diseaseName}是否经历过住院` });
                }
                if (v.additionalInfo.length > 200) {
                  errorList.push({ field: `disease_info_${diseaseName}`, message: `${diseaseName}的补充说明超过200字限制` });
                }
              }
            });
          }
        }
      }
    }

    setErrors(errorList);
    return errorList.length === 0;
  };

  const handleErrorReset = (fieldName: string) => {
    setErrors(prev => prev.filter(e => e.field !== fieldName));
  };

  const handleCheckboxToggle = (diseaseName: string) => {
    setCheckedDiseases(prev => {
      const isCurrentlyChecked = prev[diseaseName].checked;
      const updated = {
        ...prev,
        [diseaseName]: {
          ...prev[diseaseName],
          checked: !isCurrentlyChecked,
          // Reset fields if unchecked
          diagnosedDate: !isCurrentlyChecked ? prev[diseaseName].diagnosedDate || followUpDate : "",
          diagnosedHospital: !isCurrentlyChecked ? prev[diseaseName].diagnosedHospital || "区人民医院" : "",
          hospitalized: !isCurrentlyChecked ? prev[diseaseName].hospitalized || "否" : "" as any,
          additionalInfo: !isCurrentlyChecked ? prev[diseaseName].additionalInfo : "",
          tumorSite: !isCurrentlyChecked ? prev[diseaseName].tumorSite : "肺部"
        }
      };
      return updated;
    });
    // Remove individual row validation errors
    setErrors(prev => prev.filter(e => !e.field.includes(diseaseName)));
  };

  const handleDiseaseFieldChange = (diseaseName: string, key: string, value: any) => {
    setCheckedDiseases(prev => ({
      ...prev,
      [diseaseName]: {
        ...prev[diseaseName],
        [key]: value
      }
    }));
    setErrors(prev => prev.filter(e => e.field !== `disease_${key}_${diseaseName}`));
  };

  // Quick preset data for faster prototyping demo
  const handlePresetFill = (type: "healthy" | "deceased" | "new_chronic") => {
    setIsSubmitTouched(false);
    setErrors([]);
    setFollowUpDate(new Date().toISOString().substring(0, 10));
    setInvestigator("李医生");

    if (type === "healthy") {
      setFollowUpMethod("入户");
      setIsContacted("是");
      setIsAlive("是");
      setHasMigrated("否");
      setSmokingStatus("从不吸烟");
      setDrinkingStatus("从不饮酒");
      setNeedLifeHelp("不需要帮助");
      setHasNewDiagnosis("否");
    } else if (type === "deceased") {
      setFollowUpMethod("电话");
      setIsContacted("是");
      setIsAlive("否");
      setDeathDate("2026-05-20");
      setDeathReason("死于疾病");
      setDiseaseCategory("脑血管病");
      setDiseaseCategorySub("脑心脑血管梗死（脑梗死）");
    } else if (type === "new_chronic") {
      setFollowUpMethod("入户");
      setIsContacted("是");
      setIsAlive("是");
      setHasMigrated("否");
      setSmokingStatus("吸烟");
      setDrinkingStatus("从不饮酒");
      setNeedLifeHelp("不需要帮助");
      setHasNewDiagnosis("是");
      
      // Check Hypertension and Diabetes
      setCheckedDiseases(prev => {
        const updated = { ...prev };
        updated["高血压"] = {
          checked: true,
          diagnosedDate: "2026-01-10",
          diagnosedHospital: "天河区人民医院",
          hospitalized: "否",
          additionalInfo: "诊室测量150/95mmHg",
          tumorSite: "肺部"
        };
        updated["糖尿病"] = {
          checked: true,
          diagnosedDate: "2026-02-15",
          diagnosedHospital: "中山大学附属第三医院",
          hospitalized: "是",
          additionalInfo: "空腹血糖 8.2 mmol/L，已配口服二甲双胍",
          tumorSite: "肺部"
        };
        return updated;
      });
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitTouched(true);
    const isValid = validateForm();
    if (!isValid) {
      // Find index tab of first error to shift tabs automatically
      const currentErrors = errors;
      // Scroll to error container
      const errorDiv = document.getElementById("validation-err-banner");
      if (errorDiv) {
        errorDiv.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Prepare submitted result model
    let statusValue: "active" | "deceased" | "lost" | "new_outcome" = "active";
    let finalDiseases = [...person.diseases];

    if (isContacted === "否") {
      statusValue = "lost";
    } else if (isAlive === "否") {
      statusValue = "deceased";
    } else {
      if (hasNewDiagnosis === "是") {
        statusValue = "new_outcome";
        // Merge checked disease names into chronic disease list without duplicates
        const newlyChecked = (Object.entries(checkedDiseases) as any[])
          .filter(([_, v]) => v.checked)
          .map(([name, _]) => name);
        
        const mergedSet = new Set([...person.diseases, ...newlyChecked]);
        finalDiseases = Array.from(mergedSet);
      }
    }

    onSave(person.id, {
      diseases: finalDiseases,
      isDeceased: isContacted === "是" && isAlive === "否",
      deathDate: isContacted === "是" && isAlive === "否" ? deathDate : undefined,
      lastFollowUpDate: followUpDate,
      lastFollowUpMethod: followUpMethod,
      lastFollowUpInvestigator: investigator,
      status: statusValue
    });
  };

  // Filter A10A diseases list dynamically based on search box
  const filteredA10ADiseases = A10A_DISEASE_LIST.filter(
    (d) =>
      d.name.toLowerCase().includes(diseaseSearchQuery.toLowerCase()) ||
      d.icd.toLowerCase().includes(diseaseSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      
      {/* 1. Header with patient summaries */}
      <div className="bg-[#0f172a] text-white p-5 shrink-0 flex flex-col gap-3 relative">
        <button 
          onClick={onClose}
          id="close-drawer-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0 shadow">
            {person.name.substring(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{person.name}</h2>
              <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded text-teal-400 font-semibold border border-teal-500/20">
                {person.gender}
              </span>
              <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded text-slate-300">
                {person.ethnicity}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              身份ID: <span className="font-mono text-white">{person.idCard}</span>
            </p>
          </div>

          {/* Quick preset templates for reviewer */}
          <div className="ml-auto mr-10 hidden sm:flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              交互快填:
            </span>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/30 py-0 px-2" onClick={() => handlePresetFill("healthy")}>
              联系在世(正常)
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-400 bg-amber-950/20 hover:bg-amber-900/30 py-0 px-2" onClick={() => handlePresetFill("new_chronic")}>
              联系在世(新慢病)
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-400 bg-rose-950/20 hover:bg-rose-900/30 py-0 px-2" onClick={() => handlePresetFill("deceased")}>
              核实已故
            </Button>
          </div>
        </div>

        {/* Patient specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block pb-0.5">本人电话:</span>
            <span className="font-mono text-slate-200 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> {person.phone}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block pb-0.5">所属辖区(街道/镇):</span>
            <span className="text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {person.county}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 block pb-0.5">已判慢病大类:</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {person.diseases.length > 0 ? (
                person.diseases.map((d, index) => (
                  <span key={index} className="bg-slate-800 text-teal-300 border border-teal-500/10 px-1.5 py-0.1 rounded text-[10px]">
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">健康档案暂无慢病记载</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Anchor tabs or progress navigation bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <Clipboard className="w-4 h-4 text-teal-600 animate-pulse" />
          <span className="font-semibold text-slate-800">新增随访记录表单</span>
        </div>
        <div className="flex gap-1.5 md:gap-3 text-slate-400">
          <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activeTab === "basic" ? "text-teal-700 bg-teal-50 font-bold" : "hover:text-slate-600"}`} onClick={() => setActiveTab("basic")}>随访基本信息</span>
          <span>/</span>
          {isContacted === "是" && (
            <>
              <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activeTab === "status" ? "text-teal-700 bg-teal-50 font-bold" : "hover:text-slate-600"}`} onClick={() => setActiveTab("status")}>在世随访</span>
              <span>/</span>
              {isAlive === "是" && hasNewDiagnosis === "是" && (
                <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activeTab === "A10A" ? "text-teal-700 bg-teal-50 font-bold font-semibold" : "hover:text-slate-600"}`} onClick={() => setActiveTab("A10A")}>A10A 慢病登记表格</span>
              )}
            </>
          )}
          {isContacted === "否" && (
            <span className="text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">失联登记流程</span>
          )}
        </div>
      </div>

      {/* 3. Main Scrollable Form Body Container */}
      <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" id="follow-up-drawer-form">
        
        {/* Dynamic global validation Banner */}
        {errors.length > 0 && isSubmitTouched && (
          <div id="validation-err-banner" className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex gap-3 animate-in fade-in slide-in-from-top-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-1.5">表单信息校验失败，请修正以下 {errors.length} 项必填字段后重新保存:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {errors.slice(0, 10).map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
                {errors.length > 10 && <li>...以及其他 {errors.length - 10} 项 A10A 慢病字段错误</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Section 1: 随访基本信息 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="section-basic">
          <div className="bg-teal-50/60 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
              随访管理及联系判定
            </h3>
            <span className="text-[10px] text-teal-700 bg-teal-100/50 px-2 py-0.5 rounded">标准公卫模版</span>
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 随访日期 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                随访日期 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="date"
                  value={followUpDate}
                  onChange={(e) => {
                    setFollowUpDate(e.target.value);
                    handleErrorReset("followUpDate");
                  }}
                  id="form-follow-date"
                  className={`w-full rounded-md border text-slate-800 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 ${errors.some(e => e.field === "followUpDate") ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30" : "border-slate-250 focus:ring-teal-500"}`}
                />
              </div>
              {errors.some(e => e.field === "followUpDate") && (
                <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "followUpDate")?.message}
                </p>
              )}
            </div>

            {/* 调查员 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                调查员姓名 <span className="text-red-500">*</span>
              </label>
              <Input 
                value={investigator}
                onChange={(e) => {
                  setInvestigator(e.target.value);
                  handleErrorReset("investigator");
                }}
                id="form-investigator-input"
                placeholder="请输入调查员名字"
                className={`bg-white text-xs ${errors.some(e => e.field === "investigator") ? "border-red-500 bg-red-50/30" : ""}`}
              />
              {errors.some(e => e.field === "investigator") && (
                <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "investigator")?.message}
                </p>
              )}
            </div>

            {/* 随访方式 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                A1 随访方式 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center h-9 mt-1">
                {["电话", "入户", "其他"].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="followUpMethod"
                      checked={followUpMethod === m}
                      onChange={() => {
                        setFollowUpMethod(m as any);
                        handleErrorReset("followUpMethodOther");
                      }}
                      className="text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {/* A1 选择其他说明 */}
            {followUpMethod === "其他" && (
              <div className="md:col-span-3 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <label className="text-xs font-bold text-slate-500">
                  A1-其他随访方式说明 <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={followUpMethodOther}
                  onChange={(e) => {
                    setFollowUpMethodOther(e.target.value);
                    handleErrorReset("followUpMethodOther");
                  }}
                  id="method-other-explanation"
                  placeholder="如：邻里协助转告、家属代答等说明情况..."
                  className={`bg-white text-xs ${errors.some(e => e.field === "followUpMethodOther") ? "border-red-500 bg-red-50/30" : ""}`}
                />
                {errors.some(e => e.field === "followUpMethodOther") && (
                  <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "followUpMethodOther")?.message}
                  </p>
                )}
              </div>
            )}

            {/* separator */}
            <div className="md:col-span-3 border-t border-slate-100 my-1"></div>

            {/* A2 是否联系上调查对象 */}
            <div className="md:col-span-3 space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200/65">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                A2 是否确实联系上该调查人口或其最亲近家属代答人员？ <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer bg-white border border-slate-200 rounded-md px-4 py-2 hover:bg-slate-100 transition shadow-xs">
                  <input 
                    type="radio" 
                    name="isContacted" 
                    checked={isContacted === "是"}
                    onChange={() => {
                      setIsContacted("是");
                      handleErrorReset("isContacted");
                      handleErrorReset("lostReason");
                      handleErrorReset("lostReasonOther");
                    }}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 focus:outline-none"
                    id="contacted-yes-radio"
                  />
                  <span>是成员本人/受托监护家属 (继续接获信息说明)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-red-800 cursor-pointer bg-white border border-slate-200 rounded-md px-4 py-2 hover:bg-slate-100 transition shadow-xs">
                  <input 
                    type="radio" 
                    name="isContacted" 
                    checked={isContacted === "否"}
                    onChange={() => {
                      setIsContacted("否");
                      handleErrorReset("isContacted");
                      handleErrorReset("isAlive");
                      // Default to invalid state reset
                    }}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                    id="contacted-no-radio"
                  />
                  <span className="text-red-700">否 (无法发生有效联系/失访)</span>
                </label>
              </div>

              {errors.some(e => e.field === "isContacted") && (
                <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "isContacted")?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: 失去联系原因 (Only displays if isContacted === "否") */}
        {isContacted === "否" && (
          <div className="bg-amber-50/70 border-amber-300 rounded-xl shadow-md border p-5 space-y-4 animate-in slide-in-from-top-2 duration-250">
            <div className="flex items-center gap-2.5">
              <span className="text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded">登记步骤</span>
              <h4 className="text-sm font-bold text-amber-950">A3 失去有效随访联系的原因建档登记</h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-900 block">
                请选择具体的失去联络主导原因： <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["迁移", "拒绝回答", "其他"].map((reason) => (
                  <label key={reason} className="bg-white border rounded-lg p-3 flex items-center gap-2 cursor-pointer border-amber-200 hover:bg-amber-100/30 transition text-xs font-medium text-amber-950">
                    <input 
                      type="radio"
                      name="lostReason"
                      checked={lostReason === reason}
                      onChange={() => {
                        setLostReason(reason as any);
                        handleErrorReset("lostReason");
                        handleErrorReset("lostReasonOther");
                      }}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    {reason === "迁移" ? "人口迁移（区外/跨省居住，失去覆盖）" : 
                     reason === "拒绝回答" ? "拒绝合作（态度强硬/拒绝面谈回复）" : 
                     "其他失去联络的情形说明"}
                  </label>
                ))}
              </div>

              {errors.some(e => e.field === "lostReason") && (
                <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "lostReason")?.message}
                </p>
              )}
            </div>

            {lostReason === "其他" && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs font-semibold text-amber-900">
                  请具体补充其他失去联系原因的情节描述 <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={lostReasonOther}
                  onChange={(e) => {
                    setLostReasonOther(e.target.value);
                    handleErrorReset("lostReasonOther");
                  }}
                  id="lost-other-explanation-text"
                  placeholder="例如：电话变为空号、多次上门住址长期紧锁且邻居不知所踪"
                  className={`w-full text-xs text-amber-900 bg-white border border-amber-200 rounded-md p-2.5 h-16 focus:outline-none focus:ring-1 focus:ring-amber-500 ${errors.some(e => e.field === "lostReasonOther") ? "border-red-500 bg-red-50/20" : ""}`}
                />
                {errors.some(e => e.field === "lostReasonOther") && (
                  <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "lostReasonOther")?.message}
                  </p>
                )}
              </div>
            )}

            <div className="p-3 bg-white/70 border border-amber-200 rounded text-xs text-amber-900 flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <p>
                <strong>安全公卫机制声明：</strong>由于在 A2 联系状态中判定“否（失联）”，后续生命特征与慢性病表单字段将不再强制展示或保存。在本节录入失联系因后，阁下可直接拉到底部点击“保存随访记录”提报归档，系统自动判定该人口随访属性为<strong>失访（异常）</strong>。
              </p>
            </div>
          </div>
        )}

        {/* Section 3: 生命体征与在世状态 (Only displays if isContacted === "是") */}
        {isContacted === "是" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="section-status">
            
            {/* Table layout title card */}
            <div className="bg-teal-50/60 px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                生命特征与健在判定
              </h3>
            </div>

            <div className="p-5 space-y-5">
              {/* A4 调查对象是否还健在 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  A4 确认调查当月，调查老人对象当前是否还健在？ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium bg-white text-emerald-800 border-slate-250">
                    <input 
                      type="radio" 
                      name="isAlive"
                      checked={isAlive === "是"}
                      onChange={() => {
                        setIsAlive("是");
                        handleErrorReset("isAlive");
                        handleErrorReset("deathDate");
                        handleErrorReset("deathReason");
                        handleErrorReset("diseaseCategory");
                        handleErrorReset("diseaseCategorySub");
                      }}
                      className="w-4 h-4 text-emerald-600"
                      id="alive-yes-radio"
                    />
                    <span>健在 (继续填写后续社会行为及器官慢性病)</span>
                  </label>

                  <label className="flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium bg-white text-rose-800 border-rose-250">
                    <input 
                      type="radio" 
                      name="isAlive"
                      checked={isAlive === "否"}
                      onChange={() => {
                        setIsAlive("否");
                        handleErrorReset("isAlive");
                        handleErrorReset("hasMigrated");
                        handleErrorReset("hasNewDiagnosis");
                        handleErrorReset("diseaseTable");
                      }}
                      className="w-4 h-4 text-rose-600"
                      id="alive-no-radio"
                    />
                    <span className="text-rose-700 font-bold">已故 (转移至死亡数据直报归档模板)</span>
                  </label>
                </div>

                {errors.some(e => e.field === "isAlive") && (
                  <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "isAlive")?.message}
                  </p>
                )}
              </div>

              {/* 死亡详细报表 (Only displays if isAlive === "否") */}
              {isAlive === "否" && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-4 animate-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center gap-2 text-rose-900">
                    <Heart className="w-4.5 h-4.5 text-rose-600 fill-rose-600 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">公卫体征 - 老年人死产/死亡登记字段卡</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* A4A 死亡日期 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-900 flex items-center gap-1">
                        A4A 具体死亡时间 <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date"
                        value={deathDate}
                        onChange={(e) => {
                          setDeathDate(e.target.value);
                          handleErrorReset("deathDate");
                        }}
                        id="form-death-date"
                        className={`w-full rounded-md border text-slate-800 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 ${errors.some(e => e.field === "deathDate") ? "border-red-500" : "border-slate-300 focus:ring-rose-500"}`}
                      />
                      {errors.some(e => e.field === "deathDate") && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "deathDate")?.message}
                        </p>
                      )}
                    </div>

                    {/* A4B 具体死亡原因 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-900">
                        A4B 粗分大类死亡原因 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4 h-9 items-center">
                        {["意外死亡", "死于疾病", "自然死亡"].map((dr) => (
                          <label key={dr} className="flex items-center gap-1.5 text-xs text-rose-950 cursor-pointer">
                            <input 
                              type="radio"
                              name="deathReason"
                              checked={deathReason === dr}
                              onChange={() => {
                                setDeathReason(dr as any);
                                handleErrorReset("deathReason");
                                setAccidentalReason("");
                                setDiseaseCategory("");
                                setDiseaseCategorySub("");
                              }}
                              className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-500"
                            />
                            {dr}
                          </label>
                        ))}
                      </div>
                      {errors.some(e => e.field === "deathReason") && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "deathReason")?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Condition A: 意外死亡详情 */}
                  {deathReason === "意外死亡" && (
                    <div className="bg-white border border-rose-100 p-3.5 rounded-lg space-y-3 animate-in fade-in">
                      <label className="text-xs font-semibold text-slate-800 block">
                        请选择意外死亡的具体事故大类： <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input 
                            type="radio"
                            name="accidentalReason"
                            checked={accidentalReason === "跌倒"}
                            onChange={() => {
                              setAccidentalReason("跌倒");
                              handleErrorReset("accidentalReason");
                            }}
                            className="w-3.5 h-3.5 text-teal-600"
                          />
                          跌倒造成的损伤病发去世
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input 
                            type="radio"
                            name="accidentalReason"
                            checked={accidentalReason === "其他"}
                            onChange={() => {
                              setAccidentalReason("其他");
                              handleErrorReset("accidentalReason");
                            }}
                            className="w-3.5 h-3.5 text-teal-600"
                          />
                          其他意外（车祸、窒息、中毒等）
                        </label>
                      </div>

                      {errors.some(e => e.field === "accidentalReason") && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "accidentalReason")?.message}
                        </p>
                      )}

                      {accidentalReason === "其他" && (
                        <div className="space-y-1.5 mt-2 animate-in slide-in-from-top-1">
                          <span className="text-xs text-slate-500 block">意外事故详情说明：</span>
                          <Input 
                            value={accidentalReasonOther}
                            onChange={(e) => {
                              setAccidentalReasonOther(e.target.value);
                              handleErrorReset("accidentalReasonOther");
                            }}
                            id="accid-other-explanation"
                            placeholder="如：家中烹饪天然气意外、高处等其余特定原因..."
                            className={`bg-white text-xs ${errors.some(e => e.field === "accidentalReasonOther") ? "border-red-500" : ""}`}
                          />
                          {errors.some(e => e.field === "accidentalReasonOther") && (
                            <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3. h-3" /> {errors.find(e => e.field === "accidentalReasonOther")?.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Condition B: 死于疾病详情表 */}
                  {deathReason === "死于疾病" && (
                    <div className="bg-white border border-rose-100 p-3.5 rounded-lg space-y-4 animate-in fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-800 block">
                          请在以下特定公卫匹配疾病大类中作出单选： <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {[
                            "脑血管病",
                            "缺血性心脏病",
                            "慢性阻塞性肺病",
                            "高血压",
                            "糖尿病",
                            "恶性肿瘤",
                            "其他"
                          ].map((cat) => (
                            <label key={cat} className={`flex items-center gap-1.5 p-2 rounded border cursor-pointer transition ${diseaseCategory === cat ? "border-teal-500 bg-teal-50/20 text-teal-900" : "border-slate-200 hover:bg-slate-50"}`}>
                              <input 
                                type="radio"
                                name="diseaseCategory"
                                checked={diseaseCategory === cat}
                                onChange={() => {
                                  setDiseaseCategory(cat);
                                  handleErrorReset("diseaseCategory");
                                  handleErrorReset("diseaseCategorySub");
                                  setDiseaseCategorySub("");
                                }}
                                className="w-3.5 h-3.5 text-teal-600"
                              />
                              {cat}
                            </label>
                          ))}
                        </div>
                        {errors.some(e => e.field === "diseaseCategory") && (
                          <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "diseaseCategory")?.message}
                          </p>
                        )}
                      </div>

                      {/* Multistep subcategories selectors depending on Disease Selection */}
                      {diseaseCategory !== "" && (
                        <div className="p-3 bg-slate-50 border border-slate-150 rounded space-y-2.5 animate-in slide-in-from-top-1.5">
                          {/* Subcategory: 脑血管病 */}
                          {diseaseCategory === "脑血管病" && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-slate-800 block">脑血管细分死亡病历亚：</span>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {["蛛网膜下腔出血", "脑出血", "脑梗死", "脑卒中", "其他脑血管病"].map(sub => (
                                  <label key={sub} className="flex items-center gap-1 mr-2 text-slate-700 cursor-pointer">
                                    <input 
                                      type="radio"
                                      name="diseaseCategorySub"
                                      checked={diseaseCategorySub === sub}
                                      onChange={() => {
                                        setDiseaseCategorySub(sub);
                                        handleErrorReset("diseaseCategorySub");
                                      }}
                                      className="w-3.5 h-3.5 text-teal-600"
                                    />
                                    {sub}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Subcategory: 缺血性心脏病 */}
                          {diseaseCategory === "缺血性心脏病" && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-slate-800 block">心脏疾病二级确诊死因：</span>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {["心肌梗死", "冠心病", "其他缺血性心脏病"].map(sub => (
                                  <label key={sub} className="flex items-center gap-1 mr-2 text-slate-700 cursor-pointer">
                                    <input 
                                      type="radio"
                                      name="diseaseCategorySub"
                                      checked={diseaseCategorySub === sub}
                                      onChange={() => {
                                        setDiseaseCategorySub(sub);
                                        handleErrorReset("diseaseCategorySub");
                                      }}
                                      className="w-3.5 h-3.5 text-teal-600"
                                    />
                                    {sub}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Subcategory: 慢性阻塞性肺病 */}
                          {diseaseCategory === "慢性阻塞性肺病" && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-slate-800 block">慢阻肺死亡判定子级：</span>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {["支气管炎", "慢性支气管炎", "肺气肿", "其他慢阻肺"].map(sub => (
                                  <label key={sub} className="flex items-center gap-1 mr-2 text-slate-700 cursor-pointer">
                                    <input 
                                      type="radio"
                                      name="diseaseCategorySub"
                                      checked={diseaseCategorySub === sub}
                                      onChange={() => {
                                        setDiseaseCategorySub(sub);
                                        handleErrorReset("diseaseCategorySub");
                                      }}
                                      className="w-3.5 h-3.5 text-teal-600"
                                    />
                                    {sub}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Text inputs for rest: 高血压 / 糖尿病 / 恶性肿瘤 / 其他 */}
                          {["高血压", "糖尿病", "恶性肿瘤", "其他"].includes(diseaseCategory) && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-slate-800">
                                {diseaseCategory === "高血压" ? "请补充输入具体高血压类型细分（如H型、肾血管性高血压等）：" :
                                 diseaseCategory === "糖尿病" ? "请补充输入糖尿病精细分型（如1型、2型伴特定并发症等）：" :
                                 diseaseCategory === "恶性肿瘤" ? "请输入原发器官及部位（如左肺门腺癌、原发性肝细胞癌等）：" :
                                 "请输入具体的原发或直接死因疾病名称："} <span className="text-red-500">*</span>
                              </span>
                              <Input 
                                value={diseaseCategorySub}
                                onChange={(e) => {
                                  setDiseaseCategorySub(e.target.value);
                                  handleErrorReset("diseaseCategorySub");
                                }}
                                id="death-spec-dis-text"
                                placeholder={`请输入${diseaseCategory}的具体临床死因详情`}
                                className="bg-white text-xs"
                              />
                            </div>
                          )}

                          {errors.some(e => e.field === "diseaseCategorySub") && (
                            <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" /> {errors.find(e => e.field === "diseaseCategorySub")?.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3 bg-white/70 border rounded text-[11px] text-red-950/80 leading-relaxed italic">
                    🔔 Tips: 填报完成该调查人死亡随访信息卡后，后续将不显示 A5-A10A 部分。提报后系统将从健在老年人集中体检序列里剔除该老年人，归入历史死亡归档。
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: 迁移与日常生活习惯 (Only displays if isContacted === "是" and isAlive === "是") */}
        {isContacted === "是" && isAlive === "是" && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            
            {/* Address & Migration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="section-migration">
              <div className="bg-teal-50/60 px-5 py-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
                  居住地变迁与迁移情况
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    A5 确认过去12个月内，该老年人在居住地变迁上是否已发生本地辖区/跨区跨省迁移行为？ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="hasMigrated"
                        checked={hasMigrated === "是"}
                        onChange={() => {
                          setHasMigrated("是");
                          handleErrorReset("hasMigrated");
                        }}
                        className="w-3.5 h-3.5 text-teal-600"
                        id="migration-yes-radio"
                      />
                      是 (已经异地搬家，核对新结构化地址)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="hasMigrated"
                        checked={hasMigrated === "否"}
                        onChange={() => {
                          setHasMigrated("否");
                          handleErrorReset("hasMigrated");
                          handleErrorReset("addressCounty");
                          handleErrorReset("addressTown");
                          handleErrorReset("addressDetail");
                        }}
                        className="w-3.5 h-3.5 text-teal-600"
                        id="migration-no-radio"
                      />
                      否 (住址无变动)
                    </label>
                  </div>
                </div>

                {/* Structured address fields if migrated */}
                {hasMigrated === "是" && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5 animate-in slide-in-from-top-1">
                    <span className="text-xs text-slate-800 font-bold block border-b border-slate-200 pb-1 flex items-center gap-1.5 text-teal-800">
                      填写更新后续迁移结构化地址：
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Prov / City */}
                      <div className="space-y-1">
                        <span className="text-xs text-slate-600">直辖区/省市：</span>
                        <Input 
                          value={addressProvinceCounty}
                          onChange={(e) => setAddressProvinceCounty(e.target.value)}
                          placeholder="广东省广州市"
                          className="bg-white text-xs h-8"
                        />
                      </div>
                      
                      {/* County */}
                      <div className="space-y-1">
                        <span className="text-xs text-slate-600">对应区/县： <span className="text-red-500">*</span></span>
                        <Input 
                          value={addressCounty}
                          onChange={(e) => {
                            setAddressCounty(e.target.value);
                            handleErrorReset("addressCounty");
                          }}
                          id="migrated-county"
                          placeholder="如：天河区"
                          className={`bg-white text-xs h-8 ${errors.some(e => e.field === "addressCounty") ? "border-red-500" : ""}`}
                        />
                      </div>

                      {/* Town */}
                      <div className="space-y-1">
                        <span className="text-xs text-slate-600">对应乡/镇/街道： <span className="text-red-500">*</span></span>
                        <Input 
                          value={addressTown}
                          onChange={(e) => {
                            setAddressTown(e.target.value);
                            handleErrorReset("addressTown");
                          }}
                          id="migrated-town"
                          placeholder="如：林和街道"
                          className={`bg-white text-xs h-8 ${errors.some(e => e.field === "addressTown") ? "border-red-500" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-600">详细地址/门牌号： <span className="text-red-500">*</span></span>
                      <Input 
                        value={addressDetail}
                        onChange={(e) => {
                          setAddressDetail(e.target.value);
                          handleErrorReset("addressDetail");
                        }}
                        id="migrated-detail"
                        placeholder="如：XX路A号小区3栋502房"
                        className={`bg-white text-xs ${errors.some(e => e.field === "addressDetail") ? "border-red-500" : ""}`}
                      />
                      {errors.some(e => e.field === "addressDetail") && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 地址必填项未录入完毕
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daily habits information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="section-habits">
              <div className="bg-teal-50/60 px-5 py-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">4</span>
                  日常生活、行为习惯及功能自评
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Smoking */}
                  <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block">A6 目前吸烟情况</span>
                    <div className="space-y-1 mt-1.5">
                      {["从不吸烟", "吸烟", "曾经吸烟，已戒烟"].map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer py-0.5">
                          <input 
                            type="radio" 
                            name="smokingStatus"
                            checked={smokingStatus === opt}
                            onChange={() => setSmokingStatus(opt)}
                            className="bg-white"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Drinking */}
                  <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block">A7 目前饮酒情况</span>
                    <div className="space-y-1 mt-1.5">
                      {["从不饮酒", "饮酒", "曾经饮酒，已戒酒"].map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer py-0.5">
                          <input 
                            type="radio" 
                            name="drinkingStatus"
                            checked={drinkingStatus === opt}
                            onChange={() => setDrinkingStatus(opt)}
                            className="bg-white"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ADL support needs */}
                  <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block">A8 目前生活起居是否需要帮助</span>
                    <div className="space-y-1 mt-1.5">
                      {[
                        "不需要帮助", 
                        "需要简单辅助工具，如拐杖", 
                        "需要别人辅助", 
                        "完全依赖别人"
                      ].map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer py-0.5">
                          <input 
                            type="radio" 
                            name="needLifeHelp"
                            checked={needLifeHelp === opt}
                            onChange={() => setNeedLifeHelp(opt)}
                            className="bg-white"
                          />
                          <span className="truncate">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* A9 新诊断疾病判定 */}
                <div className="space-y-2 p-3.5 bg-emerald-50/40 rounded-lg border border-emerald-150">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    A9 调查得知：过去12个月内，该老年人是否有被乡、区级或以上医院医生新诊断过某种新发慢性疾病？ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold bg-white border rounded px-3 py-1.5 text-slate-800">
                      <input 
                        type="radio" 
                        name="hasNewDiagnosis"
                        checked={hasNewDiagnosis === "是"}
                        onChange={() => {
                          setHasNewDiagnosis("是");
                          handleErrorReset("hasNewDiagnosis");
                          setActiveTab("A10A");
                        }}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        id="new-diag-yes-radio"
                      />
                      <span>是 (点击后展现并必须勾选下方 A10A 慢病登记表格)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold bg-white border rounded px-3 py-1.5 text-slate-800">
                      <input 
                        type="radio" 
                        name="hasNewDiagnosis"
                        checked={hasNewDiagnosis === "否"}
                        onChange={() => {
                          setHasNewDiagnosis("否");
                          handleErrorReset("hasNewDiagnosis");
                          handleErrorReset("diseaseTable");
                        }}
                        className="w-4 h-4 text-emerald-600"
                        id="new-diag-no-radio"
                      />
                      <span>否 (健康档案慢病持平)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: A10A 慢病登记表格 (Only displays if satisfies logic constraints) */}
            {hasNewDiagnosis === "是" && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" id="section-a10a">
                <div className="bg-teal-700 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-1.5" id="section-a10a-header">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      A10A 基层公卫随访特设：新诊断大类慢病记录登记表
                    </h3>
                    <p className="text-[10px] text-teal-200 mt-1">
                      请先勾选左侧列表复选框，再行填写该疾病对应的 ICD、首次诊断时间、医院、住院史等情况。
                    </p>
                  </div>

                  {/* Disease Table quick Search filter */}
                  <div className="relative shrink-0 max-w-xs">
                    <Input 
                      placeholder="快检疾病/ICD编码..."
                      value={diseaseSearchQuery}
                      onChange={(e) => setDiseaseSearchQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/55 text-xs h-8 pl-8 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400"
                    />
                    <span className="absolute left-2.5 top-2 text-white/50">🔍</span>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10 shadow-xs">
                      <tr>
                        <th className="p-3 w-12 text-center">选择</th>
                        <th className="p-3 w-40">疾病名称</th>
                        <th className="p-3 w-28">ICD编码</th>
                        <th className="p-3 w-36">首次诊断时间 <span className="text-red-500">*</span></th>
                        <th className="p-3 w-44">首次诊断医院 <span className="text-red-500">*</span></th>
                        <th className="p-3 w-28">是否住院 <span className="text-red-500">*</span></th>
                        <th className="p-3 min-w-44">补充信息(部位、剂量等限200字)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredA10ADiseases.length > 0 ? (
                        filteredA10ADiseases.map((dis) => {
                          const state = checkedDiseases[dis.name] || {
                            checked: false, diagnosedDate: "", diagnosedHospital: "", hospitalized: "", additionalInfo: "", tumorSite: "肺部"
                          };
                          const diagDateError = errors.some(e => e.field === `disease_date_${dis.name}`);
                          const diagHospError = errors.some(e => e.field === `disease_hosp_${dis.name}`);
                          const hospitalizedError = errors.some(e => e.field === `disease_hospz_${dis.name}`);

                          return (
                            <tr key={dis.name} className={`transition ${state.checked ? "bg-teal-50/30 font-semibold" : "bg-white hover:bg-slate-50/40 opacity-75"}`}>
                              {/* 1. Checkbox Selection */}
                              <td className="p-3 text-center">
                                <input 
                                  type="checkbox"
                                  checked={state.checked}
                                  onChange={() => handleCheckboxToggle(dis.name)}
                                  className="w-4.5 h-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                  id={`checkbox-${dis.name}`}
                                />
                              </td>

                              {/* 2. Disease Name */}
                              <td className="p-3">
                                <span className={`block ${state.checked ? "text-slate-900 font-bold text-teal-800" : "text-slate-600"}`}>
                                  {dis.name}
                                </span>
                              </td>

                              {/* 3. ICD Code */}
                              <td className="p-3">
                                <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                  {dis.icd}
                                </span>
                              </td>

                              {/* 4. Diagnosed Date */}
                              <td className="p-3">
                                <input 
                                  type="date"
                                  disabled={!state.checked}
                                  value={state.diagnosedDate}
                                  onChange={(e) => handleDiseaseFieldChange(dis.name, "diagnosedDate", e.target.value)}
                                  className={`w-full text-xs px-2 py-1 rounded border bg-white focus:outline-none ${!state.checked ? "bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400" : diagDateError ? "border-red-500 bg-red-50" : "border-slate-300 focus:ring-1 focus:ring-teal-500"}`}
                                  id={`date-${dis.name}`}
                                />
                              </td>

                              {/* 5. Diagnosed Hospital */}
                              <td className="p-3">
                                <input 
                                  type="text"
                                  disabled={!state.checked}
                                  value={state.diagnosedHospital}
                                  onChange={(e) => handleDiseaseFieldChange(dis.name, "diagnosedHospital", e.target.value)}
                                  placeholder="如:区中医院"
                                  className={`w-full text-xs px-2 py-1 rounded border bg-white focus:outline-none ${!state.checked ? "bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400" : diagHospError ? "border-red-500 bg-red-50" : "border-slate-300 focus:ring-1 focus:ring-teal-500"}`}
                                  id={`hosp-${dis.name}`}
                                />
                              </td>

                              {/* 6. Hospitalized (Yes/No) */}
                              <td className="p-3">
                                <div className="flex gap-2.5 items-center">
                                  <label className={`flex items-center gap-1 cursor-pointer ${!state.checked ? "text-slate-400" : "text-slate-700"}`}>
                                    <input 
                                      type="radio"
                                      disabled={!state.checked}
                                      name={`hospitalized-${dis.name}`}
                                      checked={state.hospitalized === "是"}
                                      onChange={() => handleDiseaseFieldChange(dis.name, "hospitalized", "是")}
                                      className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                                      id={`hospital-yes-${dis.name}`}
                                    />
                                    是
                                  </label>
                                  <label className={`flex items-center gap-1 cursor-pointer ${!state.checked ? "text-slate-400" : "text-slate-700"}`}>
                                    <input 
                                      type="radio" 
                                      disabled={!state.checked}
                                      name={`hospitalized-${dis.name}`}
                                      checked={state.hospitalized === "否"}
                                      onChange={() => handleDiseaseFieldChange(dis.name, "hospitalized", "否")}
                                      className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                                      id={`hospital-no-${dis.name}`}
                                    />
                                    否
                                  </label>
                                </div>
                                {state.checked && hospitalizedError && <span className="text-[9px] text-red-500 block">必选</span>}
                              </td>

                              {/* 7. Additional Info (Plus option values for cancer) */}
                              <td className="p-3">
                                <div className="space-y-1.5 max-w-sm">
                                  {dis.name === "恶性肿瘤" && state.checked && (
                                    <div className="flex items-center gap-1 bg-amber-50 p-1 border border-amber-200 rounded animate-in fade-in">
                                      <span className="text-[10px] text-amber-800 shrink-0 select-none">部位下拉：</span>
                                      <select 
                                        value={state.tumorSite}
                                        onChange={(e) => handleDiseaseFieldChange(dis.name, "tumorSite", e.target.value)}
                                        className="text-[10px] p-0.5 bg-white border border-slate-300 rounded focus:ring-teal-500 focus:outline-none flex-1"
                                        id="tumor-site-select"
                                      >
                                        {["肺部", "食道", "胃", "肝", "肠", "乳房", "前列腺", "子宫颈", "子宫体", "卵巢", "甲状腺", "其他"].map(site => (
                                          <option key={site} value={site}>{site}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                  <input 
                                    type="text"
                                    disabled={!state.checked}
                                    maxLength={200}
                                    value={state.additionalInfo}
                                    onChange={(e) => handleDiseaseFieldChange(dis.name, "additionalInfo", e.target.value)}
                                    placeholder={dis.name === "恶性肿瘤" ? "可备注补充肿瘤组织类型" : "备注诊断详情，限200字"}
                                    className={`w-full text-xs px-2 py-1 rounded border bg-white focus:outline-none ${!state.checked ? "bg-slate-100 border-slate-200 cursor-not-allowed text-slate-300" : "border-slate-300 focus:ring-1 focus:ring-teal-500"}`}
                                    id={`info-${dis.name}`}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center p-8 text-slate-400 italic">
                            没有找到对应的慢性病编码（请精炼关键字或者ICD搜索值）
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {errors.some(e => e.field === "diseaseTable") && (
                  <div className="p-3.5 bg-red-50 border-t border-red-200 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5" />
                    <strong>必填校验：</strong>{errors.find(e => e.field === "diseaseTable")?.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>

      {/* 4. Bottom Sticky Actions */}
      <div className="bg-white border-t border-slate-200 p-4.5 shrink-0 flex items-center justify-between shadow-lg">
        <div className="text-xs text-slate-500">
          随访表单状态：<span className="font-semibold text-slate-700">正在录入 ({person.name})</span>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            id="cancel-follow-btn"
            className="text-slate-600 hover:bg-slate-100 border-slate-300 py-2 px-5 min-w-28 text-xs font-semibold"
          >
            取消
          </Button>
          <Button 
            onClick={handleSaveSubmit}
            id="submit-follow-btn"
            className="bg-teal-600 hover:bg-teal-700 hover:shadow text-white py-2 px-6 min-w-36 text-xs font-bold"
          >
            保存随访记录
          </Button>
        </div>
      </div>
    </div>
  );
}
