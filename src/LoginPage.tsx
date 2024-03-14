import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #191414;;
  color: white;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const LoginPage = () => {
  const handleLogin = () => {
    const clientId = '93f246bc76aa40d2bcbd870aec1d3777';
    const redirectUri = encodeURIComponent('http://localhost:5173/mainPage');
    const scopes = encodeURIComponent('user-top-read');
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`;
  };

  return (
    <LoginContainer>
      <h1>Login with Spotify</h1>
      <LoginButton onClick={handleLogin}>Login</LoginButton>
    </LoginContainer>
  );
};

export default LoginPage;