import { JSX } from 'react'

interface Todo {
    id: number
    text: string
    done: boolean
    priority: 'High' | 'Medium' | 'Low'
    category: string
    dueDate: string
    createdAt: number
}

interface Props {
    todo: Todo
    onToggle: (id: number) => void
    onDelete: (id: number) => void
    isOverdue: (todo: Todo) => boolean
}

export default function TodoItem({ todo, onToggle, onDelete, isOverdue }: Props): JSX.Element {
    return (
        <li className={`todo-item ${todo.done ? 'done' : ''} ${isOverdue(todo) ? 'overdue-item' : ''}`}>
            <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
            <div className="todo-body">
                <span className="todo-text">{todo.text}</span>
                <div className="todo-meta">
                    <span className={`badge priority-${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                    <span className="badge cat">{todo.category}</span>
                    {todo.dueDate && (
                        <span className={`due ${isOverdue(todo) ? 'due-overdue' : ''}`}>
                            {isOverdue(todo) ? '⚠ ' : ''}Due {new Date(todo.dueDate + 'T00:00:00').toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
            <button className="btn-delete" onClick={() => onDelete(todo.id)}>✕</button>
        </li>
    )
}