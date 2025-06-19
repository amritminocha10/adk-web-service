import React from "react"
import classNames from "classnames"

export function Card({ children, className = "" }) {
  return (
    <div className={classNames("bg-white rounded-xl border border-slate-200", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children }) {
  return <div className="p-4 border-b border-slate-200">{children}</div>
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-semibold text-slate-800">{children}</h3>
}

export function CardContent({ children, className = "" }) {
  return <div className={classNames("p-4", className)}>{children}</div>
}
