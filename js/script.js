"use strict";
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
        const elmt = elmts[i];
        const file_path = elmt.dataset.filepath; // extract the file path from the dataset
        if (file_path == undefined) {
            console.error(`file_path was not set on element ${elmt}`);
            return;
        }
        // get the file at the file path
        fetch(file_path).then(response => response.text()) // get text
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
function create_element_with_classes(element, classes) {
    const elmt = document.createElement(element);
    for (let i = 0; i < classes.length; i++) {
        elmt.classList.toggle(classes[i]);
    }
    return elmt;
}
// generates cards (eg for projects)
function generate_cards(elmt, json_path) {
    fetch(json_path) // get the file at the json path
        .then(response => response.json()) // get the response in json format
        .then(card_data => {
        // create cards
        for (let i = 0; i < card_data.length; i++) {
            const card = create_element_with_classes("div", ["card"]);
            const image = create_element_with_classes("img", []);
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
                const link = create_element_with_classes("a", ["btn", "btn-sm", "btn-outline-primary", "m-1"]);
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
//entry-point of the application
function main() {
    // 1% to randomly load the page in light mode. just because ¯\_(ツ)_/¯
    if (Math.random() < 0.01) {
        const bodyElmt = document.getElementsByTagName("body")[0];
        bodyElmt.setAttribute("data-bs-theme", "light");
    }
    //execute qeffects
    execute_effects(null);
    // loads html (will call qeffects itself)
    load_html();
    // loads cards
    const elmts = document.querySelectorAll(".generate-cards");
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i];
        if (elmt.dataset.filepath === undefined) {
            console.error("did not enter a file path to load");
            return;
        }
        generate_cards(elmt, elmt.dataset.filepath);
    }
}
main();
//writes the string out, but first writes random characters.
function effect_typewriter(elmt) {
    const letterDelay = 30;
    const randomRepeatCount = 3;
    const text = elmt.innerText;
    elmt.innerText = Array(text.length).fill('\xa0').join(''); //set the text to spaces with the same length
    //loop through the characters and print a random one a few times before writing the correct one
    const loop_characters = (i = 0) => {
        //get a random (visible) character and set it at the current string position
        const loop_random_repeat = (j = 0) => {
            const charCode = Math.floor(Math.random() * (0x7F - 0x21) + 0x21);
            const char = String.fromCharCode(charCode);
            elmt.innerText = str_insert_at(elmt.innerText, i, char); //set the character at position i
            if (j < randomRepeatCount) {
                setTimeout(() => loop_random_repeat(j + 1), letterDelay);
            }
            else {
                setTimeout(() => {
                    elmt.innerText = str_insert_at(elmt.innerText, i, text.substring(i, i + 1)); //set the correct character
                    setTimeout(() => loop_characters(i + 1), letterDelay);
                }, letterDelay);
            }
        };
        if (i < text.length) {
            setTimeout(loop_random_repeat, letterDelay);
        }
    };
    //start the loop
    loop_characters();
}
//slowly fades in a linear gradient
function effect_radialgradient(elmt) {
    const speed = 255 * 20;
    for (let i = 0; i < 0xFF; i++) {
        setTimeout(() => {
            elmt.style.background = `radial-gradient(rgb(${i}, 0, ${i}), #000000)`;
            elmt.style.backgroundAttachment = "fixed"; //prevent the background from scrolling
        }, (speed / 0xFF) * i);
    }
}
//finds the elements with the different class names and execute the correct effect on them
function execute_effects(elmt) {
    // define the effects that exist
    const effects = {
        typewriter: effect_typewriter,
        radialgradient: effect_radialgradient
    };
    //apply effects
    for (let effect in effects) {
        //find the elements with the current effect
        const elements = (elmt === null) ?
            document.querySelectorAll(".qeffect-" + effect) :
            elmt.querySelectorAll(".qeffect-" + effect);
        //execute the associated effect function on these elements
        for (let i = 0; i < elements.length; i++) {
            effects[effect](elements[i]);
        }
    }
}
//inserts a string at a location in a string, returns the new string
function str_insert_at(str, index, insert) {
    return str.substring(0, index) + insert + str.substring(index + 1);
}
