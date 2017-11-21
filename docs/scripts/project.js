'use strict';

const project = {};
project.data = [];
d3.csv("data/final_data.csv", function (data) {
    /** Called when any event has changed the year_value to move the cursor
     * and change the year_box accordingly
     */
    for(let i_year = data[0].Year;i_year<data[data.length-1].Year;i_year++ ){
        let temp = data.filter(x => x.Year === i_year.toString());
        temp.forEach(function(v){ delete v.Year });
        project.data.push(temp);
    }

    project.update_cursor = function (evt) {
        if (mouse.mouse_down) {
            let x = helpers.relative_x(evt.clientX) - mouse.mouse_adjustement;
            let new_x = helpers.clamp(cursor.round_cursor(x), margins.left, margins.left + width);
            cursor.timeline_cursor.attr("x", new_x);
            box.update_year_box(box.year_box);
            country_graph.update_graph();
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

    d3.csv("data/test1985.csv", function (d) {
        d.forEach(function(v){ delete v.Year });
        console.log(d);
        console.log(project.data);
        console.log(project.flows_for_countrycode(['ET']));
        //console.log(project.delta_for_countrycode(['ET']));
    });

});
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
project.filter_country_inout = function(countrys, year_data){
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
project.filter_country = function(origins, asylums, year_data){

    let flows = {};
    function is_origin(row){
        return origins.includes(row.country_origin);
    }
    function is_asylum_not_origin(row){
        return asylums.includes(row.country_asylum) && !is_origin(row);
    }
    flows.outflows = year_data.filter(is_origin);
    flows.inflows = year_data.filter(is_asylum_not_origin);

    function remove_origin_asylum(data){
        data.forEach(function(v){
            delete v.country_origin;
            delete v.country_asylum;
        });
    }
    remove_origin_asylum(flows.outflows);
    remove_origin_asylum(flows.inflows);
    return flows;
};

project.flows_for_countrycode = function(countrys){
    let year = timevals.rel_to_year(cursor.get_relative_cursor_x());
    let year_data = project.data[year - timevals.min_year];
    return project.filter_country_inout(countrys, year_data)
};

/*project.delta_for_countrycode = function(countrys){
    function sum_values(rows){
        let sum  = rows.reduce(function(acc, row) {
            console.log(row.value);
            return accumulator + row.Value;
        }, 0);
        return sum;
    }
    let flows = project.flows_for_countrycode(countrys);
    console.log('flows');
    console.log(flows);
    console.log('inflows');
    let sum_inflows = sum_values(flows.inflows);
    console.log('sum_inflows');
    console.log(sum_inflows);
    console.log('outflows');
    let sum_outflows = sum_values(flows.outflows);
    console.log('sum_outflows');
    console.log(sum_outflows);
    return sum_inflows - sum_outflows;
};*/
