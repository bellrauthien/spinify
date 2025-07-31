require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for playlists and user song counts
const playlists = {};
const userSongCounts = {};

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback'
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Join a Spotify Jam session
app.post('/api/join-jam', async (req, res) => {
  const { jamCode } = req.body;
  
  if (!jamCode) {
    return res.status(400).json({ error: 'Jam code is required' });
  }
  
  try {
    // This is a mock implementation - in a real app, you would use Spotify API
    // to join an actual Jam session
    
    // Create a mock playlist if it doesn't exist
    if (!playlists[jamCode]) {
      playlists[jamCode] = {
        name: `Jam Session ${jamCode}`,
        songs: [
          { id: '1', name: 'Sample Song 1', artist: 'Artist 1', albumCover: 'https://via.placeholder.com/300' },
          { id: '2', name: 'Sample Song 2', artist: 'Artist 2', albumCover: 'https://via.placeholder.com/300' }
        ]
      };
    }
    
    res.json({ 
      success: true, 
      message: 'Joined jam session',
      playlist: playlists[jamCode]
    });
    
    // Notify all clients about the join
    io.emit('user-joined', { jamCode });
    
  } catch (error) {
    console.error('Error joining jam:', error);
    res.status(500).json({ error: 'Failed to join jam session' });
  }
});

// Add a song to a playlist
app.post('/api/add-song', async (req, res) => {
  const { jamCode, songId, userId, songDetails } = req.body;
  
  if (!jamCode || !songId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check if user has free songs left
    if (!userSongCounts[userId]) {
      userSongCounts[userId] = { count: 0, paid: false };
    }
    
    const userCount = userSongCounts[userId];
    
    // Check if user needs to pay
    if (userCount.count >= 3 && !userCount.paid) {
      return res.status(402).json({ 
        error: 'Payment required', 
        message: 'You have used your 3 free songs. Please pay €1 for 3 more songs.'
      });
    }
    
    // Add song to playlist
    if (playlists[jamCode]) {
      playlists[jamCode].songs.push({
        id: songId,
        name: songDetails.name,
        artist: songDetails.artist,
        albumCover: songDetails.albumCover || 'https://via.placeholder.com/300'
      });
      
      // Increment user song count
      userCount.count++;
      
      // Reset paid status after 3 more songs
      if (userCount.count % 3 === 0) {
        userCount.paid = false;
      }
      
      // Notify all clients about the new song
      io.emit('playlist-updated', { 
        jamCode, 
        playlist: playlists[jamCode] 
      });
      
      res.json({ 
        success: true, 
        message: 'Song added to playlist',
        remainingFreeSongs: userCount.count < 3 ? 3 - userCount.count : 0,
        playlist: playlists[jamCode]
      });
    } else {
      res.status(404).json({ error: 'Jam session not found' });
    }
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ error: 'Failed to add song' });
  }
});

// Process mock payment
app.post('/api/process-payment', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    // In a real app, you would integrate with a payment processor here
    
    // Mark user as paid
    if (!userSongCounts[userId]) {
      userSongCounts[userId] = { count: 0, paid: true };
    } else {
      userSongCounts[userId].paid = true;
    }
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully. You can now add 3 more songs.'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Search for songs (mock implementation)
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  // Mock search results
  const results = [
    { id: '101', name: `${query} Hit 1`, artist: 'Famous Artist', albumCover: 'https://via.placeholder.com/300' },
    { id: '102', name: `${query} Classic`, artist: 'Legend Band', albumCover: 'https://via.placeholder.com/300' },
    { id: '103', name: `${query} Remix`, artist: 'DJ Something', albumCover: 'https://via.placeholder.com/300' },
    { id: '104', name: `${query} Live`, artist: 'Concert Band', albumCover: 'https://via.placeholder.com/300' },
    { id: '105', name: `${query} Acoustic`, artist: 'Indie Artist', albumCover: 'https://via.placeholder.com/300' }
  ];
  
  res.json({ results });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-room', (jamCode) => {
    socket.join(jamCode);
    console.log(`Client joined room: ${jamCode}`);
    
    // Send current playlist to the newly joined client
    if (playlists[jamCode]) {
      socket.emit('playlist-updated', { 
        jamCode, 
        playlist: playlists[jamCode] 
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
