// Gameplay configurations

let controlScheme = 'drag-and-drop';
let numberOfPlayers = 2;
let numberOfHouses = 4;
let numberOfCheckedHouses = 4;
let playerId = { green: 1, blue: 1, red: 2, yellow: 2 };
let boardRotation = '0';

let checkboxes;


const isValidGameplayOptions = () => numberOfCheckedHouses % numberOfPlayers === 0;


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
                    setGameplayOptions()
                    init();
                    // So the dialog can close
                    return true;
                }
                else {
                    // Let the user know somehow that the options they made were invalid...
                    return false;
                }
            },
            // When the options menu closes, it will initialize the game board, which will essentially start the game
            close: () => {
                setDefaultGameplayOptions();
                init();
            }
        }
    });

    // The elements would have been created at this point, so they can be used

    document.getElementById('players-select').addEventListener('click', autoSetGameplayOptions);

    checkboxes = document.querySelectorAll('.house-color-checkbox');
    checkboxes.forEach(color => {
        color.addEventListener('click', updateCheckedHouses);
    });
}


function updateCheckedHouses(event) {
    const checkbox = event.target;
    numberOfCheckedHouses += (checkbox.checked) ? 1 : -1;

    console.log(numberOfCheckedHouses);
}


function autoSetGameplayOptions(event) {
    numberOfPlayers = Number(event.target.value);

    if (!isValidGameplayOptions()) {
        checkboxes.forEach(checkbox => {
            if (numberOfPlayers > numberOfCheckedHouses) {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    numberOfCheckedHouses++;
                }
            }
            else if (numberOfPlayers < numberOfCheckedHouses) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    numberOfCheckedHouses--;
                }
            }
        });
    }

    return true;
}


function setDefaultGameplayOptions() {
    controlScheme = 'drag-and-drop';
    numberOfPlayers = 2;
    numberOfHouses = 4;
    numberOfCheckedHouses = 4;
    playerId.green = 1;
    playerId.blue = 1;
    playerId.red = 2;
    playerId.yellow = 2;
    boardRotation = '0';

    return true;
}


function setControlScheme() {
    controlScheme = document.getElementById('control-scheme-select').value;
}


// Assigns seed colors to players by giving them player ids
function setPlayerIds() {
    const housesPerPlayer = numberOfCheckedHouses / numberOfPlayers;

    // If there are two players and 4 houses then manually assign player ids
    if (housesPerPlayer === 2) {
        playerId.green = playerId.blue = 1;
        playerId.red = playerId.yellow = 2;
    } else {
        // Find the checked house colors and give them player ids in the order of their occurrence
        let count = 0;

        checkboxes.forEach(checkbox => {
            // Only checked options will be given a player id
            if (checkbox.checked)
                playerId[checkbox.value] = Math.floor(count++ / housesPerPlayer) + 1;
            else
                playerId[checkbox.value] = 0;
        });
    }
    console.log(playerId);
}


function setGameBoardRotation() {
    const rotation = document.getElementById('board-rotation-select').value;
    document.getElementById('gameboard').style.transform = `rotate(${rotation}deg)`;

    // To keep the home image's rotation constant
    document.querySelector('#home img').style.transform = `rotate(${-rotation}deg)`;

    boardRotation = rotation;
}


function setGameplayOptions() {
    setControlScheme();
    setPlayerIds();
    setGameBoardRotation();
}


/** Creates an in-game settings or options menu */
function showGameSettingsMenu() {

}