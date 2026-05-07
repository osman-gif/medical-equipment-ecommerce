export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">🏥 MedEquip</h3>
            <p className="text-gray-400">
              Quality medical equipment for healthcare professionals across Sudan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          {/* Delivery Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Delivery Areas</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Khartoum</li>
              <li>Omdurman</li>
              <li>Khartoum North</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +249 123 456 789</li>
              <li>📧 info@medequip.sd</li>
              <li>📍 Khartoum, Sudan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Medical Equipment Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
