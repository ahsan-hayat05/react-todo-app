import { useState } from "react";
import type { Todo } from "../types";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const save = () => {
    const t = draft.trim();
    if (t) onEdit(todo.id, t);
    else setDraft(todo.text);
    setEditing(false);
  };

  const overdue = !todo.completed && todo.dueDate && todo.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <li className={`item ${todo.completed ? "done" : ""}`}>
      <input type="checkbox" aria-label="Mark complete" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      {editing ? (
        <input
          autoFocus
          className="edit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(todo.text);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span className="text" onDoubleClick={() => setEditing(true)}>
          {todo.text}
        </span>
      )}
      <span className={`badge ${todo.priority}`}>{todo.priority}</span>
      {todo.dueDate && <span className={`due ${overdue ? "overdue" : ""}`}>{todo.dueDate}</span>}
      <button className="icon" aria-label="Edit" onClick={() => setEditing(true)}>✎</button>
      <button className="icon" aria-label="Delete" onClick={() => onDelete(todo.id)}>✕</button>
    </li>
  );
}
