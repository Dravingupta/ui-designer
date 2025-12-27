# Website Builder Backend API

Hackathon-ready backend for AI Website Builder with Firebase Authentication and MongoDB.

## Features

- Firebase Authentication (token-based)
- MongoDB with Mongoose
- Project CRUD operations
- Public templates system
- ZIP code generation
- Owner-based access control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables:
- `MONGO_URI`: MongoDB connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_PRIVATE_KEY`: Firebase private key

4. Start server:
```bash
npm start
```

Development mode:
```bash
npm run dev
```

## API Endpoints

### Projects

- `POST /projects` - Create project (auth required)
- `GET /projects` - Get user's projects (auth required)
- `GET /projects/:id` - Get single project (owner or public)
- `PUT /projects/:id` - Update project (owner only)
- `DELETE /projects/:id` - Delete project (owner only)
- `PATCH /projects/:id/public` - Toggle public/private (owner only)

### Templates

- `GET /templates` - Get all public projects

### Generate

- `POST /generate/:projectId` - Generate ZIP file (owner or public)

## Authentication

All protected routes require Firebase ID token in Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Firebase Admin SDK
- Archiver (ZIP generation)
