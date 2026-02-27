# SGSITS Marketplace (GS-MARK-II)

A full-stack marketplace application built for the SGSITS college ecosystem, allowing students to securely buy, sell, and trade items within the community.

## Features
- **Student Authentication:** Secure sign-up and login via Clerk and Google OAuth to ensure ONLY verified students can access the platform.
- **Product Listings & AI Auto-fill:** Sell your items effortlessly. Upload an image of your product, and the integrated AI vision model automatically extracts details and populates the listing.
- **Real-Time Bidding & Offers:** Make and receive real-time offers on products. Sellers can accept, decline, or negotiate.
- **Live Chat & Negotiation:** Seamless, real-time messaging powered by Socket.io allows buyers and sellers to negotiate deals intuitively.
- **User Dashboard:** Dedicated dashboard to track your listings, ongoing chats, active offers, and transaction history.
- **Secure File Storage:** Cloudinary handles the safe storage and quick retrieval of all product images.

## User Workflow

1. **Sign Up / Login:** Ensure you are a verified student to enter the marketplace.
2. **Browse or Search:** Explore the listed products on the homepage or search for specific items.
3. **List an Item:** Hop to the 'Sell' section, upload a product photo, let the AI generate a description, review, add a price, and post.
4. **Make an Offer:** Found something interesting? Submit an offer directly on the product's page.
5. **Negotiate in Real-Time:** Once an offer is placed, both parties can immediately start an interactive chat to finalize the deal.
6. **Deal Closed:** After a successful negotiation, the item is marked as sold, and the deal is finalized!## Tech Stack

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
