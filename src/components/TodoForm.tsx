import { useState } from "react";
import type { Priority } from "../types";

type Props = { onAdd: (text: string, priority: Priority, dueDate?: string) => void };

export default function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate || undefined);
    setText("");
    setDueDate("");
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        aria-label="New task"
        placeholder="Write a new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input aria-label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
