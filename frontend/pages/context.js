
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { addContext, fetchContexts } from '../services/api';
import Layout from '../components/Layout';

export default function ContextPage() {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState('note');
  const [adding, setAdding] = useState(false);

  const loadContexts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContexts();
      setContexts(data);
    } catch (err) {
      setError('Could not load contexts.');
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

  return (
    <Layout>
      <Head>
        <title>Manage Context</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Manage Your Context</h1>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Context</h2>
          <form onSubmit={handleAddContext} className="space-y-4">
            <div>
              <label htmlFor="contextContent" className="sr-only">Context Content</label>
              <textarea
                id="contextContent"
                placeholder="Enter context from emails, notes, etc."
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="sourceType" className="sr-only">Source Type</label>
              <select
                id="sourceType"
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                <option value="note">Note</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add Context'}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Context History</h2>
        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 shadow-md">Error: {error instanceof Error ? error.message : error}</p>}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading context history...</p>
        ) : (
          <ul className="space-y-4">
            {contexts.length === 0 && <li className="bg-gray-50 p-6 rounded-lg shadow-md text-center text-gray-600">No context history found.</li>}
            {contexts.map(context => (
              <li key={context.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <p className="font-semibold text-lg text-gray-800 mb-1">Source: {context.source_type}</p>
                <p className="text-gray-600 text-sm">{context.content}</p>
                <p className="text-xs text-gray-400 mt-3">Added on: {new Date(context.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
