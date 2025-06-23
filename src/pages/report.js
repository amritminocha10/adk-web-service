import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import LineImg from "../assets/Line.svg";
import MiracleLogo from "../assets/miracle-logo.png";

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const repostedData = location.state?.repostedData || {};
  const totalProcessingTime = location.state?.totalProcessingTime || 1.2;

  const [status, setStatus] = useState("Rejected");
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [claimId, setClaimId] = useState(
    localStorage.getItem("vin") || "Unknown"
  );

  useEffect(() => {
    try {
      const parsed =
        typeof repostedData.message === "string"
          ? JSON.parse(repostedData.message)
          : repostedData.message;
      console.log("Parsed data:", parsed);
      const finalReport = parsed?.final_report || "";
      setReportMarkdown(finalReport);

      const idMatch = finalReport.match(/\b\d{17}\b/);
      setClaimId(
        idMatch ? idMatch[0] : localStorage.getItem("vin") || "Unknown"
      );

      const parsedStatus = parsed?.status?.toLowerCase();
      console.log("Parsed status:", parsedStatus);

      if (parsedStatus === "rejected" || parsedStatus === "reject") {
        setStatus("Rejected");
      } else if (parsedStatus === "approved") {
        setStatus("Approved");
      } else if (parsedStatus === "partialaccept") {
        setStatus("Partially Accepted");
      }
    } catch (err) {
      setReportMarkdown("**⚠️ Error parsing report data.**");
      setStatus("");
    }
  }, [repostedData]);

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
          <div className="container flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 text-[#00aae7]" />
              <span className="text-xl font-bold text-slate-800">
                Auto Claim 360
              </span>
            </div>
            <img
              className="w-36 object-cover"
              src={MiracleLogo}
              alt="Chat Header"
            />
          </div>
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
        <div className="">
          <div className="w-full max-w-[600px] mx-auto mb-3">
            {/* Labels Row */}
            <div className="flex justify-between text-sm text-gray-800 mb-1">
              <span>Overall Progress</span>
              <span>Time taken: {totalProcessingTime} seconds</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 flex items-center">
              <div
                className="bg-[#00aae7] h-2.5 rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="bg-[#00AAE71A] rounded-tl-[5px] rounded-tr-[5px] overflow-hidden flex shadow-sm">
            {steps.map((step, idx) => (
              <div className="flex items-center flex-1" key={idx}>
                <div
                  className="flex-1 relative flex flex-col items-center justify-center p-4 space-y-2"
                  key={idx}
                >
                  <span className="font-semibold text-slate-800 text-sm text-center">
                    {step}
                  </span>
                  <div className="bg-[#0d416b] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                {idx !== steps.length - 1 && (
                  <img src={LineImg} alt="Arrow Right" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Claim Summary */}
        <Card className="mb-4 shadow-md h-[480px] overflow-auto border-none">
          <CardHeader>
            <CardTitle>Claim Overview</CardTitle>
          </CardHeader>
          <div className="pl-4 pr-6 flex justify-between items-center">
            <p>
              <strong>Claim ID:</strong> {claimId}
            </p>
            {status && (
              <Badge
                className={`flex ${
                  status === "Rejected"
                    ? "bg-miracle-red/90"
                    : "bg-miracle-lightBlue"
                } text-white font-semibold p-1`}
              >
                {status}
              </Badge>
            )}
          </div>
          <CardContent className="space-y-4">
            <hr className="border-2 border-[#00aae7] my-2" />
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
