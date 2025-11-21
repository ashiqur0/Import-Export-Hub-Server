# Import Export Hub - Server

**API Base URL:** [https://import-export-hub-api-server-by-ash.vercel.app](https://import-export-hub-api-server-by-ash.vercel.app)

**Client Repository:** [https://github.com/ashiqur0/Import-Export-Hub-Client](https://github.com/ashiqur0/Import-Export-Hub-Client)

**Live Application:** [https://import-export-hub-by-ashiqur.web.app/](https://import-export-hub-by-ashiqur.web.app/)

A robust backend API server for the Import Export Hub platform, providing comprehensive product management, user authentication, and real-time data synchronization for seamless global trade operations.

## ✨ Key Features

- **RESTful API Architecture** - Clean and scalable API endpoints following REST conventions for product, import, and export management
- **Secure Authentication** - Firebase-based user authentication with token verification and role-based access control
- **Real-Time Data Management** - Efficient database operations with atomic updates for inventory synchronization
- **CRUD Operations** - Complete Create, Read, Update, Delete operations for products, imports, and exports
- **User Role Management** - Support for exporter and importer roles with appropriate permissions
- **Error Handling** - Comprehensive error handling with meaningful HTTP status codes and error messages
- **Data Validation** - Input validation and sanitization for all API requests

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Admin SDK
- **Environment Management:** dotenv
- **CORS:** Enabled for client-side requests
- **Deployment:** Vercel

## 📋 Project Structure

```
server/
├── routes/           # API route definitions
├── controllers/      # Request handlers and business logic
├── middleware/       # Authentication and error handling middleware
├── models/           # Database schemas and models
├── services/         # Utility functions and database services
├── config/           # Configuration files
└── .env.example      # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB connection string
- Firebase service account credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/ashiqur0/Import-Export-Hub-Server.git
cd import-export-hub-server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

The server will be available at `http://localhost:5000`

## 📦 Available Scripts

- `npm run dev` - Start development server with nodemon for auto-reload
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks (if configured)

## 🔌 API Endpoints

### Products
- `GET /api/products` - Fetch all products with optional filtering
- `GET /api/products/:id` - Get product details by ID
- `POST /api/products` - Create a new product (requires authentication)
- `PUT /api/products/:id` - Update product details (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Imports
- `GET /api/imports` - Fetch user's imported products (requires authentication)
- `POST /api/imports` - Add product to imports (requires authentication)
- `DELETE /api/imports/:id` - Remove imported product (requires authentication)

### Exports
- `GET /api/exports` - Fetch user's exported products (requires authentication)
- `POST /api/exports` - Create new export product (requires authentication)
- `PUT /api/exports/:id` - Update exported product (owner only)
- `DELETE /api/exports/:id` - Delete exported product (owner only)

### Authentication
- `POST /api/auth/register` - Register new user (via Firebase)
- `POST /api/auth/login` - Login user (via Firebase)
- `POST /api/auth/verify-token` - Verify Firebase token

## 🔐 Authentication & Authorization

- **Firebase Authentication:** All protected routes use Firebase ID tokens for verification
- **Token Verification Middleware:** Validates tokens before processing requests
- **Role-Based Access:** Different permissions for exporters and importers
- **Owner Verification:** Users can only modify their own products and imports

## 📊 Database Schema

### Products Collection
```
{
  _id: ObjectId,
  name: String,
  image: String,
  price: Number,
  originCountry: String,
  rating: Number,
  availableQuantity: Number,
  userId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Imports Collection
```
{
  _id: ObjectId,
  userId: String,
  productId: ObjectId,
  importedQuantity: Number,
  createdAt: Date
}
```

### Users Collection
```
{
  _id: String (Firebase UID),
  name: String,
  email: String,
  photoURL: String,
  role: String (exporter/importer),
  createdAt: Date
}
```

## 🚢 Deployment

This server is deployed on **Vercel** with the following configuration:

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## 📝 Git Commits

This project includes 8+ meaningful commits documenting the development process:
- Initial Express server setup
- MongoDB connection integration
- Firebase authentication middleware
- Product routes implementation
- Import/Export functionality
- Error handling improvements
- And more...

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Ashiqur Rahman**
- GitHub: [github.com/ashiqur0](https://github.com/ashiqur0)
- Email: ashiqurrahmans2018@gmail.com

---

**Last Updated:** November 2025