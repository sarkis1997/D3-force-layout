import { changeColorOnQtyCircle, changeColorOnQtySidebar } from './changeColorOnQty.js';
import { createDataSet } from './fetchData.js';
import { makeQuery, URI, url_NMVW07 } from "./queries.js";

export async function createFramework() {
	let data = await createDataSet(url_NMVW07, makeQuery(URI));
	let dataComplete = [{geoName: 'startPoint', children: data}][0];
	let width = 800;
	let height = 500;


	let nodes = [dataComplete];
	dataComplete.children[0].map(item => { nodes.push((item)) });
	let links = [];

	let simulation = d3.forceSimulation();

	let svg = d3.select('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'frame');

	let link = svg
		.append('g')
		.attr('class', 'linkGroup')
		.attr("stroke", "orange").attr("stroke-width", 1)
		.selectAll('.link');

	let node = svg
		.append('g')
		.attr('class', 'nodeGroup')
		.attr("stroke", "blue").attr("stroke-width", 1)
		.selectAll('.node');

	let div = d3.select('body').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);


	restart();

	function restart() {

		if (links.length === 0) {
			links.push(
				{source: "startPoint", target: "Oceanen"},
				{source: "startPoint", target: "Antarctica"},
				{source: "startPoint", target: "Eurazië"},
				{source: "startPoint", target: "Amerika"},
				{source: "startPoint", target: "Azië"},
				{source: "startPoint", target: "Afrika"},
				{source: "startPoint", target: "Oceanië"}
			)
		}

		let dataqty = nodes.map(item => { return item.qty });
		let radiusScale = d3.scaleSqrt().domain([d3.min(dataqty), d3.max(dataqty)]).range([1, 10]);
		let tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		node = node.data(nodes, function(d) { return d.geoName });
		node.exit().remove();
		node = node.enter().append('circle')
			.attr('r', function(d) {
				if (d.geoName === 'startPoint') { return 5 }
				else { return 20
					//return radiusScale(d.qty)
					}
			})
			.attr('fill', function (d) {
				return changeColorOnQtyCircle(d.qty)
			})
			.on('click', function(d) {
				if ( d.geoName === 'startPoint' ) { return }
				else if( d.clicked === true ) {
					removeLinks(d)
					d.clicked = false
				}
				else {
					addChildrenNodes(d) }
			})
			.on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip	.html(d.geoName + "<br/>"  + d.qty)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			})
			.merge(node);

		link = link.data(links);
		link.exit().remove();
		link = link.enter().append("line").merge(link);
// merging local variable link with array, with the global variable link array, so creating 1 array.

		simulation.nodes(nodes)
		simulation.force("link", d3.forceLink(links).id(function(d) { return d.geoName }).distance(100).strength(1));
		simulation.force("charge", d3.forceManyBody().strength(-30))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.alphaTarget(1)
			.on("tick", ticked);

	}

	function removeLinks(x) {
		let result = [];
		x.children.map(item => { result.push(item.geoName) });

		//node filter part is buggy
		node
			.data(nodes.filter(function (eachNode) {
				return eachNode !== function() {result.forEach(item => {return item})}
				}))

			.exit().remove();

		link
			.data(links.filter(function(linkies) {
				return linkies.source.geoName !== x.geoName}))
			.exit().remove();
		restart()
	}


	function addChildrenNodes(data) {
		if (data.children.length === 0) {
			console.log('no children');
			return
		} else {
			data.clicked = true;
			let parent = data;

			let childNodes = data.children.forEach(item => {
				nodes.push(item);
				links.push({source: parent, target: item});
			});

			restart()
		}
	}



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

	//reset function
	document.getElementById('reset').onclick = function () {
		nodes = [dataComplete];
		dataComplete.children[0].map(item => { nodes.push((item)) });

		links = [];
		links.push(
			{source: "startPoint", target: "Oceanen"},
			{source: "startPoint", target: "Antarctica"},
			{source: "startPoint", target: "Eurazië"},
			{source: "startPoint", target: "Amerika"},
			{source: "startPoint", target: "Azië"},
			{source: "startPoint", target: "Afrika"},
			{source: "startPoint", target: "Oceanië"}
			)

		restart()
	}

}
