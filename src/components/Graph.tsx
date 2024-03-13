import React, { useState, useEffect } from 'react';
import Node from './CircleNode';
import styled from 'styled-components';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
`;

interface Node extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	artists: string[];
	albumCoverUrl: string;
	edges: Node[];
}

const Graph = ({ accessToken }: { accessToken: string | null }) => {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [simulation, setSimulation] = useState<d3.Simulation<Node, undefined> | null>(null);

	useEffect(() => {
		const fetchTopTracks = async (offset: number) => {
			if (accessToken) {
				try {
					const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=' + offset, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					const data = await response.json();
					const tracks: Node[] = data.items.map((track: any) => ({
						id: track.id,
						name: track.name,
						artists: track.artists.map((artist: any) => artist.name),
						albumCoverUrl: track.album.images[0].url,
						edges: [],
					}));

					const updatedNodes = [...tracks];
					const radius = 25;
					setNodes(updatedNodes);
					for (let i = 0; i < updatedNodes.length; i++) {

						tracks[i].x = radius + Math.random() * (window.innerWidth - 2 * radius);
						tracks[i].y = radius + Math.random() * (window.innerHeight - 2 * radius);

						for (let j = i + 1; j < updatedNodes.length; j++) {
							addEdge(updatedNodes[i], updatedNodes[j]);
						}
					}


					initializeSimulation(updatedNodes);
				} catch (error) {
					console.error('Error fetching top tracks:', error);
				}
			} else {
				console.error('No access token available');
			}
		};

		fetchTopTracks(0); // work here
	}, [accessToken]);

	const addEdge = (node1: Node, node2: Node) => {
		const sharedArtists = node1.artists.filter(artist => node2.artists.includes(artist));
		if (sharedArtists.length > 0) {
			node1.edges.push(node2);
			node2.edges.push(node1);
		}
	};

	const initializeSimulation = (nodes: Node[]) => {
		const simulation = d3
			.forceSimulation(nodes)
			.force('charge', d3.forceManyBody().strength(-500))
			.force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
			.force('collision', d3.forceCollide().radius(60))
			.on('tick', () => {
				setSimulation(simulation);
			});

		setSimulation(simulation);
	};

	return (
		<GraphContainer>
			<svg width="1000" height="1000">
				<rect width="100%" height="100%" fill="none" stroke="black" stroke-width="4" />
				{nodes.map((node, index) => (
					<React.Fragment key={node.id}>
						<Node
							x={node.x}
							y={node.y}
							size={50}
							backgroundImage={node.albumCoverUrl}
						/>
						{node.edges.map(edge => (
							<line
								key={`${node.id}-${edge.id}`}
								x1={node.x}
								y1={node.y}
								x2={edge.x}
								y2={edge.y}
								stroke="black"
								strokeWidth={2}
							/>
						))}
					</React.Fragment>
				))}
			</svg>
		</GraphContainer>
	);
};

export default Graph;