'use strict';

let AnimationConstants = {
    offset_interval_size : 10,
    half_interval_size : 5,
    min_dot_size : 0.8,
    lnScale : 0.2, // Defines the scaling factor of the points with respect to the zoom level
    speed : 0.0001 // Defines the speed of the animated points on the map
};

class AnimatedPoint{
    constructor(travel_time){
        this.delta_t = Math.random() * travel_time;
        this.offset = (Math.random() * AnimationConstants.offset_interval_size) - AnimationConstants.half_interval_size;
    }
}

const dist_scale = 0.03;
class Animator{
    constructor(quantity, color_code, start_geopoint, end_geopoint){
        this.color_code = color_code;
        this.animated_points = [];
        this.start_geopoint = start_geopoint.slice(); // Slice just makes a copy
        this.end_geopoint = end_geopoint.slice(); // Slice just makes a copy
        this.travel_time = d3.geoDistance(start_geopoint.reverse(), end_geopoint.reverse()) / AnimationConstants.speed;
        //this.travel_time = 4000;
          /*TO CHANGE TO DISTANCE SCALE: uncomment const dist_scale, uncomment following lines
            comment the line before and uncomment this.travel_time = d3. etc.
            then change quantity in the for-loop to normalized quantity*/

        let dx = start_geopoint[0] - end_geopoint[0];

        let dy = start_geopoint[1] - end_geopoint[1];
        let dist = Math.sqrt(dx*dx + dy*dy);
        let normalized_quantity = quantity * dist_scale * dist;

        // Add points
        for(let i=0; i < normalized_quantity; i++){
            this.animated_points.push(new AnimatedPoint(this.travel_time))
        }
    }
}

Animator.outflowColor = "rgba(214,96,77, 1.0)";
Animator.inflowColor = "rgba(67,147,195, 1.0)";

// Canvas manipulation object
class MapLayer extends L.CanvasLayer {
    constructor(paneLabeltmp) {
        super();
        this.paneLabel = paneLabeltmp;
        this.animation_start_time = Date.now();
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

        let t = Date.now();

        /* Size refs are used to specify the dot size in pixels.
         * The farther the camera from the map, the smaller the dots.
         */
        let sizeRef1 = info.layer._map.latLngToContainerPoint([0.0,0.0]);
        let sizeRef2 = info.layer._map.latLngToContainerPoint([0.0, AnimationConstants.lnScale]);
        let dotRadius = sizeRef2.x - sizeRef1.x + AnimationConstants.min_dot_size;

        this.animators.forEach((animator) => {

            ctx.fillStyle = animator.color_code;

            let p1 = info.layer._map.latLngToContainerPoint(animator.start_geopoint);
            let p2 = info.layer._map.latLngToContainerPoint(animator.end_geopoint);

            let perp = [-p2.y + p1.y, p2.x-p1.x];
            let norm = Math.sqrt(perp[0] * perp[0] + perp[1] * perp[1]);

            perp = perp.map((v) => v/norm);

            let interpolate = helpers.LinearInterpolator2D(p1, p2);

            animator.animated_points.forEach((point) => {

                if (t - point.delta_t < this.animation_start_time){
                    return;
                } else {

                    let point_time = ((t - point.delta_t - this.animation_start_time) % animator.travel_time)
                        / animator.travel_time;

                    let dot = interpolate(point_time);

                    let offsetFactor = Math.sin(point_time * Math.PI) * dotRadius * point.offset;

                    ctx.beginPath();
                    ctx.arc(dot[0] + perp[0] * offsetFactor, dot[1] + perp[1] * offsetFactor, dotRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                }
            });
        })

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

        d3.json("data/world.geo.json", (data) => {
            let layer = L.geoJSON(data, {
                onEachFeature: Map.featureAction((e) => {
                    country_graph.update_new_graph(e.target.feature.properties.iso_a2)
                    this.updateAnimators(project.get_flows());
                })
            });
            layer.addTo(this.interactive_map);
            layer.bringToBack();
        });

        this.canvas = new MapLayer("CanvasLayer");
        this.canvas.animators = [new Animator(100, Animator.inflowColor, [27.360169, 2.837152], [48.859586, 2.340734]),
            new Animator(20, Animator.inflowColor, [38.797414, 35.200125], [48.859586, 2.340734]),
            new Animator(20,Animator.inflowColor, [51.992734, 19.710632], [48.859586, 2.340734]),
            new Animator(20, Animator.inflowColor, [35.478226, 37.980002], [48.859586, 2.340734]),
            new Animator(20,Animator.outflowColor, [48.859586, 2.340734], [35.478226, 37.980002]),
            new Animator(100, Animator.inflowColor, [51.825289, -176.539915], [48.859586, 2.340734])];
        this.canvas.animation_start_time = Date.now();
        this.canvas.addTo(this.interactive_map);

        setInterval(() => this.canvas.drawLayer(), 20);
    }

    updateAnimators(newData){
        this.canvas.animators.splice(0, this.canvas.animators.length);

        newData.outflows.forEach( d => {
            this.canvas.animators.push(new Animator(d.value, Animator.outflowColor, [d.latitude_origin, d.longitude_origin], [d.latitude_asylum, d.longitude_asylum]))
        })

        newData.inflows.forEach( d => {
            this.canvas.animators.push(new Animator(d.value, Animator.inflowColor, [d.latitude_origin, d.longitude_origin], [d.latitude_asylum, d.longitude_asylum]))
        })
    }

    static featureAction(f) {
        return (feature, layer) => {
            layer.on({
                click: f
            });
        }
    }

    static getChoroplethColor(d) {
        return  d > 1000 ? '#b2182b' :
                d > 500  ? '#ef8a62' :
                d > 200  ? '#fddbc7' :
                d > 100  ? '#f7f7f7' :
                d > 50   ? '#d1e5f0' :
                d > 20   ? '#67a9cf' :
                d > 10   ? '#2166ac' :
                '#000000';
    }

    static style(feature) {
        return {
            fillColor: Map.getChoroplethColor(project.get_delta()),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    static highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    static resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    static zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
}

