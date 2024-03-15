# SpotifyVisz

SpotifyVisz is an interactive visualization tool that allows you to explore the connections and characteristics of your favorite songs on Spotify. It provides a captivating and immersive experience, revealing the intricate relationships between your top tracks based on their audio features.

## Features

- Visualize your top tracks from Spotify in a dynamic and interactive graph.
- Discover the connections between songs based on their audio features and similarity.
- Explore detailed information about each song, including audio features such as acousticness, danceability, energy, and more.
- Seamlessly navigate through the visualization and interact with individual songs.
- Authenticate with your Spotify account to access your personal top tracks.

## Getting Started

To use SpotifyVisz, simply visit our hosted website at [SpotifyVisz](https://spotifyvisz.vercel.app/).

1. Click on the "Login" button to authenticate with your Spotify account and grant the necessary permissions.

2. Once authenticated, you will be redirected to the main visualization page.

## Usage

- The main visualization page displays a graph representing your top tracks from Spotify.
- Each node in the graph represents a song, and the connections between nodes indicate the similarity between songs based on their audio features.
- Hover over a node to see the song title and enlarge the node size.
- Click on a node to view detailed information about the song, including audio features and album cover.
- Drag and rearrange the nodes to explore the graph and discover new connections.
- Use the "Welcome to SpotifyVisz" panel on the right to learn more about the application and access additional resources.

## Superficial Logic

SpotifyVisz utilizes the following superficial logic to create the visualization:

1. Fetching Top Tracks:

   - The application fetches your top tracks from the Spotify API using your authenticated access token.
   - It retrieves the track information, including the track ID, name, artists, and album cover URL.
   - Additionally, it fetches the audio features for each track, such as acousticness, danceability, energy, and more.

2. Calculating Similarity:

   - The application calculates the similarity between each pair of tracks based on their audio features.
   - It uses a weighted similarity formula that considers various audio features and assigns weights to each feature.
   - Tracks with a similarity score above a specified threshold are considered connected.

3. Graph Visualization:

   - The fetched tracks and their connections are visualized using the D3.js library.
   - Each track is represented as a node in the graph, with the album cover as the node's background image.
   - The connections between nodes are represented as lines, with the line color indicating the strength of the similarity.
   - The graph is animated and interactive, allowing you to explore the connections and rearrange the nodes.

4. Song Information:

   - Clicking on a node displays detailed information about the corresponding song.
   - The song information includes the song title, artists, album cover, and various audio features.
   - The audio features are presented as progress bars, indicating the normalized value of each feature.

5. Authentication:
   - SpotifyVisz uses the Spotify OAuth 2.0 authentication flow to obtain an access token.
   - When you click the "Login" button, you are redirected to the Spotify login page to authorize the application.
   - After successful authentication, you are redirected back to SpotifyVisz with the access token, allowing the application to fetch your top tracks.

## Contributing

Contributions to SpotifyVisz are welcome! If you have any ideas, suggestions, or bug reports, please open an issue on the [GitHub repository](https://github.com/your-username/spotifyvisz/issues). If you'd like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

SpotifyVisz was inspired by the love for music and the desire to explore the connections between songs. It wouldn't have been possible without the amazing Spotify API and the D3.js library for creating the stunning visualizations.

Special thanks to the following resources and libraries:

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [D3.js](https://d3js.org/)
- [React](https://reactjs.org/)
- [Styled Components](https://styled-components.com/)

---

Thank you for using SpotifyVisz! We hope you enjoy exploring your favorite songs and discovering new connections. If you have any questions or feedback, feel free to reach out.

Happy visualizing!
