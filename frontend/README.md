# E-Commerce Platform

A modern, full-stack e-commerce platform built with React and Node.js, featuring a robust backend API and a responsive frontend interface. This platform provides a seamless shopping experience with secure authentication, product management, and an intuitive admin dashboard.

![E-Commerce Platform](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

## 🌟 Features

### User Features
- **Authentication & Authorization**
  - Secure login and registration system
  - JWT-based authentication
  - Password encryption
  - Session management

- **Shopping Experience**
  - Browse products with categories and filters
  - Advanced search functionality
  - Product details with images and descriptions
  - Shopping cart management
  - Wishlist functionality
  - Order tracking
  - Secure checkout process

- **User Dashboard**
  - Profile management
  - Order history
  - Address management
  - Wishlist management
  - Review and rating system

### Admin Features
- **Product Management**
  - Add, edit, and delete products
  - Manage product categories
  - Upload product images
  - Inventory management
  - Price management

- **Order Management**
  - View and process orders
  - Update order status
  - Generate order reports
  - Handle returns and refunds

- **User Management**
  - View user accounts
  - Manage user roles
  - Handle user queries
  - User analytics

## 🏗️ Tech Stack

### Frontend
- **Core**
  - React.js 18.x
  - React Router v6 for navigation
  - Context API for state management
  - Custom hooks for reusable logic

- **UI/UX**
  - Material-UI components
  - Responsive design
  - CSS3 with modern features
  - SVG icons and illustrations

- **State Management & API**
  - Axios for API requests
  - React Query for data fetching
  - Form validation with Formik/Yup
  - Local storage for cart persistence

### Backend
- **Core**
  - Node.js with Express.js
  - MongoDB with Mongoose ODM
  - RESTful API architecture
  - MVC pattern implementation

- **Security**
  - JWT authentication
  - Password hashing with bcrypt
  - Input validation and sanitization
  - CORS configuration
  - Rate limiting

- **File Handling**
  - Multer for file uploads
  - Image optimization
  - Cloud storage integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher) or yarn
- Git

### Environment Setup

1. Clone the repository
```bash
git clone https://github.com/binuri2018/ecommerce.git
cd ecommerce
```

2. Backend Setup
```bash
cd backend
npm install

# Create .env file with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Frontend Setup
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start MongoDB
```bash
# Make sure MongoDB is running on your system
```

2. Start the backend server
```bash
cd backend
npm start
# Server will start on http://localhost:5000
```

3. Start the frontend development server
```bash
cd frontend
npm start
# Application will open in your browser at http://localhost:3000
```

## 📁 Project Structure

```
ecommerce/
├── frontend/               
│   ├── public/            # Static files
│   ├── src/              
│   │   ├── Assets/       # Images, fonts, and other static assets
│   │   ├── Components/   # Reusable UI components
│   │   │   ├── common/   # Shared components
│   │   │   ├── layout/   # Layout components
│   │   │   └── forms/    # Form components
│   │   ├── Pages/        # Page components
│   │   ├── context/      # React Context providers
│   │   └── utils/        # Utility functions and helpers
│   └── package.json
│
├── backend/              
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   └── upload.js    # File upload middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   └── server.js        # Entry point
│
└── README.md
```

## 🔧 Available Scripts

### Frontend
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `npm run lint` - Runs ESLint
- `npm run format` - Formats code with Prettier

### Backend
- `npm run dev` - Runs the server in development mode with nodemon
- `npm start` - Runs the server in production mode
- `npm test` - Runs the test suite
- `npm run lint` - Runs ESLint
- `npm run seed` - Seeds the database with initial data

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (Admin)

For detailed API documentation, visit `/api-docs` when running the backend server.

## 👥 Authors

- **Binuri** - *Initial work* - [binuri2018](https://github.com/binuri2018)

