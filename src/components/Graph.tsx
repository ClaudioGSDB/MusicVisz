//graph.tsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import SongInfo from './SongInfo';
import WelcomeMessage from './WelcomeMessage';

const similarityThreshold = 0.875;

const GraphContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #141414;
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
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);;

	useEffect(() => {
		const fetchTopTracks = async () => {
			if (accessToken) {
				try {
					const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=40', {
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

					const calculateSimilarity = (track1: Node, track2: Node) => {
						const { key, mode, tempo, valence, energy, danceability } = track1.audioFeatures;
						const { key: key2, mode: mode2, tempo: tempo2, valence: valence2, energy: energy2, danceability: danceability2 } = track2.audioFeatures;

						const normalizedTempo = tempo / 200;
						const normalizedTempo2 = tempo2 / 200;

						const similarityWeights = {
							key: 0.2,
							mode: 0.1,
							tempo: 0.2,
							valence: 0.2,
							energy: 0.2,
							danceability: 0.1,
						};

						const similarity =
							(1 - Math.abs(key - key2) / 12) * similarityWeights.key +
							(1 - Math.abs(mode - mode2)) * similarityWeights.mode +
							(1 - Math.abs(normalizedTempo - normalizedTempo2)) * similarityWeights.tempo +
							(1 - Math.abs(valence - valence2)) * similarityWeights.valence +
							(1 - Math.abs(energy - energy2)) * similarityWeights.energy +
							(1 - Math.abs(danceability - danceability2)) * similarityWeights.danceability;

						return similarity;
					};

					const updatedLinks: Link[] = [];
					for (let i = 0; i < tracks.length; i++) {
						for (let j = i + 1; j < tracks.length; j++) {
							const similarity = calculateSimilarity(tracks[i], tracks[j]);
							if (similarity >= similarityThreshold) {
								updatedLinks.push({ source: tracks[i], target: tracks[j], similarity });
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

		const defs = svg.append('defs');

		defs.selectAll('pattern')
			.data(nodes)
			.join('pattern')
			.attr('id', (d) => d.id)
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('width', 80)
			.attr('height', 80)
			.append('image')
			.attr('xlink:href', (d) => d.albumCoverUrl || 'path/to/fallback-image.png')
			.attr('width', 80)
			.attr('height', 80)


		const simulation = d3.forceSimulation(nodes)
			.force('link', d3.forceLink(links).id((d: any) => d.id).distance(180))
			.force('charge', d3.forceManyBody().strength(-500))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(40))
			.force('x', d3.forceX(width / 2).strength(0.05))
			.force('y', d3.forceY(height / 2).strength(0.05));

		const colorScale = d3.scaleSequential(d3.interpolateGreens)
			.domain([similarityThreshold, 0.95]);

		const link = svg.append('g')
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', (d) => colorScale(d.similarity))
			.attr('stroke-width', 2);

		const nodeGroup = svg.append('g');

		const node = nodeGroup
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', 40)
			.attr('fill', (d) => `url(#${d.id})`)
			.attr('stroke-width', 2)
			.attr('stroke', 'black')
			.call(drag(simulation) as any);

		const label = nodeGroup
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.attr('font-size', '14px')
			.attr('font-weight', 'bold')
			.attr('fill', 'white')
			.text((d) => d.name)
			.attr('visibility', 'hidden')
			.call(drag(simulation) as any);

		const handleMouseOver = (d: Node) => {
			nodeGroup
				.selectAll('circle')
				.filter((_, i) => i === nodes.indexOf(d))
				.transition()
				.duration(250)
				.ease(d3.easeQuadInOut)
				.attr('r', 50)
				.style('filter', 'brightness(30%)');

			label.filter((_, i) => i === nodes.indexOf(d))
				.attr('visibility', 'visible');
		};

		const handleMouseOut = (d: Node) => {
			nodeGroup
				.selectAll('circle')
				.filter((_, i) => i === nodes.indexOf(d))
				.transition()
				.duration(250)
				.ease(d3.easeQuadInOut)
				.attr('r', 40)
				.style('filter', 'brightness(100%)');

			label.filter((_, i) => i === nodes.indexOf(d))
				.attr('visibility', 'hidden');
		};
		nodeGroup
			.selectAll('circle')
			.on('mouseover', function (_, d) { handleMouseOver(d as Node); })
			.on('mouseout', function (_, d) { handleMouseOut(d as Node); })
			.on('click', function (_, d) { setSelectedNode(d as Node); });

		label
			.on('mouseover', function (_, d) { handleMouseOver(d as Node); })
			.on('mouseout', function (_, d) { handleMouseOut(d as Node); })
			.on('click', function (_, d) { setSelectedNode(d as Node); });
		simulation.on('tick', () => {
			link
				.attr('x1', (d) => Math.max(40, Math.min(width - 40, d.source.x ?? 0)))
				.attr('y1', (d) => Math.max(40, Math.min(height - 40, d.source.y ?? 0)))
				.attr('x2', (d) => Math.max(40, Math.min(width - 40, d.target.x ?? 0)))
				.attr('y2', (d) => Math.max(40, Math.min(height - 40, d.target.y ?? 0)));

			node
				.attr('cx', (d) => Math.max(40, Math.min(width - 40, d.x ?? 0)))
				.attr('cy', (d) => Math.max(40, Math.min(height - 40, d.y ?? 0)));

			label
				.attr('x', (d) => Math.max(40, Math.min(width - 40, d.x ?? 0)))
				.attr('y', (d) => Math.max(40, Math.min(height - 40, d.y ?? 0))); // Center the text inside the node
		});
	}, [nodes, links]);

	const drag = (simulation: d3.Simulation<Node, undefined>) => {
		const dragstarted = (event: d3.D3DragEvent<SVGCircleElement | SVGTextElement, Node, unknown>, d: Node) => {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = (event: d3.D3DragEvent<SVGCircleElement | SVGTextElement, Node, unknown>, d: Node) => {
			d.fx = event.x;
			d.fy = event.y;
		};

		const dragended = (event: d3.D3DragEvent<SVGCircleElement | SVGTextElement, Node, unknown>, d: Node) => {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		};

		return d3.drag<SVGCircleElement | SVGTextElement, Node>()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	};

	return (
		<GraphContainer>
			<svg ref={svgRef} width="80%" height="100%">
				<rect width="100%" height="100%" fill="none" stroke="black" strokeWidth="4" />
			</svg>
			{selectedNode ? (
				<SongInfo node={selectedNode} onClose={() => setSelectedNode(null)} />
			) : (
				<WelcomeMessage />
			)}
		</GraphContainer>
	);
};

export type { Node };
export default Graph;
