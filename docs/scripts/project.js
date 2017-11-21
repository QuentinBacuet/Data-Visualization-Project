'use strict';

const project = {};
project.data = [];
project.countries = [];
d3.csv("data/final_data.csv", function (data) {
    d3.csv("data/data_immigration_entry.csv", function (data_immigration_entry) {
        d3.csv("data/data_immigration_exit.csv", function (data_immigration_exit) {
            d3.csv("data/data_immigration_delta.csv", function (data_immigration_delta) {
                /** Called when any event has changed the year_value to move the cursor
                 * and change the year_box accordingly
                 */
                project.data = [];
                project.data_immigration_delta = [];
                project.data_immigration_entry = data_immigration_entry;
                project.data_immigration_exit = data_immigration_exit;

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

    project.update_cursor = function (evt) {
        if (mouse.mouse_down) {
            let x = helpers.relative_x(evt.clientX) - mouse.mouse_adjustement;
            let new_x = helpers.clamp(cursor.round_cursor(x), margins.left, margins.left + width);
            cursor.timeline_cursor.attr("x", new_x);
            box.update_year_box(box.year_box);
            country_graph.update_graph();
            project.map.updateAnimators(project.get_flows());
        }
    };

                country_graph.update_graph();

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
        document.addEventListener("mousemove", project.update_cursor, false);
    }

    /* d3.csv("data/test1985.csv", function (d) {
         d.forEach(function(v){ delete v.Year });
         console.log(d);
         console.log('project data', project.data);
         project.set_countries(['ET']);
         console.log(project.get_flows());
         console.log(project.get_delta());
         project.set_countries(['AO']);
         console.log(project.get_flows());
     });*/

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
    return project.data_immigration_delta[year - timevals.min_year].filter(x => x.country === code_country)[0].value;
};



project.map = new Map();
project.map.init();
