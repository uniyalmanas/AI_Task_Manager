
import { useCallback, useEffect, useState } from 'react'
import { fetchTasks, addTask, getAiSuggestions, updateTask, deleteTask, fetchCategories } from '../services/api'
import Layout from '../components/Layout'
import Head from 'next/head'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Task</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select 
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
            <select 
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
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
          </div>
          
          {/* AI Suggestions in Edit Modal */}
          {currentAISuggestion.priority_score && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-inner">
              <h4 className="font-semibold text-base mb-3 text-blue-800">AI Suggestions for this Task:</h4>
              {currentAISuggestion.priority_score && (
                <p className="text-sm mb-2"><strong>Priority:</strong> {currentAISuggestion.priority_score.toFixed(2)}
                  <button type="button" onClick={() => applyAISuggestion('priority', currentAISuggestion.priority_score.toFixed(2))} className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Apply</button>
                </p>
              )}
              {currentAISuggestion.suggested_deadline && (
                <p className="text-sm mb-2"><strong>Deadline:</strong> {currentAISuggestion.suggested_deadline}
                  <button type="button" onClick={() => applyAISuggestion('deadline', currentAISuggestion.suggested_deadline)} className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Apply</button>
                </p>
              )}
              {currentAISuggestion.suggested_category && (
                <p className="text-sm mb-2"><strong>Category:</strong> {currentAISuggestion.suggested_category}
                  <button type="button" onClick={() => applyAISuggestion('category', currentAISuggestion.suggested_category)} className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Apply</button>
                </p>
              )}
              {currentAISuggestion.enhanced_description && (
                <p className="text-sm"><strong>Enhanced Description:</strong> {currentAISuggestion.enhanced_description}
                  <button type="button" onClick={() => applyAISuggestion('description', currentAISuggestion.enhanced_description)} className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Apply</button>
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-200 font-medium">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium">Save Changes</button>
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
  const [filterPriority, setFilterPriority] = useState('all');
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

    <Layout>
      <Head>
        <title>Smart To-Do List</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Smart Tasks</h1>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="taskTitle" className="sr-only">Task Title</label>
              <input
                type="text"
                id="taskTitle"
                placeholder="Task Title"
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="taskDescription" className="sr-only">Description (optional)</label>
              <textarea
                id="taskDescription"
                placeholder="Description (optional)"
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <h2 className="text-2xl font-semibold text-gray-700">Your Tasks</h2>
          <div className="flex flex-wrap gap-3">
            <select
              className="border border-gray-300 rounded-lg py-2 px-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg py-2 px-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <select
              className="border border-gray-300 rounded-lg py-2 px-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            onClick={handleGetSuggestions}
            className="bg-green-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed shadow-md"
            disabled={analyzing || tasks.length === 0}
          >
            {analyzing ? 'Analyzing with AI...' : 'Get AI Suggestions'}
          </button>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 shadow-md">Error: {error}</p>}

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading tasks...</p>
        ) : (
          <ul className="space-y-4">
            {tasks.length === 0 && <li className="bg-gray-50 p-6 rounded-lg shadow-md text-center text-gray-600">No tasks found. Add one above!</li>}
            {tasks
              .filter(task => filterStatus === 'all' || task.status === filterStatus)
              .filter(task => filterCategory === 'all' || (task.category && task.category.name.toLowerCase() === filterCategory))
              .filter(task => {
                if (filterPriority === 'all') return true;
                const priority = aiSuggestions[task.title]?.priority_score || task.priority_score;
                if (priority === null || priority === undefined) return false;
                if (filterPriority === 'high') return priority >= 0.7;
                if (filterPriority === 'medium') return priority >= 0.4 && priority < 0.7;
                if (filterPriority === 'low') return priority < 0.4;
                return true;
              })
              .map(task => {
              const suggestion = aiSuggestions[task.title] || {};
              const priorityDisplay = suggestion.priority_score ? `Priority: ${suggestion.priority_score.toFixed(2)}` : '';
              const deadlineDisplay = suggestion.suggested_deadline ? `Deadline: ${suggestion.suggested_deadline}` : '';
              const categoryDisplay = suggestion.suggested_category ? `Category: ${suggestion.suggested_category}` : '';

              return (
                <li key={task.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{task.title}</h3>
                      <p className="text-gray-600 text-sm">{suggestion.enhanced_description || task.description}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-200 text-green-800' : task.status === 'in_progress' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>{task.status.replace('_',' ').toUpperCase()}</span>
                      <button onClick={() => setEditingTask(task)} className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm">Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm">Delete</button>
                    </div>
                  </div>
                  {(priorityDisplay || deadlineDisplay || categoryDisplay) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 p-4 rounded-lg shadow-inner">
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">AI Suggestions:</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                        {priorityDisplay && <p>{priorityDisplay}</p>}
                        {deadlineDisplay && <p>{deadlineDisplay}</p>}
                        {categoryDisplay && <p>{categoryDisplay}</p>}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} aiSuggestions={aiSuggestions} categories={categories} />}
    </Layout>

    
  )
}
