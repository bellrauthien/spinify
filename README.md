# Spinify - Vintage Jukebox Mobile App Simulator

Spinify is a web application that simulates a mobile app in the browser, designed with a vintage 70s-80s jukebox aesthetic. It allows users to join music sessions via QR codes, add songs to a shared playlist, and interact with the Spotify API.

## Features

- 🎵 Vintage-style UI inspired by 70s-80s jukeboxes
- 📱 Mobile app simulation in browser
- 📷 QR code scanner using device camera
- 🎧 Real-time playlist updates
- 🌐 Language selection (English and Spanish)
- 🎵 Spotify API integration
- 💰 Mock payment system (3 free songs, then €1 for 3 more)
- 🚀 No login required

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- Windows OS

## Project Structure

```
spinify/
├── frontend/           # React frontend application
│   ├── public/         # Public assets
│   └── src/            # Source code
│       ├── components/ # Reusable components
│       ├── pages/      # Page components
│       ├── context/    # React context
│       ├── hooks/      # Custom hooks
│       ├── utils/      # Utility functions
│       └── assets/     # Images, fonts, etc.
└── backend/           # Node.js backend server
    ├── server.js      # Main server file
    └── .env           # Environment variables
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd spinify
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory by copying the example template:

```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# On Windows:
copy backend\.env.example backend\.env
```

Then edit the `.env` file to add your Spotify API credentials:

```
PORT=5000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

To get your Spotify API credentials:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Copy the Client ID and Client Secret to your `.env` file

**IMPORTANT: Security Note**
Never commit your `.env` file containing real credentials to version control. The `.gitignore` file is configured to exclude this file, but always double-check before committing.

### 4. Start the application

```bash
# Start the backend server (from the backend directory)
npm run dev

# In a new terminal, start the frontend (from the frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Simulating Mobile View in Browser

To simulate a mobile device in your browser:

1. Open Chrome DevTools (F12 or Ctrl+Shift+I)
2. Click on the "Toggle device toolbar" button (Ctrl+Shift+M)
3. Select a mobile device from the dropdown (e.g., iPhone X)
4. Refresh the page

Alternatively, you can access the application from your mobile device if both your computer and mobile device are on the same network:

1. Find your computer's local IP address
2. In the frontend package.json, add: `"start": "set HOST=your_local_ip && react-scripts start"`
3. Access the application from your mobile device at: http://your_local_ip:3000

## Development

### Running in Development Mode

```bash
# Backend (watches for changes using nodemon)
cd backend
npm run dev

# Frontend (with hot reloading)
cd frontend
npm start
```

### Testing the QR Code Scanner

To test the QR code scanner functionality:

1. Generate a QR code with a jam session code (e.g., "JAM123")
2. Display it on another device or print it
3. Use the "Scan QR" feature in the app to scan the code

## License

This project is licensed under the MIT License.
