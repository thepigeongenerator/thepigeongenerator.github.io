"use strict";
function str_insert_at(str, index, insert) {
    return str.substring(0, index) + insert + str.substring(index + 1);
}
class Colour {
    constructor(packed) {
        this.packed = packed;
    }
    get r() { return (this.packed & 0xFF000000) >>> 24; }
    get g() { return (this.packed & 0x00FF0000) >>> 16; }
    get b() { return (this.packed & 0x0000FF00) >>> 8; }
    get a() { return (this.packed & 0x000000FF); }
    get packedvalue() { return this.packed; }
    static fromRGBA(r, g, b, a = 0xFF) {
        return new Colour(((r << 24) | (g << 16) | (b << 8) | a) >>> 0);
    }
    static fromCSS(value) {
        if (value.startsWith("var")) {
            const varname = value.replace(/[()]|(var)/g, "");
            const root = document.querySelector(':root');
            if (root === null)
                return new Colour(0);
            const style = getComputedStyle(root);
            value = style.getPropertyValue(varname);
        }
        let str = value.replace("#", "");
        if (str.length === 6)
            str += "FF";
        const packed = parseInt(str, 16) >>> 0;
        return new Colour(packed);
    }
    static lerp(a, b, t) {
        return Colour.fromRGBA(Math.floor(a.r + (b.r - a.r) * t), Math.floor(a.g + (b.g - a.g) * t), Math.floor(a.b + (b.b - a.b) * t), Math.floor(a.a + (b.a - a.a) * t));
    }
    toString() {
        return "#" + this.packed.toString(16).padStart(8, '0');
    }
}
function effect_typewriter(elmt) {
    const letterDelay = 30;
    const randomRepeatCount = 3;
    const text = elmt.innerText;
    elmt.innerText = Array(text.length).fill('\xa0').join('');
    const loop_characters = (i = 0) => {
        const loop_random_repeat = (j = 0) => {
            const charCode = Math.floor(Math.random() * (0x7F - 0x21) + 0x21);
            const char = String.fromCharCode(charCode);
            elmt.innerText = str_insert_at(elmt.innerText, i, char);
            if (j < randomRepeatCount) {
                setTimeout(() => loop_random_repeat(j + 1), letterDelay);
            }
            else {
                setTimeout(() => {
                    elmt.innerText = str_insert_at(elmt.innerText, i, text.substring(i, i + 1));
                    setTimeout(() => loop_characters(i + 1), letterDelay);
                }, letterDelay);
            }
        };
        if (i < text.length) {
            setTimeout(loop_random_repeat, letterDelay);
        }
    };
    loop_characters();
}
function effect_radialgradient(elmt) {
    var _a, _b;
    const foreground = Colour.fromCSS((_a = elmt.dataset.foreground) !== null && _a !== void 0 ? _a : "#00000000");
    const background = Colour.fromCSS((_b = elmt.dataset.background) !== null && _b !== void 0 ? _b : "#00000000");
    const speed = elmt.dataset.speed !== undefined ? parseInt(elmt.dataset.speed) : 1;
    let currForeground = background;
    elmt.style.backgroundAttachment = "fixed";
    const lerp_colours = () => {
        const set_style = () => elmt.style.background = `radial-gradient(${currForeground.toString()}, ${background.toString()})`;
        set_style();
        currForeground = Colour.lerp(currForeground, foreground, 0.01);
        if (foreground.packedvalue !== background.packedvalue)
            setTimeout(lerp_colours, speed);
        else
            set_style();
    };
    lerp_colours();
}
function execute_effects(elmt) {
    const effects = {
        typewriter: effect_typewriter,
        radialgradient: effect_radialgradient
    };
    for (let effect in effects) {
        const elements = (elmt === null) ?
            document.querySelectorAll(".qeffect-" + effect) :
            elmt.querySelectorAll(".qeffect-" + effect);
        for (let i = 0; i < elements.length; i++) {
            effects[effect](elements[i]);
        }
    }
}
function parse_data(data, args) {
    for (let i = 0; i < args.length; i++) {
        data = data.replace("{" + i + "}", args[i]);
    }
    return data;
}
function load_html() {
    const elmts = document.querySelectorAll(".load-html");
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i];
        const file_path = elmt.dataset.filepath;
        if (file_path == undefined) {
            console.error(`file_path was not set on element ${elmt}`);
            return;
        }
        fetch(file_path).then(response => response.text())
            .then(data => {
            if (elmt.dataset.args !== undefined) {
                data = parse_data(data, elmt.dataset.args.split(","));
            }
            elmt.innerHTML += data;
            execute_effects(elmt);
        });
    }
}
function create_element_with_classes(element, classes) {
    const elmt = document.createElement(element);
    for (let i = 0; i < classes.length; i++) {
        elmt.classList.toggle(classes[i]);
    }
    return elmt;
}
function generate_cards(elmt, json_path) {
    fetch(json_path)
        .then(response => response.json())
        .then(card_data => {
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
                const link = create_element_with_classes("a", ["button"]);
                link.innerText = card_data[i].links[j].text;
                link.href = card_data[i].links[j].href;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                links.push(link);
            }
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
function main() {
    execute_effects(null);
    load_html();
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
