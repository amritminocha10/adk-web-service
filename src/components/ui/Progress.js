import React from "react"

export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-[#00aae7] h-full transition-all duration-300 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
