# Amaze Services

Amaze Services is a full-stack electronic components marketplace designed for engineers, makers, and innovators. It features a modern, responsive storefront and a secure administrative dashboard for inventory management.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Shadcn UI
- **Backend:** Node.js, Express, SQLite, Helmet (Security)
- **State Management:** React Context API (Cart & Auth)

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- npm (comes with Node.js)
- Git

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sai-Deepan/ContinuityProject.git
   cd ContinuityProject
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying the example:
   ```bash
   cp .env.example .env
   ```
   *The default values in `.env.example` will work out of the box for local development.*

## Running the Application Locally

The application consists of a backend API server and a frontend development server. **Both must be running simultaneously.**

1. **Start the Backend Server:**
   Open a terminal and run:
   ```bash
   node server/index.js
   ```
   *This starts the Express API and SQLite database on port 5000.*

2. **Start the Frontend Server:**
   Open a **second, separate terminal** and run:
   ```bash
   npm run dev
   ```
   *This starts the Vite development server on port 5173.*

3. **View the Application:**
   Open your browser and navigate to `http://localhost:5173`.

## Admin Portal Access

To manage the catalog inventory:
1. Navigate to `http://localhost:5173/login`
2. Use the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You can add, edit, or delete electronic components in the dashboard. These changes will reflect globally in the storefront.

## Building for Production

To create a highly optimized, code-split production build:
```bash
npm run build
```
This command compiles TypeScript, minifies assets, and outputs static files into the `dist` directory.

## Project Structure
- `/src` - React frontend (Pages, Components, Contexts, Hooks)
- `/server` - Express backend API and SQLite database (`db.js`, `index.js`)
- `/public` - Static assets (`robots.txt`, images)
