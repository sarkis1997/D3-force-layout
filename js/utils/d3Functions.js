import { changeColorOnQtyCircle, changeColorOnQtySidebar } from './changeColorOnQty.js';
import { createDataSet } from './fetchData.js';
import { makeQuery, URI, url_NMVW07 } from "./queries.js";

export async function createFramework() {
	let data = await createDataSet(url_NMVW07, makeQuery(URI));
	let dataComplete = [{geoName: 'startPoint', children: data, qty: 0}][0];
	let width = 1000;
	let height = 700;

	let nodes = [dataComplete];
	dataComplete.children[0].map(item => { nodes.push((item)) });
	let links = [];

	//calculating the total objects and setting its value to startpoint
	let objectsAmount = nodes.map(item => {return Number(item.qty)});
	let objectsSum = function (array) {
		return array.reduce(function (a, b) {
			return a + b;
		})
	};

	dataComplete.qty = objectsSum(objectsAmount);


	let simulation = d3.forceSimulation();

	let svg = d3.select('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'frame')

	let link = svg
		.append('g')
		.attr('class', 'linkGroup')
		.attr("stroke", "black").attr("stroke-width", 1)
		.selectAll('.link');

	let node = svg
		.append('g')
		.attr('class', 'nodeGroup')
		.attr("stroke", "black").attr("stroke-width", 1)
		.selectAll('.node');

	let tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

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

	//	let dataqty = nodes.map(item => { return item.qty });
	//	let radiusScale = d3.scaleSqrt().domain([d3.min(dataqty), d3.max(dataqty)]).range([1, 10]);

		node = node.data(nodes, function(d) { return d.geoName });
		node.exit().remove();
		node = node.enter()
			.append('circle')
			.attr('r', function(d) {
				if (d.geoName === 'startPoint') { return 5 }
				else if (d.qty <= 1000 ) { return 5 }
				else if (d.qty > 1000 && d.qty <= 50000) { return 10 }
				else if (d.qty > 50000 && d.qty <= 100000) { return 20 }
				else if (d.qty > 100000 && d.qty <= 300000) { return 30 }
				else if (d.qty >= 300000) { return 40 }

			})
			.attr('fill', function (d) {
				if (d.geoName === 'startPoint') {
					return 'orange'
				} else {
					return changeColorOnQtyCircle(d.qty)
				}
			})
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))
			.on('click', function(d) {
				if ( d.geoName === 'startPoint' ) { return }
				else {
					update(d)
				}
			})
			.on("mouseover", function(d) {
				tooltip
					.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip
					.html(d.geoName + "<br/>"  + d.qty)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 30) + "px");
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
			.velocityDecay(0.4)
			.force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
			.alphaTarget(1)
			.on("tick", ticked);

	}

	function update(x) {
		if (x.clicked === false) {
			x.clicked = true;
			addChildrenNodes(x)
		}
		else if (x.clicked === true) {
			x.clicked = false;

			nodes.forEach(function (d, i) {
				x.children.map(child => {
					if(d.geoName === child.geoName) {
						nodes.splice(i, x.children.length);
						links.splice(i, x.children.length);
					}
				});

				links.forEach(function (item, i) {
					if (links[i].hasOwnProperty('source') && links[i].source.geoName === x.geoName) {
						links.splice(i, 1)
					}
				});
			});

			node = node.data(nodes)
			node.exit().remove();
			node = node.enter()
				.append('circle')
				.attr('r', function(d) {
					if (d.geoName === 'startPoint') { return 5 }
					else if (d.qty <= 1000 ) { return 5 }
					else if (d.qty > 1000 && d.qty <= 50000) { return 10 }
					else if (d.qty > 50000 && d.qty <= 100000) { return 20 }
					else if (d.qty > 100000 && d.qty <= 300000) { return 30 }
					else if (d.qty >= 300000) { return 40 }

				})
				.attr('fill', function (d) {
					if (d.geoName === 'startPoint') {
						return 'orange'
					} else {
						return changeColorOnQtyCircle(d.qty)
					}
				})
				.on('click', function(d) {
					if ( d.geoName === 'startPoint' ) { return }
					else {
						update(d)
					}
				})
				.on("mouseover", function(d) {
					tooltip
						.transition()
						.duration(200)
						.style("opacity", .9);
					tooltip
						.html(d.geoName + "<br/>"  + d.qty)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px");
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
				//.force("center", d3.forceCenter(width / 2, height / 2))
				.alphaTarget(1)
				.on("tick", ticked);

		}
	}


	function addChildrenNodes(data) {
		if (data.children.length === 0) {
			alert("This geolocation doesn't have nested geolocations.");
			return
		} else {
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

	//dragged function from https://blockbuilder.org/almsuarez/851ed69e6b5b9cacaa4f5b1295a36ebe
	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	//reset function
	d3.select('#reset')
		.on('click', () => {
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
			);

		restart()
	})

}
