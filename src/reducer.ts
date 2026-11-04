import type { Priority, Todo } from "./types";

export type Action =
  | { type: "ADD"; text: string; priority: Priority; dueDate?: string }
  | { type: "TOGGLE"; id: string }
  | { type: "DELETE"; id: string }
  | { type: "EDIT"; id: string; text: string }
  | { type: "CLEAR_COMPLETED" };

export function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "ADD":
      return [
        {
          id: crypto.randomUUID(),
          text: action.text,
          completed: false,
          priority: action.priority,
          dueDate: action.dueDate,
          createdAt: Date.now(),
        },
        ...state,
      ];
    case "TOGGLE":
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
    case "DELETE":
      return state.filter((t) => t.id !== action.id);
    case "EDIT":
      return state.map((t) => (t.id === action.id ? { ...t, text: action.text } : t));
    case "CLEAR_COMPLETED":
      return state.filter((t) => !t.completed);
  }
}
