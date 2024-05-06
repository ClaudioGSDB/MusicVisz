//graph.tsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import SongInfo from './SongInfo';
import WelcomeMessage from './WelcomeMessage';
import Navbar from './NavBar';
import GraphExplanation from './GraphExplanation';
import useMediaQuery from './useMediaQuery';

const similarityThreshold = 0.875;

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #141414;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    height: 100%;
    min-height: 100vh;
    padding-bottom: 0px;
  }
`;

const GraphSVG = styled.svg`
  flex: 1;
  width: 100%;
  height: 100%;
`;


interface Node extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	artists: string[];
	albumCoverUrl: string;
	audioFeatures: {
		[key: string]: number;
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
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [graphRendered, setGraphRendered] = useState(false);
	const [showExplanation, setShowExplanation] = useState(true);
	const isLaptopScreen = useMediaQuery('(min-width: 769px)');

	const handleExplanationClose = () => {
		setShowExplanation(false);
	};

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
		if (nodes.length === 0 || !svgRef.current || graphRendered) return;

		const svg = d3.select(svgRef.current);
		const width = parseInt(svg.style('width'));
		const height = parseInt(svg.style('height'));

		svg.selectAll('*').remove();

		const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 10])
			.on('zoom', zoomed);

		const g = svg.append('g');

		svg.call(zoomBehavior as any);

		const defs = g.append('defs');

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
			.attr('height', 80);

		const nodeRadius = isLaptopScreen ? 40 : 30;
   		const linkDistance = isLaptopScreen ? 180 : 120;
    	const forceStrength = isLaptopScreen ? -650 : -400;

		const simulation = d3.forceSimulation(nodes)
		.force('link', d3.forceLink(links).id((d: any) => d.id).distance(linkDistance))
		.force('charge', d3.forceManyBody().strength(forceStrength))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('collision', d3.forceCollide().radius(nodeRadius))
		.force('x', d3.forceX(width / 2).strength(0.05))
		.force('y', d3.forceY(height / 2).strength(0.05));

		const colorScale = d3.scaleSequential(d3.interpolateGreens)
			.domain([similarityThreshold, 0.95]);

		const link = g.append('g')
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', (d) => colorScale(d.similarity))
			.attr('stroke-width', 2.5);

		const nodeGroup = g.append('g');

		const node = nodeGroup
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', nodeRadius)
			.attr('fill', (d) => `url(#${d.id})`)
			.attr('stroke-width', 2)
			.attr('stroke', 'black')
			.attr('cursor', 'pointer')
			.call(drag(simulation) as any);

		const label = nodeGroup
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.attr('font-size', isLaptopScreen ? '14px' : '12px')
			.attr('font-weight', 'bold')
			.attr('cursor', 'pointer')
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
				.attr('r', isLaptopScreen ? 50 : 40)
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
				.attr('r', nodeRadius)
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

		function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
			g.attr('transform', `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`);
		}

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
			  .attr('y', (d) => Math.max(40, Math.min(height - 40, d.y ?? 0)));
		  });

		setGraphRendered(true);
	}, [nodes, links, isLaptopScreen]);

	useEffect(() => {
		if (showExplanation) {
			const timer = setTimeout(() => {
				setShowExplanation(false);
			}, 50000); // Hide the explanation after 5 seconds

			return () => clearTimeout(timer);
		}
	}, [showExplanation]);

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
		  <Navbar nodes={nodes} onSelectNode={(node) => setSelectedNode(node)} />
		  {showExplanation && <GraphExplanation onClose={handleExplanationClose} />}
		  <GraphSVG ref={svgRef} />
		  {selectedNode ? (
			<SongInfo node={selectedNode} onClose={() => setSelectedNode(null)} />
		  ) : (
			isLaptopScreen && <WelcomeMessage />
		  )}
		</GraphContainer>
	  );
};

export type { Node };
export default Graph;