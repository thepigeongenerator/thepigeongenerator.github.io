// replace the args in data, return result
function parse_data(data:string, args:Array<string>) {
    for (let i = 0; i < args.length; i++) {
        // replace the index surrounded by curly braces {0}, {1}, etc with the value in args
        data = data.replace("{" + i + "}", args[i]);
    }

    return data;
}

// loads html from an external file
function load_html() {
    // get all elements with the html tag to load in
    const elmts = document.querySelectorAll(".load-html");

    // loop through the elements
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i] as HTMLElement;
        const file_path = elmt.dataset.filepath; // extract the file path from the dataset

        if (file_path == undefined) {
            console.error(`file_path was not set on element ${elmt}`);
            return;
        }

        // get the file at the file path
        fetch(file_path).then(
            response => response.text()) // get text
            .then(data => {

                // parse the html using the arguments if args is defined
                if (elmt.dataset.args !== undefined) {
                    data = parse_data(data, elmt.dataset.args.split(",")); // get the arguments seperated by ,
                }

                elmt.innerHTML += data; // write the responce in the innerHtml
                execute_effects(elmt);
            });
    }
}

// creates an element with classess
function create_element_with_classes(element:string, classes: Array<string>) {
    const elmt = document.createElement(element);
    for (let i = 0; i < classes.length; i++) {
        elmt.classList.toggle(classes[i]);
    }

    return elmt;
}

// generates cards (eg for projects)
function generate_cards(elmt: HTMLElement, json_path: string) {
    fetch(json_path) // get the file at the json path
        .then(response => response.json()) // get the response in json format
        .then(card_data => {
            // create cards
            for (let i = 0; i < card_data.length; i++) {
                const card = create_element_with_classes("div", ["card"]);

                const image = create_element_with_classes("img", []) as HTMLImageElement;
                image.src = card_data[i].image;
                image.alt = `${card_data[i].title} image`;

                const card_body = create_element_with_classes("div", ["card-body"]);
                const card_title = create_element_with_classes("h5", ["card-title"]);
                card_title.innerText = card_data[i].title;

                const card_text = create_element_with_classes("p", ["card-text"]);
                card_text.innerText = card_data[i].body;

                const link_container = create_element_with_classes("div", ["card-links"]);
                const links = [];

                for (let j = 0; j < card_data[i].links.length; j++) {
                    const link = create_element_with_classes("a", ["btn", "btn-sm", "btn-outline-primary", "m-1"]) as HTMLLinkElement;
                    link.innerText = card_data[i].links[j].text;
                    link.href = card_data[i].links[j].href;
                    link.target = "_blank"; // make the link open in a new tab
                    link.rel = "noopener noreferrer";
                    links.push(link); // add to the end of the array
                }

                //append the elements
                elmt.appendChild(card);
                card.appendChild(image);
                card.appendChild(card_body);
                card_body.appendChild(card_title);
                card_body.appendChild(card_text);
                card_body.appendChild(link_container);

                for (let j = 0; j < links.length; j++)
                    link_container.appendChild(links[j]);
            }
        });
}
