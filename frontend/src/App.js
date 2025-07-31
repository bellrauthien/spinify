import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider } from 'styled-components';
import io from 'socket.io-client';

// Pages
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import Playlist from './pages/Playlist';
import AddSongs from './pages/AddSongs';
import Payment from './pages/Payment';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Theme
import { theme } from './utils/theme';
import './App.css';

// Socket.io connection
const socket = io('http://localhost:5000');

function App() {
  const { t } = useTranslation();
  const [jamSession, setJamSession] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [spotifyUserId, setSpotifyUserId] = useState(null);

  // Generate a unique user ID on first load and check for Spotify user ID
  useEffect(() => {
    // Set app user ID
    const storedUserId = localStorage.getItem('spinify_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('spinify_user_id', newUserId);
      setUserId(newUserId);
    }
    
    // Check for Spotify user ID
    const storedSpotifyUserId = localStorage.getItem('spinify_spotify_user_id');
    if (storedSpotifyUserId) {
      setSpotifyUserId(storedSpotifyUserId);
    }
  }, []);

  // Listen for playlist updates
  useEffect(() => {
    if (!socket) return;

    socket.on('playlist-updated', (data) => {
      if (jamSession && data.jamCode === jamSession.code) {
        setPlaylist(data.playlist.songs);
      }
    });

    return () => {
      socket.off('playlist-updated');
    };
  }, [jamSession, socket]);

  // Join a jam session room
  const joinJamSession = (jamCode) => {
    socket.emit('join-room', jamCode);
  };
  
  // Handle Spotify login success
  const handleSpotifyLoginSuccess = (spotifyId) => {
    setSpotifyUserId(spotifyId);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Router>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={
                <Home 
                  setJamSession={setJamSession} 
                  joinJamSession={joinJamSession}
                  spotifyUserId={spotifyUserId}
                  onSpotifyLoginSuccess={handleSpotifyLoginSuccess}
                />
              } />
              <Route path="/scan" element={
                <ScanQR 
                  setJamSession={setJamSession} 
                  joinJamSession={joinJamSession}
                  spotifyUserId={spotifyUserId}
                />
              } />
              <Route path="/playlist" element={
                <Playlist 
                  jamSession={jamSession} 
                  playlist={playlist} 
                  setPlaylist={setPlaylist}
                  spotifyUserId={spotifyUserId}
                />
              } />
              <Route path="/add-songs" element={
                <AddSongs 
                  jamSession={jamSession} 
                  userId={userId} 
                  spotifyUserId={spotifyUserId}
                  setPlaylist={setPlaylist} 
                />
              } />
              <Route path="/payment" element={<Payment userId={userId} />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route path="/auth-success" element={<AuthCallback />} />
              <Route path="/auth-error" element={<AuthError />} />
            </Routes>
          </MainContent>
          <Footer />
        </Router>
      </AppContainer>
    </ThemeProvider>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.main};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
`;

export default App;
