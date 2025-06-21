import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  Search,
  FileCheck,
  FileText,
  Clock,
  CheckCircle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import { Progress } from "../components/ui/Progress";
import miracleLogo from "../assets/miracle-logo.png";

const stepIcons = {
  vision: <Eye />,
  metadata: <Search />,
  policy: <FileCheck />,
  report: <FileText />,
};

const stepTitles = {
  vision: "Analyzing Damage",
  metadata: "Validating Metadata",
  policy: "Checking Policy",
  report: "Generating Report",
};

const authorToStepId = {
  InspectionAgent: "vision",
  VisionAgent: "vision",
  VinAgent: "metadata",
  KBSearchAgent: "policy",
  ReportAgent: "report",
};

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const initialSteps = ["vision", "metadata", "policy", "report"].map(
    (id, index) => ({
      id,
      title: stepTitles[id],
      status: index === 0 ? "processing" : "pending",
      progress: 0,
      message: "",
    })
  );

  const [steps, setSteps] = useState(initialSteps);
  const [overallProgress, setOverallProgress] = useState(1);
  const [expandedStep, setExpandedStep] = useState(null);
  const isFinished = useRef(false);
  const repostedData = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const controller = new AbortController();

    fetch(`http://127.0.0.1:8000/stream-claim/${sessionId}`, {
      method: "GET",
      signal: controller.signal,
    })
      .then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        const handleStreamEvent = (event) => {
          const { event: type, data } = event;
          const { author, message, done } = data;

          if (author === "ReportAgent" && type === "final") {
            repostedData.current = data;
          }

          const stepId = authorToStepId[author];
          if (!stepId) return;

          setSteps((prevSteps) =>
            prevSteps.map((step) => {
              if (step.id === stepId) {
                const newProgress = done
                  ? 100
                  : Math.min(step.progress + 25, 99);
                return {
                  ...step,
                  status: done ? "completed" : "processing",
                  progress: newProgress,
                  message: done ? message : step.message,
                };
              } else if (step.status !== "completed") {
                return { ...step, status: "pending", progress: 0 };
              }
              return step;
            })
          );
        };

        const processStream = async () => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const jsonMatches = buffer.matchAll(/(\{.*?\})(?=\{|\s*$)/gs);
            for (const match of jsonMatches) {
              try {
                const json = JSON.parse(match[1]);
                handleStreamEvent(json);
              } catch (e) {
                console.warn("JSON parse error in stream:", match[1]);
              }
            }

            buffer = "";
          }

          isFinished.current = true;
          setTimeout(() => {
            navigate("/report", {
              state: {
                steps: steps.map(({ icon, ...rest }) => rest),
                repostedData: repostedData.current,
              },
            });
          }, 1000);
        };

        processStream().catch((err) => {
          console.error("Stream processing failed:", err);
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Streaming error:", err);
        }
      });

    return () => {
      if (!isFinished.current) controller.abort();
    };
  }, [sessionId, navigate]);

  useEffect(() => {
    const totalSteps = steps.length;
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    const averageProgress = Math.max(1, totalProgress / totalSteps);
    setOverallProgress(averageProgress);
  }, [steps]);

  const toggleAccordion = (stepId) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button onClick={() => navigate("/upload")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-[#00aae7]" />
              <span className="text-xl font-bold text-slate-800">
                AutoClaim360
              </span>
            </div>
            <img
              src={miracleLogo}
              alt="Miracle Software Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Processing Your Claim
        </h1>
        <div className="text-slate-600 mb-4 text-xl">
          AI agents are reviewing your submission
        </div>
        <Progress
          value={overallProgress}
          className="h-3 mb-8 transition-all duration-500"
        />

        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.id} className="bg-white shadow-md">
              <CardContent className="p-4 text-left space-y-2">
                <button
                  onClick={() => toggleAccordion(step.id)}
                  className="w-full flex items-center space-x-4 text-left focus:outline-none"
                >
                  <div
                    className={`rounded-full p-2 ${
                      step.status === "completed"
                        ? "bg-[#0d416b] text-white"
                        : step.status === "processing"
                        ? "bg-[#00aae7] text-white animate-pulse"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === "processing" ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      stepIcons[step.id]
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-slate-800">
                        {step.title}
                      </h3>
                      {step.message && (
                        <button
                          className="text-sm font-medium text-[#00aae7] "
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccordion(step.id);
                          }}
                        >
                          {expandedStep === step.id
                            ? "Close AI Output"
                            : "View AI Output"}
                        </button>
                      )}
                    </div>
                    <Progress
                      value={step.progress}
                      className="h-2 mt-1 w-full"
                    />
                  </div>
                </button>

                {expandedStep === step.id && step.message && (
                  <pre className="text-slate-700 text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-200 mt-2">
                    {step.message}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
