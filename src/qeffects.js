//global definition of all the effects
const effects = {
    typewriter: effect_typewriter,
    radialgradient: effect_radialgradient
};

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
                }, letterDelay)
            }
        }

        if (i < text.length) {
            setTimeout(loop_random_repeat, letterDelay)
        }
    }

    //start the loop
    loop_characters();
}

//slowly fades in a linear gradient
function effect_radialgradient(elmt) {
    const speed = 255 * 20;

    for (let i = 0; i < 0xFF; i++) {
        setTimeout(() => {
            elmt.style.background = `radial-gradient(rgb(${i}, 0, ${i}), #000000)`;
        }, (speed / 0xFF) * i);
    }
}

//finds the elements with the different class names and execute the correct effect on them
function execute_effects() {
    //apply effects
    for (let effect in effects) {
        //find the elements with the current effect
        const elements = document.getElementsByClassName("qeffect-" + effect);
        //execute the associated effect function on these elements
        for (let i = 0; i < elements.length; i++) {
            effects[effect](elements[i]);
        }
    }
}