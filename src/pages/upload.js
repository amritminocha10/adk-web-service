import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Upload as UploadIcon, ArrowLeft, Camera } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"

export default function UploadPage() {
  const navigate = useNavigate()
  const [vin, setVin] = useState("")
  const [userQuery, setUserQuery] = useState("")
  const [files, setFiles] = useState([])

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (vin && files.length > 0) navigate("/processing")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">AutoClaim360</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Submit Your Claim</h1>
          <p className="text-lg text-slate-600">Provide your VIN and upload vehicle damage photos</p>
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
                />
              </div>

              <div>
                <Label>Upload Photos *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-white">
                  <Camera className="mx-auto h-10 w-10 text-blue-500 mb-4" />
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
                    variant="outline"
                    onClick={() => document.getElementById("upload").click()}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Photos
                  </Button>
                  {files.length > 0 && (
                    <p className="mt-4 text-sm text-slate-500">{files.length} photo(s) selected</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md"
                disabled={!vin || files.length === 0}
              >
                Submit for Analysis
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
