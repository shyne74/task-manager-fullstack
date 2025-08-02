import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    due_date: "",
    documents: [],
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, documents: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (key === "documents") {
        for (let file of form.documents) {
          formData.append("documents", file);
        }
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchTasks();
      setForm({
        title: "",
        description: "",
        status: "pending",
        priority: "low",
        due_date: "",
        documents: [],
      });
    } catch (err) {
      alert("Failed to create task");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <button onClick={logout} className="text-red-500 font-semibold">Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 border p-4 mb-8">
        <h2 className="font-semibold">Create Task</h2>
        <input name="title" placeholder="Title" className="w-full border p-2" onChange={handleChange} value={form.title} required />
        <textarea name="description" placeholder="Description" className="w-full border p-2" onChange={handleChange} value={form.description} required />
        <input type="date" name="due_date" className="w-full border p-2" onChange={handleChange} value={form.due_date} required />
        <select name="status" className="w-full border p-2" onChange={handleChange} value={form.status}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select name="priority" className="w-full border p-2" onChange={handleChange} value={form.priority}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input type="file" name="documents" multiple onChange={handleFileChange} />
        <button className="bg-green-500 text-white px-4 py-2">Add Task</button>
      </form>

      <h2 className="text-xl mb-2">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">
              Status: {task.status} | Priority: {task.priority} | Due: {task.due_date?.split("T")[0]}
            </p>
            {task.files && task.files.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Attachments:</p>
                {task.files.map((file, idx) => (
                  <a
                    key={idx}
                    className="text-blue-500 underline"
                    href={`http://localhost:5000/api/tasks/download/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}