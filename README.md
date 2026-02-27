# SGSITS Marketplace (GS-MARK-II)

A full-stack marketplace application built for the SGSITS college ecosystem, allowing students to securely buy, sell, and trade items within the community.

## Tech Stack

### Frontend
- **Framework & Routing**: React 18, React Router v7, Vite
- **Real-Time Communication**: Socket.io-client
- **UI & Icons**: Lucide React
- **Network Requests & Utilities**: Axios, js-cookie, Tesseract.js (Optical Character Recognition)

### Backend
- **Server Environment**: Node.js & Express.js
- **Database Architecture**: MongoDB & Mongoose
- **Real-Time Events**: Socket.io
- **Security & Auth**: Clerk, Passport.js (Google OAuth20), JWT, Helmet, bcrypt
- **AI Integrations**: Google GenAI, OpenAI, Groq SDK
- **File Uploads**: Cloudinary, Multer
- **Other utilities**: Nodemailer

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A MongoDB instance (e.g., MongoDB Atlas or local setup)
- API Keys for Clerk, Cloudinary, and AI services (OpenAI/GenAI/Groq)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd GS-MARK-II
   ```
2. Install frontend and backend dependencies:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

### Running the Project
- Open a terminal and run the backend server:
  ```bash
  cd backend
  npm run dev
  ```
- Open another terminal and run the frontend server:
  ```bash
  cd frontend
  npm run dev
  ```

Once both servers are running, access the application at `http://localhost:5173`.
