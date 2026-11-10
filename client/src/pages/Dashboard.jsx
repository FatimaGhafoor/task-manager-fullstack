import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitError("");
    setSuccess("");

    try {
      const response = await api.post("/tasks", formData);

      setTasks((prevTasks) => [...prevTasks, response.data.data]);

      setSuccess("Task created successfully!");

      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome! You are successfully logged in.</p>
      <form onSubmit={handleSubmit}>
        <h2>Create New Task</h2>

        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>

      {submitError && <p>{submitError}</p>}
      {success && <p>{success}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {task.title}, {task.description}, {task.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
