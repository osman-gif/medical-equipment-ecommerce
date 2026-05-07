export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  )
}
