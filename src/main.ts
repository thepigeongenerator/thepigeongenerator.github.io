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
    const elmts = document.querySelectorAll(".generate-cards")
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i] as HTMLElement;
        if (elmt.dataset.filepath === undefined) {
            console.error("did not enter a file path to load");
            return;
        }

        generate_cards(elmt, elmt.dataset.filepath);
    }
}

main();
