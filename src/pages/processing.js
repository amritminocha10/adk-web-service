import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Search, FileCheck, FileText, Clock, CheckCircle, Shield, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Progress } from "../components/ui/Progress"

export default function Processing() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState([
    { id: "vision", title: "Analyzing Damage", icon: <Eye />, status: "processing", progress: 0 },
    { id: "metadata", title: "Validating Metadata", icon: <Search />, status: "pending", progress: 0 },
    { id: "policy", title: "Checking Policy", icon: <FileCheck />, status: "pending", progress: 0 },
    { id: "report", title: "Generating Report", icon: <FileText />, status: "pending", progress: 0 },
  ])
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prev) => {
        const newSteps = [...prev]
        const current = newSteps.find((s) => s.status === "processing")
        if (current) {
          current.progress += 10
          if (current.progress >= 100) {
            current.status = "completed"
            const next = newSteps.find((s) => s.status === "pending")
            if (next) next.status = "processing"
            else {
              clearInterval(interval)
              setTimeout(() => navigate("/report"), 1000)
            }
          }
        }
        return newSteps
      })

      setOverallProgress((prev) => {
        const complete = steps.filter((s) => s.status === "completed").length
        const processing = steps.find((s) => s.status === "processing")
        const prog = processing ? processing.progress / 100 : 0
        return ((complete + prog) / steps.length) * 100
      })
    }, 500)

    return () => clearInterval(interval)
  }, [steps, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/upload")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">AutoClaim360</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Processing Your Claim</h1>
        <p className="text-slate-600 mb-4">AI agents are reviewing your submission</p>
        <Progress value={overallProgress} className="h-3 mb-8" />

        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.id} className="bg-white shadow-md">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className={`rounded-full p-2 ${step.status === "completed" ? "bg-green-500 text-white" : step.status === "processing" ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-600"}`}>
                  {step.status === "completed" ? <CheckCircle className="w-6 h-6" /> : step.status === "processing" ? <Clock className="w-6 h-6" /> : step.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-medium text-slate-800">{step.title}</h3>
                  {step.status === "processing" && <Progress value={step.progress} className="h-2 mt-2" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
