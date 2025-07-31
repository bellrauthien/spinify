import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <FooterContainer>
      <NavButton 
        active={location.pathname === '/'} 
        onClick={() => navigate('/')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Home</span>
      </NavButton>
      
      <NavButton 
        active={location.pathname === '/scan'} 
        onClick={() => navigate('/scan')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Scan QR</span>
      </NavButton>
      
      <NavButton 
        active={location.pathname === '/playlist'} 
        onClick={() => navigate('/playlist')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15V6M21 15L12 12V3M21 15C19.8954 15 19 14.1046 19 13C19 11.8954 19.8954 11 21 11C22.1046 11 23 11.8954 23 13C23 14.1046 22.1046 15 21 15ZM12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Playlist</span>
      </NavButton>
      
      <NavButton 
        active={location.pathname === '/add-songs'} 
        onClick={() => navigate('/add-songs')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Add Songs</span>
      </NavButton>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: #000000;
  border-top: 3px solid #ffcc00;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  left: 0;
  padding: 5px 0;
  position: fixed;
  width: 100%;
  z-index: 9999;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.5);
  height: 50px;
  box-sizing: border-box;
`;

const NavButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.active ? '#ffcc00' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 0.6rem;
  padding: 0;
  margin: 0;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
    filter: drop-shadow(0 0 2px ${props => props.active ? 'rgba(255, 204, 0, 0.7)' : 'rgba(255, 204, 0, 0.3)'});
    transition: all 0.3s ease;
  }
  
  span {
    font-size: 0.6rem;
  }
  
  &:hover {
    color: #ffcc00;
    
    svg {
      transform: translateY(-2px);
      filter: drop-shadow(0 0 8px rgba(255, 0, 222, 0.7));
    }
  }
`;

export default Footer;
