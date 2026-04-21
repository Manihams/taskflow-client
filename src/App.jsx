import { useState, useEffect } from "react";
import BASE_URL from "./api/config";

const API = "http://localhost:8080/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data);
  }

  async function createTask() {
    if (!title.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    fetchTasks();
  }

  async function toggleComplete(task) {
    await fetch(`${API}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    fetchTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: "0 20px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>TaskFlow</h1>

      {/* Create Task Form */}
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <input
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8, fontSize: 15, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12, fontSize: 15, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
        />
        <button
          onClick={createTask}
          style={{ background: "#111", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, fontSize: 15, cursor: "pointer" }}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 && <p style={{ color: "#888" }}>No tasks yet. Add one above!</p>}
      {tasks.map(task => (
        <div key={task.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", border: "1px solid #eee", borderRadius: 8, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 16, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#aaa" : "#111" }}>
                {task.title}
              </p>
              {task.description && <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{task.description}</p>}
            </div>
          </div>
          <button
            onClick={() => deleteTask(task.id)}
            style={{ background: "none", border: "none", color: "#ff4444", fontSize: 18, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}