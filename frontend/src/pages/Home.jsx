/* Documentation for frontend/src/pages/Home.jsx.*/

import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    /* Renders the Home UI component. */
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Quality Medical Equipment</h1>
              <p className="text-xl mb-8">
                Professional-grade medical equipment for healthcare facilities across Sudan.
              </p>
              <div className="space-x-4">
                <Link
                  to="/products"
                  className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Shop Now
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl">🏥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-4">Quality Assured</h3>
              <p className="text-gray-600">All products are certified and meet international standards.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">We deliver across all major cities in Sudan quickly.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-4">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing without compromising on quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8">Browse our complete catalog of medical equipment</p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
