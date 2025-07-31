import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Change language handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('spinify_language', lng);
    setShowLanguageMenu(false);
  };

  // Go back handler
  const goBack = () => {
    navigate(-1);
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <HeaderContainer>
      <HeaderContent>
        {!isHomePage && (
          <BackButton onClick={goBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
        )}
        
        <Logo className="neon-text">{t('common.appName')}</Logo>
        
        <LanguageButton 
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          aria-label={t('common.language')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </LanguageButton>
        
        {showLanguageMenu && (
          <LanguageMenu>
            <LanguageOption onClick={() => changeLanguage('en')}>
              English {i18n.language === 'en' && '✓'}
            </LanguageOption>
            <LanguageOption onClick={() => changeLanguage('es')}>
              Español {i18n.language === 'es' && '✓'}
            </LanguageOption>
          </LanguageMenu>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: ${props => props.theme.gradients.dark};
  border-bottom: 3px solid ${props => props.theme.colors.primary};
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
`;

const Logo = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 1.8rem;
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const LanguageMenu = styled.div`
  background: ${props => props.theme.colors.backgroundLight};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  position: absolute;
  right: 0;
  top: 100%;
  width: 150px;
  z-index: 101;
`;

const LanguageOption = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 15px;
  text-align: left;
  width: 100%;
  
  &:hover {
    background: ${props => props.theme.colors.primary}33;
  }
`;

export default Header;
