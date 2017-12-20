'use strict';

let AnimationConstants = {
    offset_interval_size: 7,
    half_interval_size: 5,
    min_dot_size: 0.8,
    lnScale: 0.2, // Defines the scaling factor of the points with respect to the zoom level
    speed: 0.0001 // Defines the speed of the animated points on the map
};

class AnimatedPoint {
    constructor(travel_time) {
        this.delta_t = Math.random() * travel_time;
        this.offset = (Math.random() * AnimationConstants.offset_interval_size) - AnimationConstants.half_interval_size;
    }
}

const dist_scale = 0.03;
const quantity_scale = 0.0005;

class Animator {
    constructor(quantity, color_code, start_geopoint, end_geopoint) {
        this.color_code = color_code;
        this.quantity = quantity;
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
        let dist = Math.sqrt(dx * dx + dy * dy);
        let normalized_quantity = quantity * quantity_scale * dist_scale * dist;

        // Add points
        for (let i = 0; i < normalized_quantity; i++) {
            this.animated_points.push(new AnimatedPoint(this.travel_time))
        }
    }
}

Animator.outflowColor = "#e61a2e";
Animator.inflowColor = "#2166ac";
Animator.textOutflowColor = "#b2182b";
Animator.textInflowColor = "#2166ac";

// Canvas manipulation object
class MapLayer extends L.CanvasLayer {
    constructor(paneLabeltmp) {
        super();
        this.animators = [];
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
        let sizeRef1 = info.layer._map.latLngToContainerPoint([0.0, 0.0]);
        let sizeRef2 = info.layer._map.latLngToContainerPoint([0.0, AnimationConstants.lnScale]);
        let dotRadius = sizeRef2.x - sizeRef1.x + AnimationConstants.min_dot_size;
        let textSize = 5 * dotRadius;
        ctx.font = ''.concat(textSize, 'px Verdana');

        this.animators.forEach((animator) => {

            ctx.fillStyle = animator.color_code;
            let p1 = info.layer._map.latLngToContainerPoint(animator.start_geopoint);

            let p2 = info.layer._map.latLngToContainerPoint(animator.end_geopoint);

            if (animator.color_code === Animator.outflowColor) {
                ctx.fillStyle = Animator.textOutflowColor;
                ctx.fillText(parseInt(animator.quantity, 10).toFixed(0), p2.x, p2.y + textSize);
            } else {
                ctx.fillStyle = Animator.textInflowColor;
                ctx.fillText(parseInt(animator.quantity, 10).toFixed(0), p1.x, p1.y);
            }

            ctx.fillStyle = animator.color_code;

            let perp = [-p2.y + p1.y, p2.x - p1.x];
            let norm = Math.sqrt(perp[0] * perp[0] + perp[1] * perp[1]);

            perp = perp.map((v) => v / norm);

            let interpolate = helpers.LinearInterpolator2D(p1, p2);

            animator.animated_points.forEach((point) => {

                if (t - point.delta_t < this.animation_start_time) {
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

class MapViz {
    constructor() {
        this.id = "#mapid";
        this.width_ = cst.left_div_width;
        this.height = cst.map_height;
        this.x = 0;
        this.y = 0;
        this.zoom = 2;
        this.max_zoom = 10;
        this.center = [38.338319, 18.466935];
        this.choroplethColors = ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'];
        this.quantiles = [-10000, -3000,  -1000,   -200, -10,    10,   200,   1000,  3000,  10000]
    }

    init() {
        // Make map unfocusable
        d3.select(this.id)
            .style("height", cst.map_height + "%")
            .style("width", this.width_ + "%")
            .style("float", "left")
            .style("position", "absolute")
            .attr("class", "unfocusable")
            .attr("display", "inline-block");

        // Add interactive Leaflet map to this. object
        this.interactive_map = L.map('mapid', {
            center: this.center,
            zoom: this.zoom,
            scrollWheelZoom: true
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
            this.geodata = data;
            this.geolayer = L.geoJSON(data, {
                style: (() => this.style())(),
                onEachFeature: this.featureAction((e) => {
                    country_graph.update_graph_new_country(e.target.feature.properties.iso_a2);
                    project.set_countries(e.target.feature.properties.iso_a2);
                    this.updateAnimators(project.get_flows());
                })
            });
            this.geolayer.addTo(this.interactive_map);
            this.geolayer.bringToBack();
        });

        this.canvas = new MapLayer("CanvasLayer");
        this.canvas.animation_start_time = Date.now();
        this.canvas.addTo(this.interactive_map);

        setInterval(() => this.canvas.drawLayer(), 20);

        // Add custom control to map
        this.info = L.control();
        this.info.onAdd = (map) => {
            this.control_div = L.DomUtil.create('info_graph', 'info');
            this.info.update();
            return this.control_div;
        };

        this.info.update = (isocode, name) => {

            let inflow = project.get_inflow_for_code(isocode);
            let outflow = project.get_outflow_for_code(isocode);

            this.control_div.innerHTML = '<h3>Worldwide refugee flux</h3>'.concat(
                '<b>', name ? name : '', '</b><br />',
                ' Inflow: ', name ? ''.concat(inflow, ' refugees') : '', '<br/>',
                ' Outflow: ', name ? ''.concat(outflow, ' refugees') : '');
        };

        this.info.addTo(this.interactive_map);

        this.legend = L.control({position:"bottomleft"});

        this.legend.onAdd = (map) => {

            this.legend_div = L.DomUtil.create('div', 'info legend');

            this.legend_div.innerHTML = "<h3>Refugees per <br/>million inhabitants</h3>";

            // loop through our density intervals and generate a label with a colored square for each interval
            for (let i = this.quantiles.length - 1; i >= 0; i--) {

                let currentQuantile = this.quantiles[i];
                let abs_v = 0;
                let v = 0;

                if (currentQuantile > 0){
                    v = this.quantiles[i] + 1;
                } else {
                    v = this.quantiles[i]-1
                }
                abs_v = Math.abs(v)

                this.legend_div.innerHTML +=
                    '<i style="background:' + this.getChoroplethColor(v) + '"></i> ' +
                    abs_v + ((currentQuantile > 0) ? '+' : '-') +'<br>';
            }

            return this.legend_div;
        };

        this.legend.addTo(this.interactive_map);

        this.description_shown = false;

        L.easyButton('fa fa-question-circle', (btn, map) => {
            if(this.description_shown === true){
                this.description.remove();
                this.description_shown = false;
            } else {
                this.description.addTo(this.interactive_map);
                this.description_shown = true;
            }
        }).addTo( this.interactive_map );

        this.description = L.control({position:"topleft"});

        this.description.onAdd = (map) => {
            this.description_div = L.DomUtil.create('div', 'info description');

            this.description_div.innerHTML =
                "<p>The worldwide refugee flux is a visualisation based on the UNHCR <br>" +
                "data available at <a href='https://www.kaggle.com/unitednations/refugee-data'>this adress</a>.</p>" +
                "<p>The choropleth map shows the net difference between refugees leaving the country and refugees coming in.</p> " +
                "<p>Click on a country to see its corresponding flow of refugees. Red and blue dots represent people respectively leaving and entering" +
                " the country. The numbers displayed on the map show the exact count of refugees while" +
                "the graph below shows the cumulative quantities for the selected country.</p>" +
                "<p>Clicking on the events on the right will display the corresponding geographical locations. Double-clicking " +
                "them will open the appropriate Wikipedia article.</p>";

            return this.description_div;
        };

    }

    updateChloropleth() {
        this.interactive_map.removeLayer(this.geolayer);

        //TODO change this to a replace data
        this.geolayer = L.geoJSON(this.geodata, {
            style: this.style(),
            onEachFeature: this.featureAction((e) => {
                country_graph.update_graph_new_country(e.target.feature.properties.iso_a2);
                project.set_countries(e.target.feature.properties.iso_a2);
                this.updateAnimators(project.get_flows());
            })
        });
        this.geolayer.addTo(this.interactive_map);
        this.geolayer.bringToBack();

    }

    updateAnimators(newData) {
        this.canvas.animators.splice(0, this.canvas.animators.length);

        newData.outflows.forEach(d => {
            this.canvas.animators.push(new Animator(d.value, Animator.outflowColor, [d.latitude_origin, d.longitude_origin], [d.latitude_asylum, d.longitude_asylum]))
        });

        newData.inflows.forEach(d => {
            this.canvas.animators.push(new Animator(d.value, Animator.inflowColor, [d.latitude_origin, d.longitude_origin], [d.latitude_asylum, d.longitude_asylum]))
        });
    }

    featureAction(f) {
        return (feature, layer) => {
            layer.on({
                click: f,
                dblclick: (e) => this.zoomToFeature(e),
                mouseover: (e) => this.highlightFeature(e),
                mouseout: this.resetHighlight()
            });
        }
    }

    getChoroplethColor(d) {

        let index = this.quantiles.findIndex((q) => q > d);

        if (index === -1){
            return this.choroplethColors[this.choroplethColors.length -1];
        } else {
            return this.choroplethColors[index];
        }
    }

    style() {
        return (feature) => {
            return {
                fillColor: this.getChoroplethColor(project.get_delta_for_code(feature.properties.iso_a2)),
                weight: 0.5,
                opacity: 0.4,
                color: 'lightgray',
                fillOpacity: 0.4
            };
        };
    }

    highlightFeature(e) {
        let layer = e.target;

        layer.setStyle({
            color: 'WhiteSmoke',
            weight: 1,
            fillOpacity: 0.8
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        this.info.update(layer.feature.properties.iso_a2, layer.feature.properties.name);
    }

    resetHighlight() {
        // Closure for capturing this object.
        return (e) => {
            this.geolayer.resetStyle(e.target);
            this.info.update();
        }
    }

    zoomToFeature(e) {
        this.interactive_map.fitBounds(e.target.getBounds());
    }

    focusOn(countrycode){
        this.interactive_map.flyTo(project.get_latlon_for_code(countrycode), 4);
    }
}

