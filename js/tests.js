// Independent

// Test if the values of the red, green, blue, and yellow attributes of the cells were generated correctly and the seed can thus move correctly

const gameboard = document.getElementById('gameboard');
if (gameboard) {

    gameboard.addEventListener('click', (e) => {
        testSeedMovement('blue');
    });
}

function testSeedMovement(color) {
    // Selects a seed from a particular house (red, green, blue or yellow)
    const seed = document.querySelector(`#${color}-house .seed`);

    let colorId = 1;

    const startCell = document.querySelector(`[${color}="${colorId}"]`);
    startCell.append(seed);

    // Move the seed across the subsequent cells
    setInterval(() => {
        colorId++;

        if (colorId > 56) return;
        document.querySelector(`[${color}="${colorId}"]`).append(seed);
    }, 300);
}