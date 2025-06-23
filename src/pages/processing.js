import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Search,
  Shield,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import { Progress } from "../components/ui/Progress";
import MiracleLogo from "../assets/miracle-logo.png";

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

  const initialStepsDefinition = useMemo(() => {
    return ["vision", "metadata", "policy", "report"].map((id, index) => ({
      id,
      title: stepTitles[id],
      status: index === 0 ? "processing" : "pending",
      progress: 0,
      message: "",
    }));
  }, []);

  const [steps, setSteps] = useState(initialStepsDefinition);
  const [overallProgress, setOverallProgress] = useState(1);
  const [expandedStep, setExpandedStep] = useState(null);
  const isFinished = useRef(false);
  const repostedData = useRef(null);

  // Timer state and refs
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [isProcessing, setIsProcessing] = useState(false);
  const startTimeRef = useRef(null);
  const totalProcessingTimeRef = useRef(null);

  // Ref to hold the latest steps for navigation
  const stepsRef = useRef(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    if (!sessionId) {
      // Reset all relevant states if sessionId is not available
      setSteps(initialStepsDefinition);
      setIsProcessing(false);
      setElapsedTime("00:00");
      startTimeRef.current = null;
      totalProcessingTimeRef.current = null;
      isFinished.current = false;
      repostedData.current = null;
      setOverallProgress(1);
      return;
    }

    // Reset states for a new processing session
    setSteps(initialStepsDefinition);
    isFinished.current = false;
    repostedData.current = null;
    startTimeRef.current = performance.now(); // Start timer
    setElapsedTime("00:00"); // Reset displayed time
    setIsProcessing(true); // Set processing to true
    totalProcessingTimeRef.current = null; // Reset total time

    const controller = new AbortController();
    // const serverUrl = "http://127.0.0.1:8000"; // Use the current origin for the server URL
    const serverUrl = window.location.origin; // Use the current origin for the server URL

    fetch(`${serverUrl}/stream-claim/${sessionId}`, {
      method: "GET",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get reader from response body");
        }
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
                  message: done && message ? message : message || step.message, // Update message if new one provided
                };
              } else if (step.status === "completed") {
                return step; // Keep completed steps as they are
              } else if (
                prevSteps.find(
                  (s) => s.id === stepId && s.status === "processing"
                )
              ) {
                // If the current stepId is processing, others should be pending (unless completed)
                return { ...step, status: "pending", progress: 0 };
              }
              return step;
            })
          );
        };

        const processStream = async () => {
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });

              let lastProcessedIndex = 0;
              // Regex to find JSON objects: match content inside {} possibly followed by another { or end of string
              const jsonMatches = buffer.matchAll(/(\{.*?\})(?=\s*\{|\s*$)/gs);
              for (const match of jsonMatches) {
                try {
                  const jsonString = match[1];
                  const json = JSON.parse(jsonString);
                  handleStreamEvent(json);
                  lastProcessedIndex = match.index + match[0].length;
                } catch (e) {
                  console.warn(
                    "JSON parse error in stream segment:",
                    match[1],
                    e
                  );
                  // Potentially advance lastProcessedIndex past the problematic segment if it's identifiable
                  // For now, if a parse fails, the buffer might retain the bad segment.
                  // A more robust solution might try to find the next valid JSON start.
                }
              }
              buffer = buffer.substring(lastProcessedIndex);
            }
          } finally {
            isFinished.current = true;
            setIsProcessing(false); // Stop processing, timer will stop updating

            if (startTimeRef.current) {
              const endTime = performance.now();
              const durationInSeconds = Math.round(
                (endTime - startTimeRef.current) / 1000
              );
              totalProcessingTimeRef.current = durationInSeconds;

              // Update elapsed time one last time with the final total
              const minutes = Math.floor(durationInSeconds / 60);
              const seconds = durationInSeconds % 60;
              setElapsedTime(
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                  2,
                  "0"
                )}`
              );
            }

            // Use stepsRef.current for navigation state to ensure latest steps
            setTimeout(() => {
              navigate("/report", {
                state: {
                  steps: stepsRef.current.map(({ icon, ...rest }) => rest),
                  repostedData: repostedData.current,
                  totalProcessingTime: totalProcessingTimeRef.current,
                },
              });
            }, 1000);
          }
        };

        processStream().catch((err) => {
          console.error("Stream processing failed:", err);
          setIsProcessing(false); // Ensure processing stops on error
          isFinished.current = true; // Mark as finished (with error)
          if (startTimeRef.current) {
            // Log time until error
            const endTime = performance.now();
            const durationInSeconds = Math.round(
              (endTime - startTimeRef.current) / 1000
            );
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            setElapsedTime(
              `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
              )}`
            );
          }
          // Potentially show an error message to the user
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Streaming setup error:", err);
          setIsProcessing(false); // Ensure processing stops on error
          isFinished.current = true; // Mark as finished (with error)
          if (startTimeRef.current) {
            // Log time until error
            const endTime = performance.now();
            const durationInSeconds = Math.round(
              (endTime - startTimeRef.current) / 1000
            );
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            setElapsedTime(
              `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
              )}`
            );
          }
        }
      });

    return () => {
      if (!isFinished.current) {
        controller.abort();
      }
      setIsProcessing(false); // Ensure timer stops if component unmounts mid-processing
    };
  }, [sessionId, navigate, initialStepsDefinition]);

  // useEffect for updating the displayed timer every second
  useEffect(() => {
    let intervalId;
    if (isProcessing && startTimeRef.current) {
      intervalId = setInterval(() => {
        const now = performance.now();
        const secondsElapsed = Math.floor((now - startTimeRef.current) / 1000);
        if (secondsElapsed >= 0) {
          const minutes = Math.floor(secondsElapsed / 60);
          const seconds = secondsElapsed % 60;
          setElapsedTime(
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
              2,
              "0"
            )}`
          );
        }
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isProcessing]); // Depends on isProcessing state

  useEffect(() => {
    const completedSteps = steps.filter(
      (step) => step.status === "completed"
    ).length;
    const processingStep = steps.find((step) => step.status === "processing");

    let calculatedOverallProgress = 0;
    if (steps.length > 0) {
      const totalProgressSum = steps.reduce((sum, step) => {
        // For completed steps, count as 100. For processing, use its current progress. Pending is 0.
        if (step.status === "completed") return sum + 100;
        if (step.status === "processing") return sum + step.progress;
        return sum;
      }, 0);
      calculatedOverallProgress = totalProgressSum / steps.length;
    }

    // Ensure overall progress is at least 1 if processing has started, and 100 if all done.
    if (isProcessing && calculatedOverallProgress < 1) {
      setOverallProgress(1);
    } else if (steps.every((step) => step.status === "completed")) {
      setOverallProgress(100);
    } else {
      setOverallProgress(Math.max(1, Math.min(100, calculatedOverallProgress)));
    }
  }, [steps, isProcessing]);

  const toggleAccordion = (stepId) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button
            onClick={() => navigate("/upload")}
            variant="outline"
            size="sm"
            className="text-white bg-miracle-darkBlue border-miracle-darkBlue"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
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

      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Processing Your Claim
        </h1>
        <p className="text-slate-600 mb-1">
          {" "}
          {/* Reduced margin */}
          AI agents are reviewing your submission
        </p>

        <div className="flex justify-between items-center mt-1 mb-2 text-sm">
          <span className="text-slate-600">Overall Progress</span>
          {(isProcessing || totalProcessingTimeRef.current !== null) && (
            <span className="text-slate-500 font-medium">
              Time: {elapsedTime}
            </span>
          )}
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
                    className={`rounded-full p-2 transition-colors duration-300 ${
                      step.status === "completed"
                        ? "bg-miracle-darkBlue text-white" // Changed to green for completed
                        : step.status === "processing"
                        ? "bg-miracle-lightBlue text-white animate-pulse" // Changed to blue for processing
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === "processing" ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      stepIcons[step.id] // Default icon for pending
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-800">
                        {step.title}
                      </h3>
                      {step.message && (
                        <span className="text-miracle-lightBlue text-sm hover:underline">
                          {expandedStep === step.id
                            ? "Close AI Output"
                            : "View AI Output"}
                        </span>
                      )}
                    </div>
                    <Progress
                      value={step.progress}
                      className="h-2 mt-1"
                      indicatorClassName={
                        step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "processing"
                          ? "bg-blue-500"
                          : "bg-slate-400"
                      }
                    />
                  </div>
                </button>

                {expandedStep === step.id && step.message && (
                  <pre className="text-slate-700 text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-200 mt-2 max-h-60 overflow-y-auto">
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
