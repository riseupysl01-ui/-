import * as React from "react";
import { FlaskConical } from "lucide-react";

export function SpecimensPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-indigo-500 shrink-0" />
            <span>生物标本</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
