/* Documentation for frontend/src/components/NotFound.jsx.*/

import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

export default function NotFound() {
    /* Renders the NotFound UI component. */
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 text-lg mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary font-semibold"
        >
          <FiHome className="mr-2" /> Go Home
        </Link>
      </div>
    </div>
  )
}
