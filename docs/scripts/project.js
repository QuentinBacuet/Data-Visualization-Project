'use strict';

const project = {};
project.data = [];
project.countries = [];

/** fetches all data and executes main code*/
d3.csv("data/flows.csv", function (data) {
    d3.csv("data/data_immigration_entry.csv", function (data_immigration_entry) {
        d3.csv("data/data_immigration_exit.csv", function (data_immigration_exit) {
            d3.csv("data/data_population_fraction.csv", function (data_immigration_delta) {
                d3.csv("data/countries_latlon.csv", (countries_latlon) =>{
                    project.data_countries_latlon = {};

                    countries_latlon.forEach(e =>{
                        project.data_countries_latlon[e.country] = L.latLng(e.latitude, e.longitude);
                    });
                });

                /* Initialise project variables*/
                project.data = [];
                project.data_immigration_delta = [];
                project.data_immigration_entry = data_immigration_entry;
                project.data_immigration_exit = data_immigration_exit;

                /* Copy data in project.data variable*/
                for (let i_year = data[0].year; i_year <= data[data.length - 1].year; i_year++) {
                    let temp_data = data.filter(x => x.year === i_year.toString());
                    temp_data.forEach(function (v) {
                        delete v.year
                    });
                    project.data.push(temp_data);
                    let temp_delta = data_immigration_delta.filter(x => x.year === i_year.toString());
                    temp_delta.forEach(function (v) {
                        delete v.year
                    });
                    project.data_immigration_delta.push(temp_delta);
                }

                /** callback for cursor movements*/
                project.moved_cursor = function (evt) {
                    if (mouse.mouse_down) {
                        let x = helpers.relative_x(evt.clientX);//e.mouse_adjustement);
                        let new_x = helpers.clamp(cursor.round_cursor(x*timevals.width/(window.innerWidth*
                            cst.left_div_width/100 * cst.timeline_width/100)), 0, timevals.width-2);

                        if (project.cursor_x !== new_x) {
                            project.update_cursor(new_x);
                            project.cursor_x = new_x;
                        }
                    }
                };

                /** propagate events to cursor and other objects*/
                project.update_cursor = function (x) {
                    cursor.timeline_cursor.attr("x", x);
                    box.update_year_box(box.year_box);
                    country_graph.update_graph_time();
                    project.map.updateAnimators(project.get_flows());
                    project.map.updateChloropleth();
                    project.history.update_year_index(timevals.rel_to_year(cursor.get_relative_cursor_x()));
                };

                country_graph.init();

                /** add listeners to every dynamic DOM element*/
                {
                    let t = document.getElementById("timeline");
                    let btnr = document.getElementById("btnR");
                    let btnl = document.getElementById("btnL");
                    let playbtn = document.getElementById("playBtn");
                    t.addEventListener("mousedown", mouse.down_mouse, false);
                    btnr.addEventListener("click", button.btnr_pressed, false);
                    btnl.addEventListener("click", button.btnl_pressed, false);
                    playbtn.addEventListener("click", play.play_clicked, false);
                    document.addEventListener("mouseup", mouse.up_mouse, false);
                    document.addEventListener("mousemove", project.moved_cursor, true);
                }

                project.map = new MapViz();
                project.map.init();

                project.history = new History();

            })
        })
    })
})
;
/**
 * @param countrys
 *      The countrys for which you want to know in/out-flows
 * @param year_data
 *      The data to filter. The data should already correspond to a fixed year
 * @returns {((float|float|float|float|int)[]|(float|float|float|float|int)[])[]}
 *          An object containing two arrays .inflows, .outflows. Each has the same structure:
 *          arr[i].longitude_origin
 *          arr[i].latitude_origin
 *          arr[i].longitude_asylum
 *          arr[i].latitude_asylum
 *          arr[i].value
 */
project.filter_country_inout = function (countrys, year_data) {
    return project.filter_country(countrys, countrys, year_data);
};

/**
 * @param origins
 *      The origin countrys you want to filter the flow with
 * @param asylums
 *      The asylum countrys you want to filter the flow with
 * @param year_data
 *      The data to filter. The data should already correspond to a fixed year
 * @returns {((float|float|float|float|int)[]|(float|float|float|float|int)[])[]}
 *          An object containing two arrays .inflows, .outflows. Each has the same structure:
 *          arr[i].longitude_origin
 *          arr[i].latitude_origin
 *          arr[i].longitude_asylum
 *          arr[i].latitude_asylum
 *          arr[i].value
 */
project.filter_country = function (origins, asylums, year_data) {

    let flows = {};

    function is_origin(row) {
        return origins.includes(row.country_origin);
    }

    function is_asylum_not_origin(row) {
        return asylums.includes(row.country_asylum) && !is_origin(row);
    }

    flows.outflows = year_data.filter(is_origin);
    flows.inflows = year_data.filter(is_asylum_not_origin);

    return flows;
};

/**
 * @param countries
 *      The countries for which you want to know the flows
 * @returns {((float|float|float|float|int)[]|(float|float|float|float|int)[])[]}
 *          see return of filter_country
 */
project.get_flows = function () {
    let year = timevals.rel_to_year(cursor.get_relative_cursor_x());
    let year_data = project.data[year - timevals.min_year];
    return project.filter_country_inout(project.countries, year_data)
};

/**
 * @param countrys
 *      The countries for which you want to know the delta flow
 * @returns {number}
 *      The delta flow
 */
project.get_delta = function () {
    function sum_values(rows) {
        return rows.reduce(function (acc, row) {
            return +(acc) + +(row.value);
        }, 0);
    }

    let flows = project.get_flows(project.countries);
    let sum_inflows = sum_values(flows.inflows);
    let sum_outflows = sum_values(flows.outflows);
    return sum_inflows - sum_outflows;
};

/** A basic setter for countries
 * @param countries
 *      the new value
 */
project.set_countries = function (countries) {
    project.countries = countries;
};

project.get_delta_for_code = function (code_country) {
    let year = timevals.rel_to_year(cursor.get_relative_cursor_x());
    let data_per_country = project.data_immigration_delta[year - timevals.min_year].filter(x => x.country === code_country);
    if (data_per_country.length === 1) {
        return data_per_country[0].per_million
    } else {
        return 0;
    }
};

/** Return the outflow for the given isocode*/
project.get_outflow_for_code = (isocode) =>{
    let year = timevals.rel_to_year(cursor.get_relative_cursor_x());
    let outflow =  project.data_immigration_exit.filter(x => x.country_origin === isocode && parseInt(x.year, 10) === year);

    return (outflow.length > 0) ? parseInt(outflow[0].value, 10).toFixed(0) : 0;
};

/** Return the inflow for the given isocode*/
project.get_inflow_for_code = (isocode) =>{
    let year = timevals.rel_to_year(cursor.get_relative_cursor_x());
    let inflow = project.data_immigration_entry.filter(x => x.country_asylum === isocode && parseInt(x.year, 10) === year);
    return (inflow.length > 0) ? parseInt(inflow[0].value, 10).toFixed(0) : 0;
};

/** Return the latitude and longitude for the given isocode*/
project.get_latlon_for_code = (isocode) => {
    return project.data_countries_latlon[isocode];
};
