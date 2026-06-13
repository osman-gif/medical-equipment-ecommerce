/* Documentation for frontend/src/components/CategoryFilter.jsx.*/

import { useEffect, useState } from 'react'
import productService from '../services/productService'

export default function CategoryFilter({ onCategoryChange }) {
    /* Renders the CategoryFilter UI component. */
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories()
        setCategories(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategoryChange(null)}
            className="text-left w-full hover:text-primary font-semibold"
          >
            All Products
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className="text-left w-full hover:text-primary"
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
