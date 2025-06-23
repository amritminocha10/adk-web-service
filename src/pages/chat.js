import React from "react"
import { useNavigate } from "react-router-dom"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/Button"
import MiracleLogo from "../assets/miracle-logo.png"

export default function Chat() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="h-7 w-7 text-[#00aae7]" />
            <span className="text-xl font-bold text-slate-800">Auto Claim 360</span>
          </div>
        </div>
        <img className="w-36 object-cover" src={MiracleLogo} alt="Chat Header" />
      </header>

      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Need Help?</h1>
        <p className="text-slate-600 mb-6">Our support team will reach out shortly.</p>
        <Button variant="outline" onClick={() => alert("Chatbot or contact form would be triggered.")}>
          Start Chat
        </Button>
      </div>
    </div>
  )
}
