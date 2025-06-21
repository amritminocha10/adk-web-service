// import { useLocation, useNavigate } from "react-router-dom"
// import { Button } from "../components/ui/Button"
// import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card"
// import { Badge } from "../components/ui/Badge"
// import { ArrowLeft, Shield, Download } from "lucide-react"
// import ReactMarkdown from "react-markdown"
// import Footer from "../components/ui/Footer"

// export default function Report() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const steps = location.state?.steps || []
//   const repostedData = location.state?.repostedData || {}

//   const handleDownload = () => alert("Downloading PDF report...")

//   let finalReportMarkdown = ""
//   try {
//     const parsed = typeof repostedData.message === "string"
//       ? JSON.parse(repostedData.message)
//       : repostedData.message
//     finalReportMarkdown = parsed?.final_report || ""
//   } catch (err) {
//     finalReportMarkdown = "⚠️ Error parsing report data."
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <header className="border-b bg-white/80 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Button onClick={() => navigate("/processing")}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//             <div className="flex items-center space-x-2">
//               <Shield className="h-7 w-7 text-[#00aae7]" />
//               <span className="text-xl font-bold text-slate-800">AutoClaim360</span>
//             </div>
//           </div>
//           <Button onClick={handleDownload} className="bg-blue-600 text-white">
//             <Download className="h-4 w-4 mr-2" />
//             Download PDF
//           </Button>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-8 max-w-4xl max-h-96">
//         <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Claim Analysis Report</h1>

//         {/* Agent Summary Card (Markdown) */}
//         <Card className="mb-6 shadow-md h-[450px] overflow-auto">
//           <CardHeader className="fixed border-4 border-balck">
//             <CardTitle>Agent Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="prose prose-slate max-w-none">
//             <ReactMarkdown>{finalReportMarkdown}</ReactMarkdown>
//           </CardContent>
//         </Card>

//         <Button onClick={() => navigate("/")} className="w-full">
//           Submit New Claim
//         </Button>
//       </div>

//       <Footer />
//     </div>
//   )
// }
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, Shield, Download, CheckCircle } from "lucide-react";
import Footer from "../components/ui/Footer";
import ReactMarkdown from "react-markdown";

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const repostedData = location.state?.repostedData || {};

  const handleDownload = () => alert("Downloading PDF report...");

  let reportMarkdown = "";
  let claimId = "Unknown";
  let status = "Pending";

  try {
    const parsed =
      typeof repostedData.message === "string"
        ? JSON.parse(repostedData.message)
        : repostedData.message;

    reportMarkdown = parsed?.final_report || "";

    // Use 17-digit Claim ID pattern
    const idMatch = reportMarkdown.match(/\b\d{17}\b/);
    claimId = idMatch ? idMatch[0] : "Unknown";

    const recommendationMatch = reportMarkdown.match(
      /\*\*Recommendation:\*\* \*\*(.+?)\*\*/
    );
    if (recommendationMatch) {
      status = recommendationMatch[1].includes("REJECT")
        ? "Rejected"
        : "Approved";
    }
  } catch (err) {
    reportMarkdown = "**⚠️ Error parsing report data.**";
  }

  const statusColor = status === "Rejected" ? "bg-red-500" : "bg-[#00aae7]";

  const steps = [
    "Analyzing Damage",
    "Validating Metadata",
    "Checking Policy",
    "Generating Report",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/processing")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-[#00aae7]" />
              <span className="text-xl font-bold text-slate-800">
                AutoClaim360
              </span>
            </div>
          </div>
          <Button onClick={handleDownload} className="bg-blue-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-1 text-center">
          Claim analysis report
        </h1>
        <p className="text-gray-600 mb-6 text-2xl text-center">
          Here is the final report after reviewing your submission.
        </p>

        {/* Progress Cards */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-[#00aae7] h-2.5 rounded-full w-full transition-all duration-500"></div>
          </div>
          <div className="grid grid-cols-4 text-center text-sm text-gray-700">
            {steps.map((step, idx) => (
              <Card
                key={idx}
                className={`w-full rounded-none border-0 bg-[#00AAE71A] ${
                  idx !== steps.length - 1 ? "border-r border-gray-300" : ""
                }`}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                  <span className="font-semibold text-slate-800 text-lg text-center">
                    {step}
                  </span>
                  <div className="bg-[#0d416b] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Claim Summary */}
        <Card className="mb-4 shadow-md h-[370px] overflow-auto">
          <CardHeader>
            <CardTitle>Claim Overview</CardTitle>
          </CardHeader>
          <div className="pl-4 pr-6 flex justify-between items-center">
            <p>
              <strong>Claim ID:</strong> {claimId}
            </p>
            <Badge className={`${statusColor} text-white flex`}>{status}</Badge>
          </div>
          <CardContent className="space-y-4">
            <hr className="border-0.5 border-[#00aae7] my-2" />
            <div className="prose max-w-none prose-sm">
              <ReactMarkdown>{reportMarkdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => navigate("/")} className="w-full">
          Submit New Claim
        </Button>
      </main>

      <Footer />
    </div>
  );
}
