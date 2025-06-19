import React from "react"
import classNames from "classnames"

export function Badge({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    outline: "border border-current text-slate-600",
    secondary: "bg-blue-100 text-blue-800",
  }

  return (
    <span className={classNames("inline-block text-sm font-medium px-3 py-1 rounded-full", variants[variant], className)}>
      {children}
    </span>
  )
}
