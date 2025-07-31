import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Playlist = ({ jamSession, playlist, setPlaylist }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Redirect to home if no jam session
  useEffect(() => {
    if (!jamSession) {
      navigate('/');
    }
  }, [jamSession, navigate]);

  // Handle add songs button click
  const handleAddSongs = () => {
    navigate('/add-songs');
  };

  if (!jamSession) {
    return null;
  }

  return (
    <PlaylistContainer>
      <JukeboxContainer className="jukebox-container">
        <Title>{jamSession.name || t('playlist.title')}</Title>
        
        {playlist && playlist.length > 0 ? (
          <>
            <SectionTitle>{t('playlist.nowPlaying')}</SectionTitle>
            <NowPlayingCard>
              <AlbumCover src={playlist[0].albumCover} alt={playlist[0].name} />
              <SongInfo>
                <SongName>{playlist[0].name}</SongName>
                <ArtistName>{playlist[0].artist}</ArtistName>
              </SongInfo>
              <PlayingIndicator>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </PlayingIndicator>
            </NowPlayingCard>
            
            {playlist.length > 1 && (
              <>
                <SectionTitle>{t('playlist.upNext')}</SectionTitle>
                <SongsList>
                  {playlist.slice(1).map((song, index) => (
                    <SongItem key={song.id}>
                      <SongNumber>{index + 1}</SongNumber>
                      <SongItemAlbumCover src={song.albumCover} alt={song.name} />
                      <SongItemInfo>
                        <SongItemName>{song.name}</SongItemName>
                        <SongItemArtist>{song.artist}</SongItemArtist>
                      </SongItemInfo>
                    </SongItem>
                  ))}
                </SongsList>
              </>
            )}
          </>
        ) : (
          <EmptyPlaylist>
            <EmptyIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </EmptyIcon>
            <EmptyText>{t('playlist.empty')}</EmptyText>
          </EmptyPlaylist>
        )}
        
        <AddSongsButton onClick={handleAddSongs} className="vintage-button">
          {t('playlist.addSongs')}
        </AddSongsButton>
      </JukeboxContainer>
    </PlaylistContainer>
  );
};

const PlaylistContainer = styled.div`
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

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  margin: 20px 0 10px;
`;

const NowPlayingCard = styled.div`
  background: ${props => props.theme.gradients.dark};
  border: 3px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.large};
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 15px;
  position: relative;
`;

const AlbumCover = styled.img`
  aspect-ratio: 1;
  border: 5px solid #333;
  border-radius: ${props => props.theme.borders.radius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  margin: 0 auto 15px;
  max-width: 200px;
  width: 100%;
`;

const SongInfo = styled.div`
  text-align: center;
`;

const SongName = styled.h3`
  font-size: 1.3rem;
  margin: 0 0 5px;
`;

const ArtistName = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 1rem;
  margin: 0;
`;

const PlayingIndicator = styled.div`
  align-items: flex-end;
  display: flex;
  height: 30px;
  justify-content: center;
  margin-top: 15px;
  
  div {
    animation: sound 0.5s linear infinite alternate;
    background: ${props => props.theme.colors.primary};
    height: 5px;
    margin: 0 2px;
    width: 5px;
    
    &:nth-child(1) {
      animation-duration: 0.7s;
    }
    
    &:nth-child(2) {
      animation-duration: 0.5s;
    }
    
    &:nth-child(3) {
      animation-duration: 0.3s;
    }
    
    &:nth-child(4) {
      animation-duration: 0.6s;
    }
  }
  
  @keyframes sound {
    0% {
      height: 5px;
    }
    100% {
      height: 25px;
    }
  }
`;

const SongsList = styled.ul`
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

const SongNumber = styled.span`
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 10px;
  min-width: 25px;
  text-align: center;
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

const EmptyPlaylist = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
`;

const EmptyIcon = styled.div`
  color: ${props => props.theme.colors.text}80;
  margin-bottom: 15px;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.text}80;
  font-size: 1.1rem;
  text-align: center;
`;

const AddSongsButton = styled.button`
  margin-top: 20px;
  width: 100%;
`;

export default Playlist;
