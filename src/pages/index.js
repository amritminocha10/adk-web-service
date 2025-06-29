import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, FileCheck, Users } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import MiracleLogo from "../assets/miracle-logo.png"

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-7 text-[#00aae7]" />
            <span className="text-2xl font-bold text-slate-800">
              Auto Claim 360
            </span>
          </div>
        <img className="w-36 object-cover" src={MiracleLogo} alt="Chat Header" />

        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
          AI-Powered Vehicle Damage Claims in{" "}
          <span style={{ color: "#00AAE7" }}>Minutes</span>
        </h1>
        <p className="text-xl md:text-xl text-slate-600 mb-8 leading-relaxed">
          Upload photos of your damaged vehicle and let our intelligent agents
          handle the rest.
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl"
          onClick={() => navigate("/upload")}
        >
          Start Your Claim
        </Button>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Why Choose Auto Claim-360?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-12 w-12 text-[#00aae7] mx-auto mb-4" />,
                title: "Lightning Fast",
                desc: "Process claims in minutes. Our AI agents work 24/7 to analyze damage.",
              },
              {
                icon: (
                  <FileCheck className="h-12 w-12 text-[#00aae7] mx-auto mb-4" />
                ),
                title: "Accurate Analysis",
                desc: "Advanced vision technology ensures precise assessments and fair claims.",
              },
              {
                icon: (
                  <Users className="h-12 w-12 text-[#00aae7] mx-auto mb-4" />
                ),
                title: "Multi-Agent Intelligence",
                desc: "Built using Google’s ADK, our AI agents work together to analyze damage, validate claims, and streamline approvals.",
              },
            ].map(({ icon, title, desc }, idx) => (
              <Card
                key={idx}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  {icon}
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {title}
                  </h3>
                  <p className="text-slate-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
