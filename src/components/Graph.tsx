import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #333333;
`;

interface Node extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	artists: string[];
	albumCoverUrl: string;
	audioFeatures: {
		acousticness: number;
		danceability: number;
		energy: number;
		instrumentalness: number;
		key: number;
		loudness: number;
		mode: number;
		speechiness: number;
		tempo: number;
		valence: number;
	};
}

interface Link extends d3.SimulationLinkDatum<Node> {
	source: Node;
	target: Node;
	similarity: number;
}

const Graph = ({ accessToken }: { accessToken: string | null }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const [nodes, setNodes] = useState<Node[]>([]);
	const [links, setLinks] = useState<Link[]>([]);

	useEffect(() => {
		const fetchTopTracks = async () => {
			if (accessToken) {
				try {
					const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=25', {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					const data = await response.json();
					const trackIds = data.items.map((track: any) => track.id);

					const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					const audioFeaturesData = await audioFeaturesResponse.json();

					const tracks: Node[] = data.items.map((track: any, index: number) => ({
						id: track.id,
						name: track.name,
						artists: track.artists.map((artist: any) => artist.name),
						albumCoverUrl: track.album.images[0].url,
						audioFeatures: audioFeaturesData.audio_features[index],
					}));

					const similarityThreshold = 0.80;

					const calculateSimilarity = (track1: Node, track2: Node) => {
						const { acousticness, danceability, energy, instrumentalness, key, loudness, mode, speechiness, tempo, valence } = track1.audioFeatures;
						const { acousticness: acousticness2, danceability: danceability2, energy: energy2, instrumentalness: instrumentalness2, key: key2, loudness: loudness2, mode: mode2, speechiness: speechiness2, tempo: tempo2, valence: valence2 } = track2.audioFeatures;

						const normalizedTempo = tempo / 200; // Normalize tempo to a 0-1 range
						const normalizedTempo2 = tempo2 / 200;

						const similarity =
							(1 - Math.abs(acousticness - acousticness2)) * 0.1 +
							(1 - Math.abs(danceability - danceability2)) * 0.1 +
							(1 - Math.abs(energy - energy2)) * 0.1 +
							(1 - Math.abs(instrumentalness - instrumentalness2)) * 0.1 +
							(1 - Math.abs(key - key2) / 12) * 0.1 +
							(1 - Math.abs(loudness - loudness2) / 60) * 0.1 +
							(1 - Math.abs(mode - mode2)) * 0.1 +
							(1 - Math.abs(speechiness - speechiness2)) * 0.1 +
							(1 - Math.abs(normalizedTempo - normalizedTempo2)) * 0.1 +
							(1 - Math.abs(valence - valence2)) * 0.1;

						return similarity >= similarityThreshold;
					};

					const updatedLinks: Link[] = [];
					for (let i = 0; i < tracks.length; i++) {
						for (let j = i + 1; j < tracks.length; j++) {
							if (calculateSimilarity(tracks[i], tracks[j])) {
								updatedLinks.push({ source: tracks[i], target: tracks[j], similarity: 0 });
							}
						}
					}

					setNodes(tracks);
					setLinks(updatedLinks);
				} catch (error) {
					console.error('Error fetching top tracks:', error);
				}
			} else {
				console.error('No access token available');
			}
		};

		fetchTopTracks();
	}, [accessToken]);

	useEffect(() => {
		if (nodes.length === 0 || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const width = parseInt(svg.style('width'));
		const height = parseInt(svg.style('height'));

		const simulation = d3.forceSimulation(nodes)
			.force('link', d3.forceLink(links).id((d: any) => d.id).distance(200))
			.force('charge', d3.forceManyBody().strength(-500))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(60))
			.force('x', d3.forceX(width / 2).strength(0.05))
			.force('y', d3.forceY(height / 2).strength(0.05));

		const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
			.domain([0, 1]);

		const link = svg.append('g')
			.attr('stroke-opacity', 0.6)
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', (d) => colorScale(d.similarity))
			.attr('stroke-width', 2);

		const node = svg.append('g')
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', 50)
			.attr('fill', (d) => `url(#${d.id})`)
			.call(drag(simulation) as any);

		const defs = svg.append('defs');

		defs.selectAll('pattern')
			.data(nodes)
			.join('pattern')
			.attr('id', (d) => d.id)
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('width', 100)
			.attr('height', 100)
			.append('image')
			.attr('xlink:href', (d) => d.albumCoverUrl)
			.attr('width', 100)
			.attr('height', 100);

		simulation.on('tick', () => {
			link
				.attr('x1', (d) => d.source.x ?? 0)
				.attr('y1', (d) => d.source.y ?? 0)
				.attr('x2', (d) => d.target.x ?? 0)
				.attr('y2', (d) => d.target.y ?? 0);

			node
				.attr('cx', (d) => Math.max(50, Math.min(width - 50, d.x ?? 0)))
				.attr('cy', (d) => Math.max(50, Math.min(height - 50, d.y ?? 0)));
		});
	}, [nodes, links]);

	const drag = (simulation: d3.Simulation<Node, undefined>) => {
		const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) => {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = (event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) => {
			d.fx = event.x;
			d.fy = event.y;
		};

		const dragended = (event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) => {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		};

		return d3.drag<SVGCircleElement, Node>()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	};

	return (
		<GraphContainer>
			<svg ref={svgRef} width="100%" height="100%">
				<rect width="100%" height="100%" fill="none" stroke="black" strokeWidth="4" />
			</svg>
		</GraphContainer>
	);
};

export default Graph;