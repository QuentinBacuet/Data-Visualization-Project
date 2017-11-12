'use strict';

// Canvas manipulation object
class MapLayer extends L.CanvasLayer {
    constructor(paneLabeltmp) {
        super();
        this.paneLabel = paneLabeltmp;
        this.interpolator_ = d3.geoInterpolate([49.0, 14.0], [0.0, 0.0]);
    }

    onAdd(map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        this.tiles = {};

        const size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        const animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        map._panes[this.paneLabel].appendChild(this._canvas);

        map.on(this.getEvents(), this);

        const del = this._delegate || this;
        del.onLayerDidMount && del.onLayerDidMount(); // -- callback
        this.needRedraw();
    };

    onRemove(map) {
        const del = this._delegate || this;
        del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

        map.getPanes()[this.paneLabel].removeChild(this._canvas);

        map.off(this.getEvents(), this);

        this._canvas = null;

    };

    onDrawLayer(info) {
        const ctx = info.canvas.getContext('2d');
        ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
        ctx.fillStyle = "rgba(255,165,0, 1.0)";
        let t = (Date.now() % 4000) / 4000.0;

        let dot = info.layer._map.latLngToContainerPoint(this.interpolator_(t));
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

class Map {
    constructor() {
        this.id = "#mapid";
        this.width_ = width;
        this.height = 500;
        this.x = margins.left;
        this.y = margins.top;
        this.zoom = 2;
        this.max_zoom = 10;
        this.center = [38.338319, 18.466935];
    }

    init() {
        // Make map unfocusable
        d3.select(this.id)
            .style("height", this.height)
            .style("width", this.width_)
            .style("left", this.x)
            .style("top", this.y)
            .attr("class", "unfocusable");

        // Add interactive Leaflet map to this. object
        this.interactive_map = L.map('mapid', {
            center: this.center,
            zoom: this.zoom,
            scrollWheelZoom: false
        });

        // Add carto layer to map
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: this.max_zoom,
        }).addTo(this.interactive_map);

        // Add a new pane
        this.interactive_map.createPane('CanvasLayer');
        this.interactive_map.getPane('CanvasLayer').style.zIndex = 1000;
        this.interactive_map.getPane('CanvasLayer').style.pointerEvents = 'none';

        d3.json("data/world.geo.json", function (data) {
            let layer = L.geoJSON(data, {
                onEachFeature: Map.featureAction((e) => country_graph.update_new_graph(e.target.feature.properties.iso_a2))
            });
            layer.addTo(map.interactive_map);
            layer.bringToBack();
        });
    }

    static featureAction(f) {
        return (feature, layer) => {
            layer.on({
                click: f
            });
        }
    }
}

const data = [
    [49.72015422, 14.27402629, 1],
    [49.66549949, 14.29529302, 2],
    [49.54634256, 14.08849707, 3],
    [49.78010369, 14.19906883, 4],
    [49.72015422, 14.27402629, 5],
    [49.63421271, 13.94838986, 6],
    [49.77532293, 14.26745979, 7],
    [49.62830954, 14.18657097, 8],
    [49.6176521, 14.38976172, 9],
    [49.57182912, 14.53259733, 10],
    [49.80750806, 14.27987907, 11],
    [49.58177169, 14.2032834, 12],
    [49.60774451, 14.47812497, 13],
    [49.67415889, 13.95112806, 14],
    [49.65551256, 13.94388785, 15],
    [49.70122451, 14.30093723, 16]];


let map = new Map();
map.init();

let canvas = new MapLayer("CanvasLayer");
canvas.addTo(map.interactive_map);

setInterval(() => canvas.drawLayer(), 20);