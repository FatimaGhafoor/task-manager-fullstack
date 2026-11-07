import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import api from "./services/api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get("http://localhost:5000/");
        setMessage(response.data.message);
      } catch (error) {
        console.error("API Error:", error.message);
        setMessage("Backend connection failed!");
      }
    };

    checkServer();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <h1>Frontend-Backend Connection</h1>
        <p>{message}</p>

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
