// LoginPage.tsx
import styled from 'styled-components';
import Particles from './components/Particle';

const LoginContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  
`;

const LoginContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const ParticleBackground = styled(Particles)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Title = styled.h1`
  font-size: 98px;
  margin-bottom: 0px;
  font-family: 'Gill Sans', sans-serif;
  font-weight: 600;
  color: #1DB954;
  // background: linear-gradient(180deg, #1DB954 0%, #535353 75%, #535353 100%);
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
`;

const Slang = styled.div`
font-size: 24px;
margin-bottom: 12px;
color: #B3B3B3;
`;

const LoginPage = () => {
  const handleLogin = () => {
    const clientId = '93f246bc76aa40d2bcbd870aec1d3777';
    const redirectUri = encodeURIComponent('https://spotifyvisz.vercel.app/main');
    const scopes = encodeURIComponent('user-top-read');
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`;
  };

  return (
    <LoginContainer>
      <ParticleBackground />
      <LoginContent>
        <Title>SpotifyVisz</Title>
        <Slang>Visualize your Spotify Taste</Slang>
        <LoginButton onClick={handleLogin}>Login</LoginButton>
      </LoginContent>
    </LoginContainer>
  );
};

export default LoginPage;