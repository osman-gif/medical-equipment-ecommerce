/* Documentation for frontend/src/components/ErrorBoundary.jsx.*/

import { Component } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <FiAlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">We encountered an unexpected error.</p>
            <details className="mb-6 text-left bg-gray-100 p-4 rounded text-sm">
              <summary className="cursor-pointer font-semibold mb-2">Error details</summary>
              <pre className="text-red-600 overflow-auto">{this.state.error?.toString()}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
