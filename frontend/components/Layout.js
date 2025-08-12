
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight hover:text-gray-200 transition-colors duration-300">
            Smart To-Do
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-lg font-medium hover:text-gray-200 transition-colors duration-300">
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/context" className="text-lg font-medium hover:text-gray-200 transition-colors duration-300">
                  Context
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-6 px-6 md:px-12 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Smart To-Do. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
