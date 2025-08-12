
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { fetchTasks, addTask, getAiSuggestions, updateTask, deleteTask, fetchCategories } from '../services/api'

// Edit Task Modal Component
const EditTaskModal = ({ task, onClose, onSave, aiSuggestions, categories }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority || '');
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [category, setCategory] = useState(task.category ? task.category.id : '');

  const currentAISuggestion = aiSuggestions[task.title] || {};

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedData = {
      title,
      description,
      status,
      priority_score: priority === '' ? null : parseFloat(priority),
      deadline: deadline === '' ? null : deadline,
    };

    // Only include category_id if a category is selected (i.e., category is not an empty string)
    if (category !== '') {
      updatedData.category_id = category;
    }

    onSave(task.id, { ...task, ...updatedData });
  };

  const applyAISuggestion = (field, value) => {
    if (field === 'priority') setPriority(value);
    if (field === 'deadline') setDeadline(value);
    if (field === 'category') {
      const suggestedCategoryObj = categories.find(cat => cat.name.toLowerCase() === value.toLowerCase());
      if (suggestedCategoryObj) {
        setCategory(suggestedCategoryObj.id);
      } else {
        setCategory(''); // Set to empty if suggested category not found
      }
    }
    if (field === 'description') setDescription(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            className="border p-2 rounded w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border p-2 rounded w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select 
            className="border p-2 rounded w-full mb-4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select 
            className="border p-2 rounded w-full mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          
          {/* AI Suggestions in Edit Modal */}
          {currentAISuggestion.priority_score && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <h4 className="font-semibold text-sm mb-2 text-blue-800">AI Suggestions for this Task:</h4>
              {currentAISuggestion.priority_score && (
                <p className="text-sm"><strong>Priority:</strong> {currentAISuggestion.priority_score.toFixed(2)}
                  <button type="button" onClick={() => applyAISuggestion('priority', currentAISuggestion.priority_score.toFixed(2))} className="ml-2 text-blue-600 hover:underline">Apply</button>
                </p>
              )}
              {currentAISuggestion.suggested_deadline && (
                <p className="text-sm"><strong>Deadline:</strong> {currentAISuggestion.suggested_deadline}
                  <button type="button" onClick={() => applyAISuggestion('deadline', currentAISuggestion.suggested_deadline)} className="ml-2 text-blue-600 hover:underline">Apply</button>
                </p>
              )}
              {currentAISuggestion.suggested_category && (
                <p className="text-sm"><strong>Category:</strong> {currentAISuggestion.suggested_category}
                  <button type="button" onClick={() => applyAISuggestion('category', currentAISuggestion.suggested_category)} className="ml-2 text-blue-600 hover:underline">Apply</button>
                </p>
              )}
              {currentAISuggestion.enhanced_description && (
                <p className="text-sm"><strong>Enhanced Description:</strong> {currentAISuggestion.enhanced_description}
                  <button type="button" onClick={() => applyAISuggestion('description', currentAISuggestion.enhanced_description)} className="ml-2 text-blue-600 hover:underline">Apply</button>
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function Home() {
  const [tasks, setTasks] = useState([])
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTasks()
      setTasks(data)
    } catch (err) {
      setError('Could not load tasks.')
    } finally {
      setLoading(false)
    }
  }, [setLoading, fetchTasks, setTasks, setError])

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError('Could not load categories.');
    }
  }, [fetchCategories, setCategories, setError]);

  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [])

  const handleAddTask = useCallback(async (e) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    try {
      await addTask({ title, description })
      setTitle("")
      setDescription("")
      loadTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }, [setAdding, setError, addTask, title, description, setTitle, setDescription, loadTasks])

  const handleGetSuggestions = useCallback(async () => {
    setAnalyzing(true)
    setError("")
    try {
      const suggestions = await getAiSuggestions()
      setAiSuggestions(suggestions)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }, [setAnalyzing, setError, getAiSuggestions, setAiSuggestions])

  const handleDeleteTask = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (err) {
        setError('Failed to delete task.');
      }
    }
  }, [deleteTask, loadTasks, setError]);

  const handleUpdateTask = useCallback(async (id, updatedTask) => {
    try {
      await updateTask(id, updatedTask);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      setError('Failed to update task.');
    }
  }, [updateTask, setEditingTask, loadTasks, setError]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8">
      <Head>
        <title>Smart To-Do List</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Smart To-Do List</h1>
          <Link href="/context" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            Add Context
          </Link>
        </header>

        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Add New Task</h2>
          <form onSubmit={handleAddTask} >
            <input
              type="text"
              placeholder="Task Title"
              className="border p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description (optional)"
              className="border p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Tasks</h2>
          <div className="flex gap-2">
            <select
              className="border p-2 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="border p-2 rounded"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGetSuggestions}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400 transition-colors"
            disabled={analyzing || tasks.length === 0}
          >
            {analyzing ? 'Analyzing with AI...' : 'Get AI Suggestions'}
          </button>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">Error: {error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="space-y-3">
            {tasks.length === 0 && <li className="bg-white p-4 rounded-lg shadow-md text-center">No tasks found. Add one above!</li>}
            {tasks
              .filter(task => filterStatus === 'all' || task.status === filterStatus)
              .filter(task => filterCategory === 'all' || (task.category && task.category.name.toLowerCase() === filterCategory))
              .map(task => {
              const suggestion = aiSuggestions[task.title] || {};
              return (
                <li key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-bold text-lg">{task.title}</span>
                      <p className="text-gray-600">{suggestion.enhanced_description || task.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{task.status.replace('_',' ')}</span>
                      <button onClick={() => setEditingTask(task)} className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600">Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                  {suggestion.priority_score && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                      <h4 className="font-semibold text-sm mb-2">AI Suggestions:</h4>
                      <p><strong>Priority:</strong> {suggestion.priority_score.toFixed(2)}</p>
                      <p><strong>Deadline:</strong> {suggestion.suggested_deadline}</p>
                      <p><strong>Category:</strong> {suggestion.suggested_category}</p>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} aiSuggestions={aiSuggestions} categories={categories} />}
    </div>
  )
}

