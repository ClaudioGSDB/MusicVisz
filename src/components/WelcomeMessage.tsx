// WelcomeMessage.tsx
import React from 'react';
import styled from 'styled-components';
import githubLogo from '../assets/github-mark-white.png';

const WelcomeContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  padding: 20px;
  color: white;
  background-color: #212121;
  display: flex;
  z-index: 101;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const Instruction = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const GithubButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 50px;
  background-color: #1db954;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1ed760;
  }
`;


const GithubLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 10px;
  background-color: #1c1c1c;
  text-align: center;
  border-radius: 10px;
`;

const Authors = styled.p`
  font-size: 14px;
  color: #b3b3b3;
`;

const WelcomeMessage: React.FC = () => {
  return (
    <WelcomeContainer>
      <ContentWrapper>
        <Title>Welcome to SpotifyVisz</Title>
        <Description>
          SpotifyVisz is a visualization tool that allows you to explore the characteristics of your favorite songs on Spotify.
        </Description>
        <Instruction>
          Select a song to see its audio features and discover how it compares to your other top tracks.
        </Instruction>
        <GithubButton href="https://github.com/ClaudioGSDB/spotifyVisz" target="_blank">
          <GithubLogo src={githubLogo} alt="GitHub Logo" />
          View on GitHub
        </GithubButton>
      </ContentWrapper>
      <Footer>
        <Authors>
          Made by<br />
          <b>Miguel Montesinos</b> & <b>Claudio Sciotto</b>
        </Authors>
      </Footer>
    </WelcomeContainer>
  );
};

export default WelcomeMessage;