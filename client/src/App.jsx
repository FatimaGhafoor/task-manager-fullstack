import { useEffect, useState } from "react";
import api from "./services/api";
import Login from "./pages/Login";

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
    <div>
      <h1>Frontend-Backend Connection</h1>
      <p>{message}</p>
      <Login />;
    </div>
  );
}

export default App;
