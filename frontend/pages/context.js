import { useState } from 'react';
import { addContext } from '../services/api';
import Link from 'next/link';

export default function AddContextPage() {
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState('note');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await addContext({ content, source_type: sourceType });
      setSuccess('Context added successfully!');
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Add Context</h1>
          <Link href="/" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            Back to Tasks
          </Link>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Enter any text to provide context (e.g., from notes, emails, messages)"
              className="border p-3 rounded w-full mb-4 h-40 focus:ring-2 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="source-type" className="font-semibold">Source:</label>
              <select
                id="source-type"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
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
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Add Context'}
            </button>
          </form>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
        </div>
      </div>
    </div>
  );
}