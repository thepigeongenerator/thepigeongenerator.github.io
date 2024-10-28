//entry-point of the application
function main() {
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