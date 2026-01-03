# PayPal Compliance Advisory - Backend

This is the backend API for the PayPal Compliance Advisory platform, built with Node.js, Express, and Prisma.

## 🚀 Technologies
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **ORM**: Prisma 7
- **Database**: PostgreSQL
- **Security**: JWT, BcryptJS, Helmet, Cookie-Parser
- **File Uploads**: Multer

## 📋 Features
- **Secure Authentication**: HTTP-only cookie-based JWT sessions.
- **Case Management**: Automated rules-based classification for PayPal limitations.
- **Document Handling**: Secure file upload system for identity and compliance documents.
- **Role-based Logic**: User-specific data isolation and status tracking.

## 🛠️ Prerequisites
- Node.js (v18 or higher)
- PostgreSQL instance
- npm or yarn

## ⚙️ Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/paypal_compliance"
   JWT_SECRET="your_secure_random_secret"
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## 🏃 Running the App

### Development Mode
Runs the server with auto-reload:
```bash
npm run dev
```

### Production Mode
Builds the TypeScript code and starts the server:
```bash
npm run build
npm start
```

## 📂 Project Structure
```
src/
├── controllers/    # Request handlers
├── services/       # Business & Classification logic
├── middleware/     # Auth, Error, and Upload middleware
├── routes/         # API Route definitions
├── prisma/         # Schema and client configuration
├── server.ts       # Entry point
└── app.ts          # Express app configuration
```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and set session cookie
- `GET /api/auth/me` - Get current user profile (Protected)
- `POST /api/auth/logout` - Clear session cookie

### Cases
- `GET /api/cases` - List all cases for current user (Protected)
- `POST /api/cases` - Submit a new case for assessment (Protected)
- `GET /api/cases/:id` - Get specific case details (Protected)

## 🛡️ Security Implementation
- **CORS**: Configured to only allow requests from the trusted `FRONTEND_URL`.
- **JWT**: Tokens are stored in `HttpOnly` cookies to prevent XSS-based theft.
- **Hashing**: All passwords are encrypted using BcryptJS (salt round: 10).
- **Headers**: Helmet middleware is used to set secure HTTP headers.
