let Map = {
    id: "#mapid",
    width_: width,
    height: 500,
    x: margins.left,
    y: margins.top,
    zoom: 2,
    max_zoom: 10,
    center: [38.338319, 18.466935]
};

    d3.select(Map.id)
        .style("height", Map.height)
        .style("width", Map.width_)
        .style("left", Map.x)
        .style("top", Map.y)
        .attr("class", "unfocusable");

    Map.interactive_map = L.map('mapid', {
        center: Map.center,
        zoom: Map.zoom,
        scrollWheelZoom: false
    });

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: Map.max_zoom,
    }).addTo(Map.interactive_map);

