import { useState, useEffect, useMemo, JSX } from 'react'
import { formatDistanceToNow } from 'date-fns'
import './App.css'
import TodoItem from './components/ToDoItem'
import StatsBar from './components/StatsBar'
import AddTaskForm from './components/AddTaskForm'

interface Todo {
  id: number
  text: string
  done: boolean
  priority: 'High' | 'Medium' | 'Low'
  category: string
  dueDate: string
  createdAt: number
}

type FilterStatus = 'All' | 'Active' | 'Completed'
type SortBy = 'created' | 'due' | 'priority'

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

export default function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Todo['priority']>('Medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterPriority, setFilterPriority] = useState<Todo['priority'] | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortBy>('created')
  const [showForm, setShowForm] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')
  const [updateVersion, setUpdateVersion] = useState('')
  const [updateProgress, setUpdateProgress] = useState<number | null>(null)

  useEffect(() => {
    window.api?.onUpdateStatus((msg: string) => setUpdateMsg(msg))
    window.api?.onUpdateAvailable((version: string) => setUpdateVersion(version))
    window.api?.onUpdateProgress((percent: number) => setUpdateProgress(percent))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('todos-v2')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('todos-v2', JSON.stringify(todos))
  }, [todos])

  const addTodo = (): void => {
    if (!text.trim()) return
    setTodos(prev => [{
      id: Date.now(),
      text: text.trim(),
      done: false,
      priority,
      category,
      dueDate,
      createdAt: Date.now(),
    }, ...prev])
    setText('')
    setPriority('Medium')
    setCategory('General')
    setDueDate('')
    setShowForm(false)
  }

  const toggleTodo = (id: number): void =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const deleteTodo = (id: number): void =>
    setTodos(prev => prev.filter(t => t.id !== id))

  const clearCompleted = (): void =>
    setTodos(prev => prev.filter(t => !t.done))

  const isOverdue = (todo: Todo): boolean =>
    !todo.done && !!todo.dueDate && new Date(todo.dueDate) < new Date(new Date().toDateString())

  const filtered = useMemo(() => {
    return todos
      .filter(t => {
        if (filterStatus === 'Active' && t.done) return false
        if (filterStatus === 'Completed' && !t.done) return false
        if (filterCategory !== 'All' && t.category !== filterCategory) return false
        if (filterPriority !== 'All' && t.priority !== filterPriority) return false
        if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (sortBy === 'due') {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        return b.createdAt - a.createdAt
      })
  }, [todos, filterStatus, filterCategory, filterPriority, search, sortBy])

  const counts = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length,
    overdue: todos.filter(isOverdue).length,
  }), [todos])

  return (
    <div className="app">
      <header>
        {updateVersion && (
          <div className="update-banner">
            <span>Version {updateVersion} is available.</span>
            {updateProgress === null ? (
              <button onClick={() => window.api?.downloadUpdate()}>Download</button>
            ) : (
              <span>Downloading... {updateProgress}%</span>
            )}
          </div>
        )}
        {updateMsg && !updateVersion && (
          <div className="update-info">{updateMsg}</div>
        )}
        
        <div className="header-top">
          <div>
            <h1>Tasks - v1.1.0</h1>
            {todos.length > 0 && (
              <p className="last-updated">
                Updated {formatDistanceToNow(new Date(todos[0].createdAt), { addSuffix: true })}
              </p>
            )}
          </div>
          <button className="btn-add" onClick={() => setShowForm(f => !f)}>
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>
        <StatsBar {...counts} />
      </header>

      {showForm && (
        <AddTaskForm
          text={text}
          priority={priority}
          category={category}
          dueDate={dueDate}
          onTextChange={setText}
          onPriorityChange={setPriority}
          onCategoryChange={setCategory}
          onDueDateChange={setDueDate}
          onAdd={addTodo}
        />
      )}

      <div className="toolbar">
        <input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." />
        <div className="filters">
          {(['All', 'Active', 'Completed'] as FilterStatus[]).map(s => (
            <button key={s} className={filterStatus === s ? 'active' : ''} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="sub-toolbar">
        <div className="filter-group">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {['General', 'Work', 'Personal', 'Shopping', 'Health'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as Todo['priority'] | 'All')}>
            <option value="All">All Priorities</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
            <option value="created">Sort: Newest</option>
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
        {counts.completed > 0 && (
          <button className="btn-clear" onClick={clearCompleted}>Clear completed</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No tasks match your filters.</p>
      ) : (
        <ul className="todo-list">
          {filtered.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} isOverdue={isOverdue} />
          ))}
        </ul>
      )}

      {counts.total > 0 && (
        <p className="summary">{counts.active} task{counts.active !== 1 ? 's' : ''} remaining</p>
      )}
    </div>
  )
}