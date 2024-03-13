import { useState, useEffect } from 'react';
import styled from 'styled-components';

const TopTracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const TrackList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const TrackItem = styled.li<{ backgroundImage: string }>`
  position: relative;
  padding: 20px;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const TrackName = styled.h3`
  margin: 0;
`;

const ArtistName = styled.p`
  margin: 0;
`;

const TopTracksPage = () => {
	const [topTracks, setTopTracks] = useState([]);
	const [userPlaylist, setUserPlaylist] = useState([]);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchAccessToken = async () => {
			const code = new URLSearchParams(window.location.search).get('code');
			if (code) {
				try {
					const response = await fetch('http://localhost:3001/exchange', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ code }),
					});
					const data = await response.json();
					setAccessToken(data.access_token);
				} catch (error) {
					console.error('Error exchanging authorization code:', error);
				}
			}
		};

		fetchAccessToken();
	}, []);

	useEffect(() => {
		const fetchTopTracks = async () => {
			if (accessToken) {
				try {
					const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					const data = await response.json();
					setTopTracks(data.items);
				} catch (error) {
					console.error('Error fetching top tracks:', error);
				}
			}
		};

		fetchTopTracks();
	}, [accessToken]);

	useEffect(() => {
		const fetchUserPLaylist = async () => {
			if (accessToken) {
				try {
					const response = await fetch('https://api.spotify.com/v1/me/playlists', {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					const data = await response.json();
					setUserPlaylist(data.items);
				} catch (error) {
					console.error('Error fetching top tracks:', error);
				}
			}
		};

		fetchUserPLaylist();
	}, [accessToken]);

	return (
		<TopTracksContainer>
			<h1>My Top 5 Spotify Tracks</h1>
			<TrackList>
				{topTracks.map((track: any) => (
					<TrackItem backgroundImage={track.album.images[0].url}>
						<TrackName>{track.name}</TrackName>
						<ArtistName>{track.artists.map((artist: any) => artist.name).join(', ')}</ArtistName>
					</TrackItem>
				))}
			</TrackList>
			<h1>My Playlist</h1>
			<TrackList>
				{userPlaylist.map((playlist: any) => (
					<TrackItem backgroundImage={playlist.images[0].url}>
						<TrackName>{playlist.name}</TrackName>
						<ArtistName>{playlist.owner.display_name}</ArtistName>
					</TrackItem>
				))}
			</TrackList>
		</TopTracksContainer>
	);
};

export default TopTracksPage;