let country_graph = svg.append("text")
    .attr("x", country_graph.x)
    .attr("y", country_graph.y)
    .attr("font-size", country_graph.size)
    .attr("class", "unfocusable no_pointer_event");

country_graph.update_graph();


/** Called when any event has changed the year_value to move the cursor
 * and change the year_box accordingly
 */
let update_cursor = function(evt) {
  if (mouse.mouse_down) {
    let x = helpers.relative_x(evt.clientX) - mouse.mouse_adjustement;
    let new_x = helpers.clamp(cursor.round_cursor(x), margins.left, margins.left + width);
    cursor.timeline_cursor.attr("x", new_x);
    box.update_year_box(box.year_box);
      country_graph.update_graph()
  }
};

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
  document.addEventListener("mousemove", update_cursor, false);
}
