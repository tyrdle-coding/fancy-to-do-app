/* eslint-disable prettier/prettier */
import { JSX } from 'react'
import { format } from 'date-fns'

const CATEGORIES = ['General', 'Work', 'Personal', 'Shopping', 'Health']

interface Props {
    text: string
    priority: 'High' | 'Medium' | 'Low'
    category: string
    dueDate: string
    onTextChange: (v: string) => void
    onPriorityChange: (v: 'High' | 'Medium' | 'Low') => void
    onCategoryChange: (v: string) => void
    onDueDateChange: (v: string) => void
    onAdd: () => void
}

export default function AddTaskForm({
    text, priority, category, dueDate,
    onTextChange, onPriorityChange, onCategoryChange, onDueDateChange, onAdd
}: Props): JSX.Element {
    const today = format(new Date(), 'yyyy-MM-dd')

    return (
        <div className="form-card">
            <input
                className="input-main"
                value={text}
                onChange={e => onTextChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onAdd()}
                placeholder="What needs to be done?"
                autoFocus
            />
            <div className="form-row">
                <div className="field">
                    <label>Priority</label>
                    <select value={priority} onChange={e => onPriorityChange(e.target.value as 'High' | 'Medium' | 'Low')}>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div className="field">
                    <label>Category</label>
                    <select value={category} onChange={e => onCategoryChange(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label>Due Date</label>
                    <input type="date" value={dueDate} min={today} onChange={e => onDueDateChange(e.target.value)} />
                </div>
            </div>
            <button className="btn-submit" onClick={onAdd}>Add Task</button>
        </div>
    )
}