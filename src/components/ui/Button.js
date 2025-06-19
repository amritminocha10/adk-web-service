import React from "react"
import classNames from "classnames"

export function Button({ children, onClick, className = "", type = "button", variant = "default", size = "md", disabled = false }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-100",
  }

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
