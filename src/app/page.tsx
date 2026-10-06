"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Tag,
  Search,
  Sun,
  Moon,
  ListTodo,
  Star,
  ChevronRight,
  BarChart2
} from "lucide-react";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: "Work" | "Personal" | "Health" | "Finance" | "Ideas";
  priority: "High" | "Medium" | "Low";
  dueDate?: string;
  createdAt: string;
  starred?: boolean;
}

const CATEGORIES = ["All", "Work", "Personal", "Health", "Finance", "Ideas"] as const;

const INITIAL_TODOS: Todo[] = [
  {
    id: "todo-1",
    title: "Design sleek UI design token system",
    description: "Establish dark mode color palette and typography hierarchy.",
    completed: true,
    category: "Work",
    priority: "High",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    starred: true,
  },
  {
    id: "todo-2",
    title: "Implement Todo App with Next.js & Tailwind CSS",
    description: "Add category filters, priority badges, and confetti celebration.",
    completed: false,
    category: "Work",
    priority: "High",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    starred: true,
  },
  {
    id: "todo-3",
    title: "Morning 30-minute mindfulness & cardio",
    description: "Stay energized and focused for the daily sprints.",
    completed: false,
    category: "Health",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    starred: false,
  },
  {
    id: "todo-4",
    title: "Review monthly investment portfolio",
    description: "Rebalance assets across index funds and growth stocks.",
    completed: false,
    category: "Finance",
    priority: "Low",
    dueDate: new Date(Date.now() + 432000000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    starred: false,
  },
];

export default function SleekTodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sleek_todos_v1");
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_TODOS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed">("All");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // New todo form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<Todo["category"]>("Work");
  const [newPriority, setNewPriority] = useState<Todo["priority"]>("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("sleek_todos_v1", JSON.stringify(todos));
    } catch {
      // Ignore local storage errors
    }
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate || undefined,
      createdAt: new Date().toISOString(),
      starred: false,
    };

    setTodos([newTodo, ...todos]);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    setIsFormOpen(false);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const nextCompleted = !todo.completed;
          if (nextCompleted) {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
          return { ...todo, completed: nextCompleted };
        }
        return todo;
      })
    );
  };

  const toggleStar = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Filtered Todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || todo.category === selectedCategory;
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Completed"
        ? todo.completed
        : !todo.completed;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Analytics
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  const completionPercentage = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const getPriorityBadge = (priority: Todo["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Low":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  const getCategoryColor = (category: Todo["category"]) => {
    switch (category) {
      case "Work":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Personal":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Health":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Finance":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Ideas":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Navigation */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          theme === "dark" ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                TaskPulse
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  Sleek Edition
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Streamlined productivity with intuitive design and real-time focus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Sidebar Column - Stats & Filters */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Productivity Stats Card */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === "dark"
                ? "bg-slate-900/90 border-slate-800/80 shadow-2xl"
                : "bg-white border-slate-200 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" /> Daily Pulse
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {completionPercentage}% Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden mb-6 p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <p className="text-2xl font-black text-indigo-400">{todos.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <p className="text-2xl font-black text-amber-400">{activeCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Pending</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <p className="text-2xl font-black text-emerald-400">{completedCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Done</p>
              </div>
            </div>
          </div>

          {/* Categories Selector */}
          <div
            className={`p-6 rounded-3xl border ${
              theme === "dark" ? "bg-slate-900/90 border-slate-800/80" : "bg-white border-slate-200"
            }`}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" /> Categories
            </h2>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat === "All"
                    ? todos.length
                    : todos.filter((t) => t.category === cat).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                        : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800/60"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                      {cat}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-800/80 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right / Main Tasks Column */}
        <section className="lg:col-span-8 space-y-6">
          {/* New Task Inline Form / Modal */}
          {isFormOpen && (
            <div
              className={`p-6 rounded-3xl border shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 ${
                theme === "dark"
                  ? "bg-slate-900 border-purple-500/30"
                  : "bg-white border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-5 h-5" /> Create New Task
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleAddTodo} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Task title (e.g., Review PR for API optimization)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Optional details or description..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Todo["category"])}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium border ${
                        theme === "dark"
                          ? "bg-slate-800/60 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Finance">Finance</option>
                      <option value="Ideas">Ideas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Todo["priority"])}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium border ${
                        theme === "dark"
                          ? "bg-slate-800/60 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium border ${
                        theme === "dark"
                          ? "bg-slate-800/60 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div
            className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700/60 text-white placeholder-slate-500"
                    : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Status Pills */}
            <div className="flex bg-slate-800/40 p-1 rounded-2xl border border-slate-800/60 w-full sm:w-auto justify-center">
              {(["All", "Active", "Completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === status
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border border-dashed ${
                  theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
                }`}
              >
                <CheckCircle2 className="w-12 h-12 text-purple-400/50 mx-auto mb-3 animate-bounce" />
                <h3 className="text-base font-bold text-slate-300">No tasks found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting filters or create a new task above.
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group p-4 sm:p-5 rounded-3xl border transition-all duration-200 hover:shadow-xl flex items-start gap-4 ${
                    todo.completed
                      ? theme === "dark"
                        ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                        : "bg-slate-100/60 border-slate-200 opacity-70"
                      : theme === "dark"
                      ? "bg-slate-900/90 border-slate-800 hover:border-purple-500/40"
                      : "bg-white border-slate-200 hover:border-purple-300"
                  }`}
                >
                  {/* Completion Toggle */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-0.5 transition-transform active:scale-90"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-purple-400 transition-colors" />
                    )}
                  </button>

                  {/* Task Main Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-snug break-words ${
                          todo.completed ? "line-through text-slate-500" : "text-slate-100"
                        }`}
                      >
                        {todo.title}
                      </h4>

                      <button
                        onClick={() => toggleStar(todo.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          todo.starred ? "text-amber-400" : "text-slate-600 hover:text-amber-400"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{todo.description}</p>
                    )}

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(
                          todo.category
                        )}`}
                      >
                        {todo.category}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
                          todo.priority
                        )}`}
                      >
                        {todo.priority} Priority
                      </span>

                      {todo.dueDate && (
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-800/40 px-2 py-0.5 rounded-full border border-slate-800">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {todo.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
