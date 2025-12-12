# ChatEdge - AI Chatbot Web Application

## Project Overview
ChatEdge is an intelligent AI chatbot that delivers lightning-fast, highly contextual, and human-like conversations. Powered by the advanced Llama 3.1-8B Instant model via Groq, it adapts to user intent across technical topics, creative brainstorming, learning concepts, and general knowledge exploration.

The application provides a seamless real-time chat experience with persistent memory of past interactions, secure access controls, and responsive design for all devices.

## Key Features
- **Natural Conversations**: Human-like dialogue powered by Llama 3.1-8B Instant with Groq's ultra-fast inference
- **Real-Time Streaming Responses**: Token-by-token AI responses via WebSockets for smooth, instant chat flow  
- **Context-Aware Responses**: Maintains conversation context across multiple interactions
- **Persistent Memory**: Saves and recalls your complete chat history
- **Secure Access**: Protected user accounts with industry-standard authentication
- **Rich Content Support**: Displays formatted responses with markdown and syntax-highlighted code
- **Cross-Platform**: Fully responsive interface optimized for desktop and mobile use
- **Built-in Rate Limiting**: Prevents spam and excessive requests for both API and WebSocket chat events

## Primary Use Cases
- Technical Q&A and debugging assistance
- Brainstorming ideas or writing content
- Learning new concepts through dialogue
- Exploring general knowledge, creativity, and productivity


## Technologies Used:
- **Frontend**: HTML, CSS, TypeScript, React, Material UI (MUI)
- **Backend**: TypeScript, Node.js, Express 
- **Real-Time Communication**: Socket.IO (WebSockets)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **Database**: MongoDB (Cloud-hosted via MongoDB Atlas, using Mongoose)
- **AI API**: Groq with Llama 3.1-8B Instant model
- **Build Tools**: Vite


## How to Use This Source Code

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account
- Groq API key

### 1. Clone the Repository
```bash
git clone https://github.com/SumithShetty1/chatedge.git
```

### 2. Open Project in VS Code
1. Launch VS Code
2. Select `File` → `Open Folder`
3. Navigate to and select the cloned `chatedge` folder

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


## Disclaimer
This project is a personal/portfolio project created for educational and demonstration purposes. It is not affiliated with or endorsed by any existing company or product that may share a similar name.
