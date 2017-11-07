console.log("Calling map.js")

d3.select("#mapid")
    .style("height", 500)
    .style("width", width)
    .style("left", margin.left)
    .style("top", margin.top);

let testMap = L.map('mapid', {
	center: [38.338319, 18.466935],
	zoom: 2,
	scrollWheelZoom:false
});

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 10
}).addTo(testMap);

