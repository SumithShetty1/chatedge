# IntelliChat - AI Chatbot Web Application

## Project Overview
IntelliChat is a full-stack AI chatbot application built with the MERN stack and TypeScript. It enables users to interact with an intelligent assistant powered by Llama 3 model via Groq. The app features secure JWT authentication, chat history, and a responsive interface designed for dynamic, natural language conversations.

## Key Features
- **AI-Powered Chat**: Conversational interface with Llama 3 model
- **Conversation History**: Persists chat history for each user
- **Secure Authentication**: JWT-based user authentication
- **Markdown & Code Support**: AI responses support markdown, with syntax highlighting
- **Responsive Design**: Works across desktop and mobile devices

## Technologies Used:
- **Frontend**: HTML, CSS, TypeScript, React, Material UI (MUI)
- **Backend**: TypeScript, Node.js, Express 
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **Database**: MongoDB (Cloud-hosted via MongoDB Atlas, using Mongoose)
- **AI API**: Groq with Llama 3 model
- **Build Tools**: Vite

## How to Use This Source Code

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account
- Groq API key

### 1. Clone the Repository
```bash
git clone https://github.com/SumithShetty1/intellichat.git
```

### 2. Open Project in VS Code
1. Launch VS Code
2. Select `File` → `Open Folder`
3. Navigate to and select the cloned `intellichat` folder

### 3. Frontend Setup
1. **Open Terminal**:
   - Use the shortcut `Ctrl+`` ` (backtick) to open the integrated terminal
   - Or go to `Terminal` → `New Terminal` in the menu

2. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies and run**:
   ```bash
   npm install
   npm run dev
   ```

3. **Access Frontend**:
   Open your browser and visit: http://localhost:5173

### 4. Backend Setup
1. **Open Terminal**:
   - Use the shortcut `Ctrl+`` ` (backtick) to open the integrated terminal
   - Or go to `Terminal` → `New Terminal` in the menu

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Install dependencies and run**:
   ```bash
   npm install
   npm run dev
   ```

### 5. Environment Configuration

#### Frontend
Create `.env` in `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### Backend
Create `.env` in `/backend`:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_random_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here
COOKIE_DOMAIN = localhost
CORS_ORIGIN=http://localhost:5173
PORT=5000
NODE_ENV=development
```

## Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
