import { url_NMVW07, makeQuery, URI } from "./queries.js";

function fetchData(url, query) {
	return fetch(url+"?query="+ encodeURIComponent(query) +"&format=json")
		.then(response => response.json(response))
		.then(
			data => {
				return data.results.bindings;
			})
}

export function mapData(url, query) {
	return fetchData(url, query)
		.then(
			data => {
				return data.map(
					item => {
						let geoName = item.herkomstSuperLabel.value;
						let geoURI = item.herkomstSuper.value;
						let qty = item.choCount.value;
						let clicked= item.clicked;
						clicked = false;
						return {
							geoName,
							geoURI,
							qty,
							clicked
						}
					}
					)
			})
}

export async function createDataSet(url, query) {
	let dataset = [];

	await mapData(url, query)
		.then(
			data => {
				if (dataset == 0) {
					dataset.push(data)
					getChildren(data)
				}
			}
		)

	return dataset;
}

function getChildren(data) {
	data.map(item => {
		if (item.qty == 0) {;
			return
		}

		else if (item.qty > 0) {

			item.children = [];
			mapData(url_NMVW07, makeQuery(item.geoURI))
				.then(
					data => {
						data.map(
							x => item.children.push(x)
						)
						getChildren(data)
					})
		}
	})
}







