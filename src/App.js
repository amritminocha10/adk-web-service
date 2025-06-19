import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Upload from "./pages/upload";
import Processing from "./pages/processing";
import Report from "./pages/report";
import Chat from "./pages/chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/report" element={<Report />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
