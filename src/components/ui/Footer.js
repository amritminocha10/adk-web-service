import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C537A] text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-[#00aae7]" />
          <span className="text-lg font-bold">Auto Claim 360</span>
        </div>
        <div className="text-sm">
          © 2025 Miracle Software Systems, Inc
        </div>
      </div>
    </footer>
  );
}
