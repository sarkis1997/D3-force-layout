import { url_NMVW07, makeQuery, URI } from './utils/queries.js';
import { mapData } from './utils/fetchData.js';
import { createFramework } from './utils/d3Functions.js';

async function createViz(url, query) {
	createFramework(url, await mapData(url, query));

}

createViz(url_NMVW07, makeQuery(URI));

