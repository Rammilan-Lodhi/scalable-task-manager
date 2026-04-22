import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Feedback from "../components/Feedback.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const flash = (s) => {
    setSuccess(s);
    setTimeout(() => setSuccess(""), 2500);
  };

  const load = async () => {
    try {
      const [u, t] = await Promise.all([api.get("/users"), api.get("/tasks")]);
      setUsers(u.data.users);
      setTasks(t.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user and all their tasks?")) return;
    try {
      await api.delete(`/users/${id}`);
      flash("User deleted");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      flash("Task deleted");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const assign = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tasks/assign", {
        title: assignTitle,
        userId: assignUserId,
      });
      setAssignTitle("");
      setAssignUserId("");
      flash("Task assigned");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Feedback error={error} success={success} />

      <div className="card">
        <h3>Users ({users.length})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Assign Task</h3>
        <form onSubmit={assign} className="form">
          <input
            placeholder="Title"
            value={assignTitle}
            onChange={(e) => setAssignTitle(e.target.value)}
            required
          />
          <select
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
            required
          >
            <option value="">Select user...</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button type="submit">Assign</button>
        </form>
      </div>

      <div className="card">
        <h3>All Tasks ({tasks.length})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>
                  {t.userId?.name || "—"}
                  {t.assignedBy ? " (assigned)" : ""}
                </td>
                <td>{t.completed ? "Done" : "Open"}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteTask(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
