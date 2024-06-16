function create_element_with_classes(element, classes) {
    const elmt = document.createElement(element);
    for (let i = 0; i < classes.length; i++) {
        elmt.classList.toggle(classes[i]);
    }
    return elmt;
}

function generate_cards(id, json_path) {
    $.getJSON(json_path, function (card_data) {
        const elmt = document.getElementById(id);

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

            const link = create_element_with_classes("a", ["btn", "btn-primary"]);
            link.innerText = card_data[i].link.text;
            link.href = card_data[i].link.href;

            //append the elements
            elmt.appendChild(card);
            card.appendChild(image);
            card.appendChild(card_body);
            card_body.appendChild(card_title);
            card_body.appendChild(card_text);
            card_body.appendChild(link);
        }
    });
}