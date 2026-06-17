// import React from "react";
// import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// interface ConsistencyCalendarProps {
//   calendarYear: number;
//   setCalendarYear: (year: number) => void;
//   dayLabels: string[];
//   yearMonths: {
//     monthIndex: number;
//     name: string;
//     weeks: { status: "completed" | "missed" | "pending" | "empty"; date?: Date }[][];
//   }[];
// }

// export function ConsistencyCalendar({
//   calendarYear,
//   setCalendarYear,
//   dayLabels,
//   yearMonths,
// }: ConsistencyCalendarProps) {
//   return (
//     <div className="mb-6">
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
//         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold flex items-center gap-2">
//               <Calendar className="w-5 h-5" /> Consistency Calendar
//             </h2>
//             <div className="flex items-center gap-3">
//               <button onClick={() => setCalendarYear(calendarYear - 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               <span className="text-sm font-medium min-w-[60px] text-center">{calendarYear}</span>
//               <button onClick={() => setCalendarYear(calendarYear + 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto pb-4">
//             <div className="flex gap-4 min-w-max">
//               <div className="flex flex-col gap-[3px] mt-[20px] shrink-0">
//                 {dayLabels.map((d) => (
//                   <div key={d} className="h-[13px] flex items-center">
//                     <span className="text-[10px] text-zinc-500 w-6 text-right">{d}</span>
//                   </div>
//                 ))}
//               </div>
//               {yearMonths.map((month) => (
//                 <div key={month.name} className="flex flex-col gap-1">
//                   <div className="text-xs text-zinc-500 font-medium ml-1">{month.name}</div>
//                   <div className="flex gap-[3px]">
//                     {month.weeks.map((week, weekIdx) => (
//                       <div key={weekIdx} className="flex flex-col gap-[3px]">
//                         {week.map((cell, dayIdx) => (
//                           <div
//                             key={dayIdx}
//                             className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${
//                               cell.status === "completed" ? "bg-[#10B981]/25 border border-[#10B981]/40" :
//                               cell.status === "missed" ? "bg-[#EF4444]/25 border border-[#EF4444]/40" :
//                               cell.status === "pending" ? "bg-[#374151]" : "bg-transparent"
//                             }`}
//                             title={cell.date ? `${cell.date.toLocaleDateString()} — ${cell.status}` : ""}
//                           />
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-white/10">
//             {[["completed","#10B981"], ["missed","#EF4444"], ["pending","#374151"]].map(([label, color]) => (
//               <div key={label} className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: `${color}40`, border: `1px solid ${color}66` }} />
//                 <span className="text-xs text-zinc-400 capitalize">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ConsistencyCalendarProps {
  dayLabels: string[];
  yearMonths: {
    monthIndex: number;
    name: string;
    weeks: {
      status: "completed" | "missed" | "pending" | "empty" | "future" | "inactive";
      date?: Date;
      count?: number;
    }[][];
  }[];
  onboardingComplete?: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isNextDisabled: boolean;
}

export function ConsistencyCalendar({
  dayLabels,
  yearMonths,
  onboardingComplete = true,
  onPrevMonth,
  onNextMonth,
  isNextDisabled,
}: ConsistencyCalendarProps) {
  const firstYear = yearMonths[0]?.name.split(" ")[1] || "";
  const lastYear = yearMonths[yearMonths.length - 1]?.name.split(" ")[1] || "";
  const yearLabel = firstYear === lastYear ? firstYear : (firstYear && lastYear ? `${firstYear} - ${lastYear}` : (firstYear || lastYear));

  return (
    <div className="h-full group/card">
      <div className="relative h-full">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl blur-lg opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-full shadow-lg transition-all">
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider select-none">
              {yearLabel}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevMonth}
                className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNextMonth}
                disabled={isNextDisabled}
                className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className={`overflow-x-auto pt-6 pb-2 transition-all duration-500 flex-1 flex items-center justify-start lg:justify-center ${!onboardingComplete ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            <div className="flex gap-2.5 min-w-max px-4 lg:px-6">
              
              {yearMonths.map((month) => (
                <div key={month.name} className="flex flex-col gap-2 items-center">
                  
                  <div className="flex gap-[2.5px]">
                    {month.weeks.map((week, weekIdx) => (
                      <div
                        key={weekIdx}
                        className="flex flex-col gap-[2.5px]"
                      >
                        {week.map((cell, dayIdx) => {
                          const isFuture = cell.status === "future";
                          const isEmpty = cell.status === "empty";
                          const isInactive = cell.status === "inactive";
                          
                          let greenClass = "bg-emerald-500 border border-emerald-400/40 hover:bg-emerald-400";
                          if (cell.status === "completed") {
                            if (cell.count === 1) {
                              greenClass = "bg-emerald-700/80 border border-emerald-600/30 hover:bg-emerald-600";
                            } else if (cell.count === 2) {
                              greenClass = "bg-emerald-500 border border-emerald-400/40 hover:bg-emerald-400";
                            } else if (cell.count && cell.count >= 3) {
                              greenClass = "bg-emerald-400 border border-emerald-300/50 hover:bg-emerald-300";
                            }
                          }

                          return (
                            <div
                              key={dayIdx}
                              className={`
                                group relative w-[10.5px] h-[10.5px] rounded-[1.5px] transition-all duration-200
                                ${cell.status === "completed" ? "hover:scale-125 cursor-pointer hover:z-50" : ""}
                                
                                ${
                                  cell.status === "completed"
                                    ? greenClass
                                    : cell.status === "missed"
                                    ? "bg-rose-500/25 border border-rose-500/40 hover:bg-rose-500/40"
                                    : cell.status === "pending" || cell.status === "inactive"
                                    ? "bg-[#27272a] border border-[#3f3f46]/30 hover:bg-[#3f3f46]"
                                    : cell.status === "future"
                                    ? "bg-[#27272a]/30 border border-[#3f3f46]/10"
                                    : "bg-transparent"
                                }
                              `}
                            >
                              {cell.status === "completed" && cell.date && (
                                <div
                                  className="absolute z-50 hidden group-hover:flex items-center pointer-events-none bottom-[15px] left-1/2 -translate-x-1/2 whitespace-nowrap border border-zinc-800/80 rounded-[3px] px-1.5 py-0.5 shadow-xl text-center text-[8px] font-bold text-zinc-200"
                                  style={{ backgroundColor: "#09090b", zIndex: 100 }}
                                >
                                  ✅ {cell.count} solved
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-zinc-500 font-bold tracking-tight uppercase">
                    {month.name.split(" ")[0]}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}