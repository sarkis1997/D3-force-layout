import { changeColorOnQtyCircle, changeColorOnQtySidebar } from './changeColorOnQty.js';
import { createDataSet } from './fetchData.js';
import { makeQuery, URI, url_NMVW07 } from "./queries.js";

export async function createFramework() {
	let data = await createDataSet(url_NMVW07, makeQuery(URI));
	let dataComplete = [{geoName: 'startPoint', children: data}][0];

	let nodes = [dataComplete];
	dataComplete.children[0].map(item => { nodes.push((item)) });

	let links = [
		{ source: "startPoint", target: "Oceanen" },
		{ source: "startPoint", target: "Antarctica" },
		{ source: "startPoint", target: "Eurazië" },
		{ source: "startPoint", target: "Amerika" },
		{ source: "startPoint", target: "Azië" },
		{ source: "startPoint", target: "Afrika" },
		{ source: "startPoint", target: "Oceanië" }
	];

	console.log(nodes)
	console.log(links)

	let width = 800;
	let height = 500;

	let svg = d3.select('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'frame');

	let simulation = d3.forceSimulation()
		.nodes(nodes)
		.force("link", d3.forceLink(links).id(function(d) {
			console.log(d.geoName); return d.geoName }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2))
		.on("tick", ticked);

	let link = svg
		.append('g')
		.attr('class', 'linkGroup')
		.selectAll('line')
		.data(links)
		.enter()
		.append('line')
		.attr('stroke-width', '3')
		.style('stroke', 'red');

	let node = svg
		.append('g')
		.attr('class', 'nodeGroup')
		.selectAll('circle')
		.data(nodes)
		.enter()
		.append('circle')
		.attr('r', 5)
		.attr('fill', 'green');


	function ticked() {
		link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node
			.attr("cx", function(d) { return d.x })
			.attr("cy", function(d) { return d.y })
	}

}
