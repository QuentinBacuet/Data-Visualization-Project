'use strict';

const project = {};

d3.csv("data/final_data.csv", function (data) {
    /** Called when any event has changed the year_value to move the cursor
     * and change the year_box accordingly
     */
    project.data = [];

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
});