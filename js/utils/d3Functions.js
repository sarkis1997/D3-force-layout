import { changeColorOnQtyCircle, changeColorOnQtySidebar } from './changeColorOnQty.js';
import { createDataSet } from './fetchData.js';
import { makeQuery, URI, url_NMVW07 } from "./queries.js";

export async function createFramework() {
	let data = await createDataSet(url_NMVW07, makeQuery(URI));

	console.log(data)
}