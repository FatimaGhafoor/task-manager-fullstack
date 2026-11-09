import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");

        setTasks(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome! You are successfully logged in.</p>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}, {task.description}, {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
