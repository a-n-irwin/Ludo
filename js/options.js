// Gameplay configurations

// Default gameplay options
const options = {
    controlScheme: 'drag-and-drop',
    players: 2,
    playerId: {
        red: 1,
        green: 1,
        blue: 2,
        yellow: 2
    },
    houses: {
        count: 4,
        checked: 4,
    },
}


const isValidGameplayOptions = () => options.houses.checked % options.players === 0;

let houseColorCheckboxes;

/** Creates a menu for players to configure the gameplay*/
function showGameplayOptions() {
    // Gameplay options
    showDialogBox({
        title: 'Gameplay Options',
        // The HTML for the gameplay options
        content: gameplayOptionsHTML,
        yes: 'Done',
        callbackfns: {
            yes: () => {
                // Initializes the game if the player made valid option choices
                if (isValidGameplayOptions()) {
                    updatePlayerIds();
                    return init();
                }
                else {
                    // Let the user know somehow that the options they made were invalid...
                }
            },
            // When the options menu closes, it will initialize the game board, which will essentially start the game
            close: () => {
                setDefaultGameplayOptions();
                init();
            }
        }
    });

    // The elements would have been created at this point so we can use them
    document.getElementById('control-scheme-select').addEventListener('blur', setControlScheme);
    document.getElementById('players-select').addEventListener('click', autoSetGameplayOptions);

    houseColorCheckboxes = document.querySelectorAll('.house-color');
    houseColorCheckboxes.forEach(color => {
        color.addEventListener('click', updateCheckedHouses);
    });
}


/** Creates an in-game settings or options menu */
function showGameSettingsMenu() {

}


function autoSetGameplayOptions(event) {
    options.players = Number(event.target.value)

    if (!isValidGameplayOptions()) {
        houseColorCheckboxes.forEach(checkbox => {
            if (options.players > options.houses.checked) {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    options.houses.checked++;
                }
            }
            else if (options.players < options.houses.checked) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    options.houses.checked--;
                }
            }
        });
    }
    return true;
}


function updatePlayerIds() {
    const housesPerPlayer = options.houses.checked / options.players;

    let count = 0;
    houseColorCheckboxes.forEach(checkbox => {
        // Only checked options will be given a player id
        if (checkbox.checked)
            options.playerId[checkbox.value] = Math.floor(count++ / housesPerPlayer) + 1;
        else
            options.playerId[checkbox.value] = 0;
    });
}


function setControlScheme(event) {
    options.controlScheme = event.target.value;
}


function updateCheckedHouses(event) {
    const checkbox = event.target;
    options.houses.checked += (checkbox.checked) ? 1 : -1;
}


function setDefaultGameplayOptions() {
    options.players = 2;
    options.houses.count = 4;
    options.houses.checked = 4;
    options.controlScheme = 'drag-and-drop'
    options.playerId.red = 1;
    options.playerId.green = 1;
    options.playerId.blue = 2;
    options.playerId.yellow = 2;

    return true;
}


