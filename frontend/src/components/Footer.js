import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only show footer on certain pages
  if (location.pathname === '/scan') {
    return null;
  }
  
  return (
    <FooterContainer>
      <NavButton 
        isActive={location.pathname === '/'} 
        onClick={() => navigate('/')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Home</span>
      </NavButton>
      
      <NavButton 
        isActive={location.pathname === '/scan'} 
        onClick={() => navigate('/scan')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Scan QR</span>
      </NavButton>
      
      <NavButton 
        isActive={location.pathname === '/playlist'} 
        onClick={() => navigate('/playlist')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Playlist</span>
      </NavButton>
      
      <NavButton 
        isActive={location.pathname === '/add-songs'} 
        onClick={() => navigate('/add-songs')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Add Songs</span>
      </NavButton>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: ${props => props.theme.gradients.dark};
  border-top: 3px solid ${props => props.theme.colors.primary};
  bottom: 0;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  position: sticky;
  width: 100%;
  z-index: 100;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  padding: 5px;
  transition: all 0.2s;
  
  svg {
    margin-bottom: 4px;
    stroke: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
    transition: all 0.2s;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    
    svg {
      stroke: ${props => props.theme.colors.primary};
    }
  }
`;

export default Footer;
