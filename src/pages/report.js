import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ArrowLeft, Shield, Download } from "lucide-react"

export default function Report() {
  const navigate = useNavigate()

  const handleDownload = () => alert("Downloading PDF report...")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/processing")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">AutoClaim360</span>
            </div>
          </div>
          <Button onClick={handleDownload} className="bg-blue-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Claim Analysis Report</h1>

        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle>Claim Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Claim ID: <strong>CLM-2024-001234</strong></p>
            <p>VIN: <strong>1HGBH41JXMN109186</strong></p>
            <p>Status: <Badge variant="secondary">Approved</Badge></p>
            <p>Estimated Cost: <strong>$2,450.00</strong></p>
            <p>Payout: <strong className="text-green-600">$1,950.00</strong></p>
            <p>Reason: <em>Damage covered under comprehensive coverage</em></p>
          </CardContent>
        </Card>

        <Button onClick={() => navigate("/")} variant="outline" className="w-full">
          Submit New Claim
        </Button>
      </div>
    </div>
  )
}
