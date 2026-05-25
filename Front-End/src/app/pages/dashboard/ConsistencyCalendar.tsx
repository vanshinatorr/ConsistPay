import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ConsistencyCalendarProps {
  calendarYear: number;
  setCalendarYear: (year: number) => void;
  dayLabels: string[];
  yearMonths: {
    monthIndex: number;
    name: string;
    weeks: { status: "completed" | "missed" | "pending" | "empty"; date?: Date }[][];
  }[];
}

export function ConsistencyCalendar({
  calendarYear,
  setCalendarYear,
  dayLabels,
  yearMonths,
}: ConsistencyCalendarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Consistency Calendar
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setCalendarYear(calendarYear - 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium min-w-[60px] text-center">{calendarYear}</span>
              <button onClick={() => setCalendarYear(calendarYear + 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              <div className="flex flex-col gap-[3px] mt-[20px] shrink-0">
                {dayLabels.map((d) => (
                  <div key={d} className="h-[13px] flex items-center">
                    <span className="text-[10px] text-zinc-500 w-6 text-right">{d}</span>
                  </div>
                ))}
              </div>
              {yearMonths.map((month) => (
                <div key={month.name} className="flex flex-col gap-1">
                  <div className="text-xs text-zinc-500 font-medium ml-1">{month.name}</div>
                  <div className="flex gap-[3px]">
                    {month.weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-[3px]">
                        {week.map((cell, dayIdx) => (
                          <div
                            key={dayIdx}
                            className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${
                              cell.status === "completed" ? "bg-[#10B981]/25 border border-[#10B981]/40" :
                              cell.status === "missed" ? "bg-[#EF4444]/25 border border-[#EF4444]/40" :
                              cell.status === "pending" ? "bg-[#374151]" : "bg-transparent"
                            }`}
                            title={cell.date ? `${cell.date.toLocaleDateString()} — ${cell.status}` : ""}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-white/10">
            {[["completed","#10B981"], ["missed","#EF4444"], ["pending","#374151"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: `${color}40`, border: `1px solid ${color}66` }} />
                <span className="text-xs text-zinc-400 capitalize">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
