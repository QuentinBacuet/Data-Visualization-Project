
// Canvas manipulation object
let MapLayer = function(){

    this.interpolator_ = d3.geoInterpolate([49.0, 14.0], [0.0, 0.0]);

    this.onDrawLayer = function(info) {
        var ctx = info.canvas.getContext('2d');
        ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
        ctx.fillStyle = "rgba(255,165,0, 0.8)";
        let t = (Date.now() % 4000)/4000.0;

        dot = info.layer._map.latLngToContainerPoint(this.interpolator_(t));
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        console.log("Finish draw layer")
    }
}

// MapLayer inherits from L.CanvasLayer, ES5 style
MapLayer.prototype = new L.CanvasLayer();

// Encapsulate map attributes
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

// Make map unfocusable
d3.select(Map.id)
    .style("height", Map.height)
    .style("width", Map.width_)
    .style("left", Map.x)
    .style("top", Map.y)
    .attr("class", "unfocusable");

// Add interactive Leaflet map to Map object
Map.interactive_map = L.map('mapid', {
    center: Map.center,
    zoom: Map.zoom,
    scrollWheelZoom: false
});

// Add carto layer to map
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: Map.max_zoom,
}).addTo(Map.interactive_map);


function whenClicked(e) {
    country_graph.update_new_graph(e.target.feature.properties.iso_a2);

}
function onEachFeature(feature, layer) {
    layer.on({
        click: whenClicked
    });

}

d3.json("data/world.geo.json", function (data) {
    let layer = L.geoJSON(data, {
        onEachFeature: onEachFeature
    });
    layer.addTo(Map.interactive_map)
    layer.bringToBack();
});

const data = [
    [49.72015422,14.27402629,1  ],
    [49.66549949,14.29529302,2  ],
    [49.54634256,14.08849707,3  ],
    [49.78010369,14.19906883,4  ],
    [49.72015422,14.27402629,5  ],
    [49.63421271,13.94838986,6  ],
    [49.77532293,14.26745979,7  ],
    [49.62830954,14.18657097,8  ],
    [49.6176521,14.38976172,9  ],
    [49.57182912,14.53259733,10  ],
    [49.80750806,14.27987907,11  ],
    [49.58177169,14.2032834,12  ],
    [49.60774451,14.47812497,13  ],
    [49.67415889,13.95112806,14  ],
    [49.65551256,13.94388785,15  ],
    [49.70122451,14.30093723,16  ]];

let canvas = new MapLayer();
canvas.addTo(Map.interactive_map);


setInterval(() => canvas.drawLayer(), 20);