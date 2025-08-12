import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { addContext, fetchContexts, updateContext, deleteContext } from '../services/api';
import Layout from '../components/Layout';

// Edit Context Modal Component
const EditContextModal = ({ context, onClose, onSave }) => {
  const [content, setContent] = useState(context.content);
  const [sourceType, setSourceType] = useState(context.source_type);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      await onSave(context.id, { content, source_type: sourceType });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Context</h2>
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            Error: {error}
          </p>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            placeholder="Enter context from emails, notes, etc."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <select
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <option value="note">Note</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="other">Other</option>
          </select>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ContextPage() {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState('note');
  const [adding, setAdding] = useState(false);
  const [editingContext, setEditingContext] = useState(null); // State to hold the context being edited

  const loadContexts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContexts();
      setContexts(data);
    } catch (err) {
      setError(`Could not load contexts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContexts();
  }, [loadContexts]);

  const handleAddContext = useCallback(async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await addContext({ content, source_type: sourceType });
      setContent('');
      setSourceType('note');
      loadContexts();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }, [content, sourceType, loadContexts]);

  const handleEditClick = (context) => {
    setEditingContext(context);
  };

  const handleDeleteClick = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this context entry?')) {
      setError('');
      try {
        await deleteContext(id);
        loadContexts(); // Reload contexts to reflect changes
      } catch (err) {
        setError(`Failed to delete context: ${err.message}`);
      }
    }
  }, [loadContexts]);

  const handleUpdateContext = useCallback(async (id, updatedData) => {
    setError('');
    try {
      await updateContext(id, updatedData);
      loadContexts(); // Reload contexts to reflect changes
    } catch (err) {
      setError(`Failed to update context: ${err.message}`);
      throw err; // Re-throw to be caught by modal's error handling
    }
  }, [loadContexts]);

  return (
    <Layout>
      <Head>
        <title>Manage Context</title>
      </Head>

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Manage Your Context
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left column: Add new context */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Add New Context
            </h2>
            <form onSubmit={handleAddContext} className="space-y-4">
              <textarea
                placeholder="Enter context from emails, notes, etc."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <select
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                <option value="note">Note</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add Context'}
              </button>
            </form>
          </div>

          {/* Right column: Context history */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Context History
            </h2>
            {error && (
              <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
                Error: {error}
              </p>
            )}
            {loading ? (
              <p className="text-gray-600">Loading context history...</p>
            ) : (
              <ul className="space-y-4 max-h-[70vh] overflow-y-auto">
                {contexts.length === 0 && (
                  <li className="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
                    No context history found.
                  </li>
                )}
                {contexts.map((context) => (
                  <li
                    key={context.id}
                    className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        Source: {context.source_type}
                      </p>
                      <p className="text-gray-600 text-sm">{context.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Added on: {new Date(context.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => handleEditClick(context)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(context.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {editingContext && (
        <EditContextModal
          context={editingContext}
          onClose={() => setEditingContext(null)}
          onSave={handleUpdateContext}
        />
      )}
    </Layout>
  );
}
