// replace the args in data, return result
function parse_data(data, args) {
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
        const file_path = elmts[i].dataset.filepath; // extract the file path from the dataset
        const elmt = elmts[i];

        // get the file at the file path
        fetch(file_path).then(
            response => response.text()) // get text
            .then(data => {

                // parse the html using the arguments if args is defined
                if (elmt.dataset.args !== undefined) {
                    data = parse_data(data, elmt.dataset.args.split(",")); // get the arguments seperated by ,
                }

                elmt.innerHTML += data; // write the responce in the innerHtml
            });
    }
}

// creates an element with classess
function create_element_with_classes(element, classes) {
    const elmt = document.createElement(element);
    for (let i = 0; i < classes.length; i++) {
        elmt.classList.toggle(classes[i]);
    }
    return elmt;
}

// generates cards (eg for projects)
function generate_cards(id, json_path) {
    fetch(json_path) // get the file at the json path
        .then(response => response.json()) // get the response in json format
        .then(card_data => {
            // get the element with the given id
            const elmt = document.getElementById(id);

            // create cards
            for (let i = 0; i < card_data.length; i++) {
                const card = create_element_with_classes("div", ["card", "m-3"]);
                card.style.width = "18rem";

                const image = create_element_with_classes("img", ["card-img-top"]);
                image.src = card_data[i].image;
                image.alt = `${card_data[i].title} image`;

                const card_body = create_element_with_classes("div", ["card-body"]);
                const card_title = create_element_with_classes("h5", ["card-title"]);
                card_title.innerText = card_data[i].title;

                const card_text = create_element_with_classes("p", ["card-text"]);
                card_text.innerText = card_data[i].body;

                const links = [];
                for (let j = 0; j < card_data[i].links.length; j++) {
                    const link = create_element_with_classes("a", ["btn", "btn-sm", "btn-outline-primary", "m-1"]);
                    link.innerText = card_data[i].links[j].text;
                    link.href = card_data[i].links[j].href;
                    links.push(link); // add to the end of the array
                }

                //append the elements
                elmt.appendChild(card);
                card.appendChild(image);
                card.appendChild(card_body);
                card_body.appendChild(card_title);
                card_body.appendChild(card_text);

                for (let j = 0; j < links.length; j++)
                    card_body.appendChild(links[j]);
            }
        });
}
