import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

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
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setSubmitError("");
    setSuccess("");

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

  const handleDelete = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;

    setDeletingTaskId(task._id);
    setDeleteError("");
    setSuccess("");

    try {
      await api.delete(`/tasks/${task._id}`);

      setTasks((prevTasks) =>
        prevTasks.filter((item) => item._id !== task._id),
      );

      setSuccess("Task deleted successfully!");
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
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

  const formatStatus = (status) => {
    const labels = {
      pending: "Pending",
      "in-progress": "In Progress",
      completed: "Completed",
    };

    return labels[status] || status;
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">TASK MANAGER</span>
            <h1>My Dashboard</h1>
            <p>Welcome! Manage your tasks and stay productive.</p>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="dashboard-toolbar">
          <div className="form-group">
            <label htmlFor="search">Search Tasks</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="statusFilter">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </section>

        <section className="task-form-card">
          <div className="section-heading">
            <h2>{editingTask ? "Edit Task" : "Create a New Task"}</h2>
            <p>
              {editingTask
                ? "Update the details of your task."
                : "Add a task to keep track of your work."}
            </p>
          </div>

          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Complete project documentation"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Add some details about this task..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>

            <div className="form-group">
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

            <div className="task-form-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? editingTask
                    ? "Updating..."
                    : "Creating..."
                  : editingTask
                    ? "Update Task"
                    : "Create Task"}
              </button>

              {editingTask && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="task-list-section">
          <div className="task-list-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"} displayed
              </p>
            </div>
          </div>

          {(success || submitError || deleteError) && (
            <div className="dashboard-feedback">
              {success && (
                <p className="feedback-success" role="status">
                  {success}
                </p>
              )}

              {submitError && (
                <p className="feedback-error" role="alert">
                  {submitError}
                </p>
              )}

              {deleteError && (
                <p className="feedback-error" role="alert">
                  {deleteError}
                </p>
              )}
            </div>
          )}

          {loading ? (
            <div className="dashboard-empty-state">
              <p>Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty-state">
              <p className="feedback-error">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="dashboard-empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first task to get started.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="dashboard-empty-state">
              <h3>No matching tasks</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          ) : (
            <ul className="task-grid">
              {filteredTasks.map((task) => (
                <li className="task-card" key={task._id}>
                  <div className="task-card-header">
                    <h3>{task.title}</h3>

                    <span className={`task-status status-${task.status}`}>
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-card-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDelete(task)}
                      disabled={deletingTaskId === task._id}
                    >
                      {deletingTaskId === task._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
