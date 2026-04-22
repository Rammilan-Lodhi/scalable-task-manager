import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Feedback from "../components/Feedback.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const flash = (s) => {
    setSuccess(s);
    setTimeout(() => setSuccess(""), 2500);
  };

  const load = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      flash("Task created");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const toggle = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/tasks/${id}`, { title: editTitle });
      setEditingId(null);
      flash("Task updated");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      flash("Task deleted");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <Feedback error={error} success={success} />

      <div className="card">
        <h3>Create Task</h3>
        <form onSubmit={create} className="form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="card">
        <h3>Tasks ({tasks.length})</h3>
        {tasks.length === 0 && <p>No tasks yet.</p>}
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t._id} className="task-item">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t)}
              />
              {editingId === t._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(t._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className={t.completed ? "done" : ""}>{t.title}</span>
                  {t.assignedBy && (
                    <span className="badge">assigned</span>
                  )}
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button onClick={() => remove(t._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
