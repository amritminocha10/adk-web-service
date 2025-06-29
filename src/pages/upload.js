import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Upload as UploadIcon, ArrowLeft, Camera } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import API from "../server/API.js";
import Footer from "../components/ui/Footer.js";
import Spinner from "../components/ui/Spinner.js";
import MiracleLogo from "../assets/miracle-logo.png";
import { ToastContainer, toast } from "react-toastify";

export default function UploadPage() {
  const navigate = useNavigate();
  const [vin, setVin] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("vin", vin);
    if(vin.length !== 17) {
      setLoading(false);
      toast.error("Please enter a valid 17-digit VIN.");
      return;
    }
    localStorage.setItem("vin", vin); // Store VIN in localStorage
    formData.append("customer_prompt", userQuery);
    files.forEach((file) => {
      formData.append("vehicle_image", file);
    });

    try {
      const response = await API.post.uploadClaimData(formData);
      console.log(response);
      if (!response || !response.session_id) {
        toast.error("Failed to upload claim data. Please try again.");
        return;
      }
      setSessionId(response?.session_id);
      console.log("Claim data uploaded successfully:", response);
      const sid = response?.session_id;
      setSessionId(sid); // Optional, if you need to store it locally
      setLoading(false);
      toast.success("Claim data uploaded successfully!");
      navigate("/processing", { state: { sessionId: sid } });
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
      toast.error("Failed to upload claim data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
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

      <div className="container mx-auto px-4 py-8 max-w-2xl m-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Submit Your Claim
          </h1>
          <p className="text-lg text-slate-600">
            Provide your VIN and upload vehicle damage photos
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Claim Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="vin">VIN Number *</Label>
                <Input
                  id="vin"
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  maxLength={17}
                  required
                  placeholder="Enter 17-digit VIN"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="userQuery">Explaination *</Label>
                <Input
                  id="userQuery"
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  required
                  placeholder="Please explain the damage"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Upload Photos *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-white">
                  <Camera className="mx-auto h-10 w-10 text-[#00aae7] mb-4" />
                  <input
                    id="upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("upload").click()}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Photos
                  </Button>
                  {files.length > 0 && (
                    <p className="mt-4 text-sm text-slate-500">
                      {files.length} photo(s) selected
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md"
                disabled={!vin || files.length === 0}
              >
                {loading && (
                  <div className="flex items-center gap-4">
                    <Spinner size="small" />
                  </div>
                )}

                <span className="ml-2">Submit for Analysis</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
