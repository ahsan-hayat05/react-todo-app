import { useEffect, useMemo, useReducer, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { todoReducer } from "./reducer";
import type { Filter, Todo } from "./types";

const FILTERS: Filter[] = ["all", "active", "completed"];

export default function App() {
  const [saved, setSaved] = useLocalStorage<Todo[]>("todos", []);
  const [todos, dispatch] = useReducer(todoReducer, saved);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useLocalStorage<boolean>("dark", false);

  useEffect(() => setSaved(todos), [todos, setSaved]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const visible = useMemo(
    () =>
      todos
        .filter((t) => (filter === "all" ? true : filter === "active" ? !t.completed : t.completed))
        .filter((t) => t.text.toLowerCase().includes(query.toLowerCase())),
    [todos, filter, query]
  );

  const left = todos.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <header>
        <h1>To-Do</h1>
        <button className="icon" aria-label="Toggle dark mode" onClick={() => setDark(!dark)}>
          {dark ? "☀" : "☾"}
        </button>
      </header>

      <TodoForm onAdd={(text, priority, dueDate) => dispatch({ type: "ADD", text, priority, dueDate })} />

      <input
        className="search"
        aria-label="Search tasks"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <nav className="filters">
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="empty">No Task; Create a new entry.</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={(id) => dispatch({ type: "TOGGLE", id })}
              onDelete={(id) => dispatch({ type: "DELETE", id })}
              onEdit={(id, text) => dispatch({ type: "EDIT", id, text })}
            />
          ))}
        </ul>
      )}

      <footer>
        <span>{left} task{left === 1 ? "" : "s"} left</span>
        <button onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}>Clear completed</button>
      </footer>
    </main>
  );
}
