# AI-UI-Website Builder

<div align="center">

![Status](https://img.shields.io/badge/Status-Online-success?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

**Construct high-fidelity interfaces with machine precision. Drag. Drop. Compile.**

[Features](#features) • [Quick Start](#quick-start) • [Tech Stack](#tech-stack) • [Documentation](#documentation)

</div>

---

## 🚀 Overview

**Automator.UI** is a modern, AI-powered website builder that empowers users to create stunning web interfaces through an intuitive drag-and-drop editor. The platform combines visual design tools with intelligent code generation to produce clean, semantic React + Tailwind CSS code.

### Key Highlights

- 🎨 **Visual Design Engine** - Direct manipulation interface for instant layout generation
- ⚡ **Real-time Synchronization** - Sub-millisecond state updates across all viewports
- 📦 **Clean Code Output** - Generate semantic, production-ready React + Tailwind code
- 🔐 **Firebase Authentication** - Secure user authentication and authorization
- 💾 **MongoDB Storage** - Persistent project storage with owner-based access control
- 🎁 **Template System** - Public templates for quick project initialization
- 📥 **Export Functionality** - Download complete projects as ZIP files

---

## ✨ Features

### For Designers & Developers

- **Drag & Drop Editor** - Intuitive visual interface for building layouts
- **Component Library** - Pre-built, customizable UI components
- **Live Preview** - See changes in real-time as you design
- **Responsive Design** - Build layouts that work on all screen sizes
- **Code Export** - Export clean React + Tailwind CSS code
- **Template Gallery** - Browse and clone public templates

### For Teams

- **Project Management** - Organize and manage multiple projects
- **Public/Private Projects** - Control project visibility
- **Access Control** - Owner-based permissions system
- **Cloud Storage** - Projects saved securely in MongoDB

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **DND Kit** - Drag and drop functionality
- **Lucide React** - Beautiful icon library
- **Google Generative AI** - AI-powered features
- **Firebase** - Authentication
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Firebase Admin SDK** - Authentication verification
- **Archiver** - ZIP file generation
- **CORS** - Cross-origin resource sharing

---

## 🚦 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Firebase Project** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dravingupta/ui-designer.git
   cd ui-designer
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up the Backend**

   Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # MongoDB Configuration
   MONGO_URI=your_mongodb_connection_string

   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the Frontend**

   Navigate to the client directory:
   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `client` directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

You can run the frontend and backend separately:

**Backend:**
```bash
cd backend
npm run dev    # Development mode with hot reload
# or
npm start      # Production mode
```

**Frontend:**
```bash
cd client
npm run dev    # Development server
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 📁 Project Structure

```
ui-designer/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── EditorPage.jsx
│   │   ├── utils/            # Utility functions
│   │   ├── firebase.js       # Firebase configuration
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Backend API server
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   ├── app.js            # Express app configuration
│   │   └── index.js          # Server entry point
│   ├── package.json
│   └── README.md
│
├── package.json              # Root package.json
├── .gitignore
└── README.md
```

---

## 🔌 API Documentation

### Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/projects` | Create a new project | ✅ |
| `GET` | `/projects` | Get user's projects | ✅ |
| `GET` | `/projects/:id` | Get single project | Owner or Public |
| `PUT` | `/projects/:id` | Update project | Owner only |
| `DELETE` | `/projects/:id` | Delete project | Owner only |
| `PATCH` | `/projects/:id/public` | Toggle public/private | Owner only |

#### Templates

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/templates` | Get all public projects | ❌ |

#### Generate

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/generate/:projectId` | Generate ZIP file | Owner or Public |

---

## 🎨 Usage Guide

### Creating a New Project

1. **Sign up or Log in** to your account
2. Navigate to the **Dashboard**
3. Click on **"Create New Project"**
4. Choose a template or start from scratch
5. Open the project in the **Visual Editor**

### Using the Visual Editor

1. **Drag components** from the component library onto the canvas
2. **Customize properties** using the inspector panel
3. **Preview** your design in real-time
4. **Export code** or save your project
5. **Download** as a ZIP file for deployment

### Managing Projects

- **Public Projects**: Share templates with the community
- **Private Projects**: Keep your work private and secure
- **Delete Projects**: Remove unwanted projects from your dashboard

---

## 🧪 Development

### Available Scripts

**Frontend** (`client/`):
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

**Backend** (`backend/`):
```bash
npm start         # Start production server
npm run dev       # Start development server with hot reload
```

### Code Style

This project uses ESLint for code linting. Run `npm run lint` to check for issues.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Required
MONGO_URI=               # MongoDB connection string
FIREBASE_PROJECT_ID=     # Firebase project ID
FIREBASE_CLIENT_EMAIL=   # Firebase service account email
FIREBASE_PRIVATE_KEY=    # Firebase private key
```

### Frontend (`client/.env`)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# API Configuration
VITE_API_URL=            # Backend API URL (default: http://localhost:5000)
```

---

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment with `vercel.json`:

```bash
cd client
vercel --prod
```

### Backend

Deploy the backend to any Node.js hosting platform:
- **Heroku**
- **Railway**
- **Render**
- **AWS EC2**
- **DigitalOcean**

Ensure environment variables are properly configured in your hosting platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/Dravingupta/ui-designer/issues).

---

## 📧 Contact

For questions or support, please visit the [GitHub repository](https://github.com/Dravingupta/ui-designer).

---

<div align="center">

**Built with ❤️ by the Automator.UI Team**

⭐ **Star this repo if you find it useful!** ⭐

</div>
