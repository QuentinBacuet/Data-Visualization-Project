'using strict';

class History{

    constructor(){

        this.year_index = initial_year;
        this.container = document.getElementById("div_events");
        d3.json("data/historical_events.json", (data) => {

            this.history_data = data;

            // Convert data types
            this.history_data.historical_events.forEach((event, index, array) =>{
                array[index].year_start = parseInt(array[index].year_start ,10);
                if(array[index].year_end === '-'){
                    array[index].year_end = "Today"
                } else {
                    array[index].year_end = parseInt(array[index].year_end, 10);
                }
            });

            this.redraw();

        })
    }

    init(){

    }

    update_year_index(year_index){
        this.year_index = year_index;
        this.redraw();
    }

    redraw(){
        // Clear the data
        this.container.innerHTML = '';

        let i = 0;

        this.history_data.historical_events.forEach((history_event) => {

           if (history_event.year_start <= this.year_index){
               if (history_event.year_end === "Today" || this.year_index <= history_event.year_end) {
                   this.add_button(history_event, i);
                   i = (i+1)%2;
               }
           }
        });
    }

    add_button(history_event, light){
        let button = document.createElement("button");
        button.innerHTML = '['.concat(history_event.year_start,
            ' - ',
            history_event.year_end,
            '] ',
            history_event.title);

        button.onclick = (target => {
            photo_gallery.addNewUrls(history_event.images);
            project.set_countries(history_event.country_code);
            project.map.updateAnimators(project.get_flows());
            project.map.focusOn(history_event.country_code);
            country_graph.update_graph_new_country(history_event.country_code);
        });

        button.ondblclick = target => window.open(history_event.link);

        this.container.appendChild(button);
        this.container.appendChild(document.createElement("br"));

        if (light === 1) {
            button.classList.add('button_history_event_light')
        } else {
            button.classList.add('button_history_event_dark')
        }
        button.classList.add('unfocusable')

    }
}