import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';

const AddSongs = ({ jamSession, userId, setPlaylist }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [freeSongsRemaining, setFreeSongsRemaining] = useState(3);
  const [paymentRequired, setPaymentRequired] = useState(false);

  // Redirect to home if no jam session
  useEffect(() => {
    if (!jamSession) {
      navigate('/');
    }
  }, [jamSession, navigate]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || t('common.error'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle adding a song to the playlist
  const handleAddSong = async (song) => {
    if (!jamSession || !userId) return;
    
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/add-song', {
        jamCode: jamSession.code,
        songId: song.id,
        userId,
        songDetails: {
          name: song.name,
          artist: song.artist,
          albumCover: song.albumCover
        }
      });
      
      if (response.data.success) {
        setSuccessMessage(t('addSongs.songAdded'));
        setPlaylist(response.data.playlist.songs);
        setFreeSongsRemaining(response.data.remainingFreeSongs);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error adding song:', err);
      
      if (err.response?.status === 402) {
        setPaymentRequired(true);
      } else {
        setError(err.response?.data?.error || t('common.error'));
      }
    }
  };

  // Handle going to payment page
  const handleGoToPayment = () => {
    navigate('/payment');
  };

  if (!jamSession) {
    return null;
  }

  return (
    <AddSongsContainer>
      <JukeboxContainer className="jukebox-container">
        <Title>{t('addSongs.title')}</Title>
        
        {paymentRequired ? (
          <PaymentRequired>
            <PaymentIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PaymentIcon>
            <PaymentText>{t('addSongs.paymentRequired')}</PaymentText>
            <Button onClick={handleGoToPayment} className="vintage-button">
              {t('addSongs.goToPay')}
            </Button>
          </PaymentRequired>
        ) : (
          <>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('addSongs.searchPlaceholder')}
                required
              />
              <SearchButton type="submit" disabled={isSearching}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SearchButton>
            </SearchForm>
            
            {freeSongsRemaining < 3 && (
              <FreeSongsInfo>
                {t('addSongs.freeSongsRemaining', { count: freeSongsRemaining })}
              </FreeSongsInfo>
            )}
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            
            {isSearching ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>{t('common.loading')}</LoadingText>
              </LoadingContainer>
            ) : searchResults.length > 0 ? (
              <ResultsList>
                {searchResults.map((song) => (
                  <SongItem key={song.id}>
                    <SongItemAlbumCover src={song.albumCover} alt={song.name} />
                    <SongItemInfo>
                      <SongItemName>{song.name}</SongItemName>
                      <SongItemArtist>{song.artist}</SongItemArtist>
                    </SongItemInfo>
                    <AddButton onClick={() => handleAddSong(song)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </AddButton>
                  </SongItem>
                ))}
              </ResultsList>
            ) : searchQuery ? (
              <NoResults>{t('addSongs.noResults')}</NoResults>
            ) : null}
          </>
        )}
      </JukeboxContainer>
    </AddSongsContainer>
  );
};

const AddSongsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 70vh;
`;

const JukeboxContainer = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 20px;
  position: relative;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.medium};
  color: ${props => props.theme.colors.text};
  flex: 1;
  font-size: 1rem;
  padding: 12px 15px;
  
  &:focus {
    border-color: ${props => props.theme.colors.accent};
    outline: none;
  }
`;

const SearchButton = styled.button`
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 0 ${props => props.theme.borders.radius.medium} ${props => props.theme.borders.radius.medium} 0;
  color: white;
  cursor: pointer;
  padding: 0 15px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  
  &:hover {
    background: ${props => props.theme.colors.primary}dd;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.primary}80;
    cursor: not-allowed;
  }
`;

const FreeSongsInfo = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 0.9rem;
  margin: 0 0 15px;
  text-align: center;
`;

const ResultsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SongItem = styled.li`
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borders.radius.medium};
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
`;

const SongItemAlbumCover = styled.img`
  border-radius: ${props => props.theme.borders.radius.small};
  height: 50px;
  margin-right: 15px;
  width: 50px;
`;

const SongItemInfo = styled.div`
  flex: 1;
`;

const SongItemName = styled.h4`
  font-size: 1rem;
  margin: 0 0 5px;
`;

const SongItemArtist = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 0.8rem;
  margin: 0;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NoResults = styled.p`
  color: ${props => props.theme.colors.text}80;
  font-size: 1.1rem;
  margin: 30px 0;
  text-align: center;
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  height: 40px;
  margin-bottom: 15px;
  width: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.success};
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
`;

const PaymentRequired = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 0;
`;

const PaymentIcon = styled.div`
  color: ${props => props.theme.colors.accent};
  margin-bottom: 15px;
`;

const PaymentText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 10px;
  width: 100%;
`;

export default AddSongs;
