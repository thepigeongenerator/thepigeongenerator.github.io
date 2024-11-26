//entry-point of the application
function main() {
    //execute qeffects
    execute_effects(null);

    // loads cards
    const elmts = document.querySelectorAll(".generate-cards")
    for (let i = 0; i < elmts.length; i++) {
        const elmt = elmts[i] as HTMLElement;
        if (elmt.dataset.filepath === undefined) {
            console.error("did not enter a file path to load");
            return;
        }
    }
}

main();
