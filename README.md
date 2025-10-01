# DecodedAI - AppBuilder
AI powered AppBuilder Portal

## Features
- Create, edit, and delete projects.
- Generate UI mockups using AI (Groq).
- View extracted requirements and live mockup previews.
- Download generated HTML files.
- Responsive UI with real-time feedback.

## ENV FILE CONTENTS
  ```
  MONGO_URI=your_mongodb_connection_string
  PORT=5001
  GROQ_API_KEY=your_groq_key
  UPSTASH_REDIS_REST_URL=your_redis_url
  UPSTASH_REDIS_REST_TOKEN=your_redis_token
  NODE_ENV=development
  ```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Hot Toast, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), CORS, dotenv, Groq SDK, Upstash Redis for rate limiting.
- **Other**: Axios for API calls, Blob downloads.

  ## Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Redis (via Upstash for rate limiting)
- API keys for Groq

## Running:
clone repo, cd into folder: 
- npm build
- npm start

The server runs on `http://localhost:5001` by default.

