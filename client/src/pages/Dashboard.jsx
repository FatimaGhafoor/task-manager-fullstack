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
  const [editingTask, setEditingTask] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      description: "",
      status: "pending",
    });

    setSubmitError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitError("");
    setSuccess("");

    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask._id}`, formData);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTask._id ? response.data.data : task,
          ),
        );

        setSuccess("Task updated successfully!");
        setEditingTask(null);
      } else {
        const response = await api.post("/tasks", formData);

        setTasks((prevTasks) => [...prevTasks, response.data.data]);

        setSuccess("Task created successfully!");
      }

      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to save task");
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
        <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>

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
          {submitting
            ? editingTask
              ? "Updating..."
              : "Creating..."
            : editingTask
              ? "Update Task"
              : "Create Task"}
        </button>

        {editingTask && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
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
              <p>{task.title}</p>
              <p>{task.description}</p>
              <p>{task.status}</p>

              <button type="button" onClick={() => handleEdit(task)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
