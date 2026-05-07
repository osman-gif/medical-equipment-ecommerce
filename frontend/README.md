# Medical Equipment E-Commerce Platform - Frontend

A modern React-based frontend for a medical equipment e-commerce platform serving Sudan with delivery services.

## Features

- **User Authentication**: Register, login, and user profile management
- **Product Catalog**: Browse medical equipment with search and category filtering
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: View order history, order tracking with status updates
- **Delivery Management**: Select delivery address, view delivery areas and fees
- **User Profile**: Manage personal information and delivery addresses
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback

## Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.3.0
- **Router**: React Router 6.20.0
- **HTTP Client**: Axios 1.6.0
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── NotFound.jsx
│   ├── context/          # Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Profile.jsx
│   │   └── Addresses.jsx
│   ├── services/         # API service layer
│   │   ├── api.js       # Axios configuration
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── deliveryService.js
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.jsx          # Main App component
│   ├── index.jsx        # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.local          # Environment variables
```

## API Integration

The frontend connects to a Django REST API backend with the following endpoints:

### Authentication
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `GET /auth/profile/` - Get current user profile
- `PUT /auth/profile/` - Update user profile

### Products
- `GET /products/` - List all products
- `GET /products/{id}/` - Get product details
- `GET /products/search/` - Search products

### Orders
- `GET /orders/` - List user orders
- `GET /orders/{id}/` - Get order details
- `POST /orders/` - Create new order

### Addresses
- `GET /addresses/` - List user addresses
- `POST /addresses/` - Create address
- `PUT /addresses/{id}/` - Update address
- `DELETE /addresses/{id}/` - Delete address

### Delivery Areas
- `GET /delivery-areas/` - List active delivery areas

## Authentication

The application uses JWT (JSON Web Token) authentication:

1. User logs in → Receives access and refresh tokens
2. Tokens stored in localStorage
3. Access token automatically sent with each API request (via axios interceptor)
4. On 401 error, refresh token is used to get new access token
5. User data stored in React Context for app-wide access

## State Management

### AuthContext
Manages user authentication state:
- `user` - Current logged-in user
- `loading` - Authentication loading state
- `login()` - Login user
- `register()` - Register new user
- `logout()` - Logout user
- `getProfile()` - Fetch user profile

### CartContext
Manages shopping cart state:
- `cart` - Array of items in cart
- `addToCart()` - Add item to cart
- `removeFromCart()` - Remove item from cart
- `updateQuantity()` - Update item quantity
- `clearCart()` - Clear entire cart
- `getTotalPrice()` - Calculate total
- `getTotalItems()` - Get item count

## Protected Routes

Routes that require authentication are wrapped with `ProtectedRoute` component:
- `/checkout` - Shopping checkout
- `/orders` - Order history
- `/orders/:id` - Order details
- `/profile` - User profile
- `/addresses` - Manage addresses

Unauthenticated users are automatically redirected to `/login`

## Styling

The application uses Tailwind CSS with custom color variables:
- **Primary**: #2563eb (Blue)
- **Secondary**: #1e40af (Dark Blue)
- **Accent**: #dc2626 (Red)

## Error Handling

- **Error Boundary**: Catches React component errors
- **API Error Handling**: Axios interceptors handle errors globally
- **Toast Notifications**: User-friendly error/success messages
- **404 Page**: Dedicated NotFound component for missing pages

## Deployment

### Production Build
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

4. **Traditional Hosting** (Nginx/Apache)
   - Upload `dist/` folder contents to web server
   - Configure server to serve `index.html` for all routes

## Environment Variables

Create `.env.local` file with:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Optional: Additional configurations
# VITE_APP_NAME=MedEquip
# VITE_APP_URL=http://localhost:5173
```

## Performance Optimizations

- Code splitting with Vite
- Lazy loading of routes
- Image optimization with next-gen formats
- Minification and tree-shaking
- CSS purging with Tailwind

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Known Issues & Limitations

1. Payment integration requires additional implementation
2. Real-time order tracking requires WebSocket support
3. Image upload functionality requires backend enhancement

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time notifications with WebSocket
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking with live GPS
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Email notifications

## Troubleshooting

### Issue: API Connection Failed
**Solution**: Ensure backend is running on `http://localhost:8000` and `.env.local` has correct API URL

### Issue: Cart Items Lost on Refresh
**Solution**: Cart data should persist in localStorage - Check browser console for errors

### Issue: Authentication Token Expired
**Solution**: The app automatically refreshes expired tokens - If not working, clear localStorage and login again

### Issue: CORS Errors
**Solution**: Ensure backend has CORS middleware enabled for frontend URL

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

Proprietary - Medical Equipment Platform

## Support

For issues or questions, contact the development team.

---

**Last Updated**: January 2024
**Version**: 1.0.0
