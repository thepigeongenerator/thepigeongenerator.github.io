//entry-point of the application
function main() {
    // 1% to randomly load the page in light mode. just because ¯\_(ツ)_/¯
    if (Math.random() < 0.01) {
        const bodyElmt = document.getElementsByTagName("body")[0];
        bodyElmt.setAttribute("data-bs-theme", "light");
    }

    load_html();

    //execute qeffects
    execute_effects();
}

main();
