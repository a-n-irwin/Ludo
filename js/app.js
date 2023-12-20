// The areas of the gameboard where the cells will be generated
const topCellContainer = document.getElementById('top');
const leftCellContainer = document.getElementById('left');
const rightCellContainer = document.getElementById('right');
const bottomCellContainer = document.getElementById('bottom');


const allSeeds = document.querySelectorAll('.seed');
let allCells;


const Seed = {
    new: () => ({
        element: null,
        color: null,
        state: null,
        cellId: 0,
        active: false
    })
}



/** The seed dragged or selected depending on the control scheme being used */
const seed = Seed.new();


/** Implements rotational turns */
const playerTurns = {
    // The id of the current player to make a move
    playerId: 1,
    // Shift the turn to he next player
    next: () => {
        return (playerTurns.playerId = playerTurns.playerId < options.players ? playerTurns.playerId + 1 : 1);
    }
}


/** Represents a pair of dice which hasn't been tossed yet. */
const dice = {
    // Should not be 0 (zero) because of the logic in isValidMove() and hasValidMoves() functions
    EMPTY_DIE: Number.MAX_SAFE_INTEGER,
    0: Number.MAX_SAFE_INTEGER,
    1: Number.MAX_SAFE_INTEGER,
    // To Remember the values of the dice(0 and 1) in case they are modified before another roll
    face1: Number.MAX_SAFE_INTEGER,
    face2: Number.MAX_SAFE_INTEGER,

    /** Checks if both faces of the dice equal dice.EMPTY_DIE */
    empty: () => {
        return dice[0] === dice.EMPTY_DIE && dice[1] === dice.EMPTY_DIE;
    },

    /** Checks if at least one face of the dice equals dice.EMPTY_DIE */
    hasOneEmpty: () => {
        return dice[0] === dice.EMPTY_DIE || dice[1] === dice.EMPTY_DIE;
    },

    /** Checks if the dice contains a 6 */
    hasSix: () => {
        return dice[0] === 6 || dice[1] === 6;
    },

    doubleSix: () => {
        return dice.face1 === 6 && dice.face2 === 6;
    },

    /** Returns the minimum face of the dice */
    min: () => {
        return Math.min(dice[0], dice[1]);
    },

    reset: () => {
        dice.face1 = dice.face2 = dice[0] = dice[1] = dice.EMPTY_DIE;
    },

    /** Sets the die values back to the last outcome */
    revert: () => {
        dice[0] = dice.face1;
        dice[1] = dice.face2;
    },

    /** In the case where the dice value is dice.EMPTY_DIE it returns 0 instead, otherwise it simply returns the face value of the die*/
    number: (face = 0) => face === dice.EMPTY_DIE ? 0 : face,

    /** Returns the sum of dice value that is left to be played */
    outstanding: () => dice.number(dice[0]) + dice.number(dice[1])
}


// For displaying gameplay hints
function message(text) {
    showDialogBox({
        title: 'Hint',
        content: text
    });
}

/** Initializes the game and sets up the gameboard. */
function init() {
    createGameBoard();
    // Assign player turns or designations to the seeds
    allSeeds.forEach(seed => {
        const color = seed.classList.item(1);
        seed.setAttribute('player-id', options.playerId[color]);
        seed.setAttribute('state', 'in-house');
    });
    // show the game when the game board has been made
    main.style.visibility = 'visible';

    return true;
};



function createGameBoard() {
    // Create top cells
    createCells(
        topCellContainer,
        [Cell.new(24, 37, 11, 50), Cell.new(25, 38, 12, 51), Cell.new(26, 39, 13, 0)],
        'yellow'
    );

    // Create left cells
    createCells(
        leftCellContainer,
        [Cell.new(11, 24, 50, 37), Cell.new(12, 25, 51, 38), Cell.new(13, 26, 0, 39)],
        'blue'
    );

    // Create right cells
    createCells(
        rightCellContainer,
        [Cell.new(37, 50, 24, 11), Cell.new(38, 51, 25, 12), Cell.new(39, 0, 26, 13)],
        'green'
    );

    // Create bottom cells
    createCells(
        bottomCellContainer,
        [Cell.new(50, 11, 37, 24), Cell.new(51, 12, 38, 25), Cell.new(0, 13, 39, 26)],
        'red'
    );

    // Give functionality to the objects on the game board so they are interactable
    addGameBoardEventListeners();
    addSeeds();
}


function createCells(cellContainer, startCells, specialColor) {
    // There are 6 rows per cell container
    for (let i = 0; i < 6; ++i) {
        const divs = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

        for (let j = 0; j < divs.length; ++j) {
            // Direction indicates whether the current cell should have a decreasing or increasing color value
            const direction = j !== 0 ? 1 : -1;
            const [div, cell] = [divs[j], startCells[j]];

            div.classList.add('cell', 'cell-square');

            for (let color in cell) {
                // The middle cells (j = 1) of colored cell rows (i > 0) are only reachabe for seeds of that same color
                div.setAttribute(color, i > 0 && j === 1 && color !== specialColor ? 0 : cell[color] + direction * i);
            }

            // Add this cell to the container
            cellContainer.append(div);
        }
    }
}


function addGameBoardEventListeners() {
    document.querySelector('.home').addEventListener('click', rollDice);

    allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.addEventListener('dblclick', onCellDoubleClick);
    });

    if (options.controlScheme === 'drag-and-drop')
        addDragAndDropEventListerners();
    else if (options.controlScheme === 'touch')
        addTouchEventListerners();
}

// Drag-and-drop control scheme

function addDragAndDropEventListerners() {
    // The styling to use
    setStyleForSelectedSeed = setStyleForDraggedSeed;
    removeStyleForSelectedSeed = removeStyleForDraggedSeed;

    // Handles what happens when seeds are dragged
    allSeeds.forEach(seed => {
        seed.setAttribute('draggable', 'true');
        seed.addEventListener('dragstart', onSeedDragStart);
        seed.addEventListener('dragend', onSeedDragEnd);
        seed.style.cursor = 'move';
    });

    // Handles what happens when a draggable object is dragged over the cell and dropped on it
    allCells?.forEach(cell => {
        cell.addEventListener('dragover', onCellDragOver);
        cell.addEventListener('drop', onCellDragDrop);
    });
}

function removeDragAndDropScheme() {
    removeStyleForSelectedSeed = setStyleForSelectedSeed = null

    allSeeds.forEach(seed => {
        seed.removeEventListener('dragstart', onSeedDragStart);
        seed.removeEventListener('dragend', onSeedDragEnd);
        seed.setAttribute('draggable', 'false');
        seed.style.cursor = 'default';
    });

    allCells?.forEach(cell => {
        cell.removeEventListener('dragover', onCellDragOver);
        cell.removeEventListener('drop', onCellDragDrop);
    });
}


// Touch control scheme

function addTouchEventListerners() {
    setStyleForSelectedSeed = setStyleForClickedSeed;
    removeStyleForSelectedSeed = removeStyleForClickedSeed;

    // Event handlers for clicking on seeds
    allSeeds.forEach(seed => {
        seed.addEventListener('click', onSeedClick);
        seed.style.cursor = 'pointer';
    });

    // Event handlers for clicking on cells
    allCells?.forEach(cell => {
        cell.addEventListener('click', onCellClick);
    });
}

function removeTouchScheme() {
    removeStyleForSelectedSeed = setStyleForSelectedSeed = null;

    // Event handlers for clicking on seeds
    allSeeds.forEach(seed => {
        seed.removeEventListener('click', onSeedClick);
        seed.style.cursor = 'default';
    });

    // Event handlers for clicking on cells
    allCells?.forEach(cell => {
        cell.removeEventListener('click', onCellClick);
    });
}


function addSeeds() {
    for (let color in options.playerId) {
        // Decide which seed colors will be playing
        if (options.playerId[color] !== 0) {
            // Select the seed container of that particular color
            document.querySelector(`#${color}-house .seed-container`).style.visibility = 'visible';
            document.getElementById(`outside-${color}-container`).style.visibility = 'visible';
        }
    }
}

// Will be assigned to the two below depending on which control scheme is being used
let setStyleForSelectedSeed = () => { }
let removeStyleForSelectedSeed = () => { }


// Scheme-specific styling for selected seeds
const setStyleForDraggedSeed = () => {
    seed.element.style.opacity = '0.001'
}

const setStyleForClickedSeed = () => {
    seed.element.style.borderWidth = '3px';
    seed.element.style.borderColor = 'white';
}

const removeStyleForDraggedSeed = () => {
    seed.element.style.opacity = '1'
}

const removeStyleForClickedSeed = () => {
    seed.element.style.borderWidth = '2px';
    seed.element.style.borderColor = 'rgb(53, 53, 53)';
}


///// Core gameplay logic below this point



function initSeed(element) {
    seed.element = element;
    seed.color = element.classList.item(1);
    seed.state = element.getAttribute('state');
    seed.cellId = Number(element.parentNode.getAttribute(seed.color));
    seed.active = true;
}

function disableSeed(seed) {
    seed.element.textContent = '';
    seed.element.style.cursor = 'default';
    seed.element.setAttribute('state', 'outside');
    seed.active = false;

    if (options.controlScheme === 'drag-and-drop') {
        seed.element.style.opacity = '1';
        seed.element.setAttribute('draggable', 'false');
        seed.element.removeEventListener('dragstart', onSeedSelection);
        seed.element.removeEventListener('dragend', onSeedDragEnd);
    } else if (options.controlScheme === 'touch') {
        seed.element.removeEventListener('click', onSeedClick);
    }
}


// What happens when the selection of the seed is un-done or after a valid move is made to a cell
function endSeedSelection() {
    if (seed.active) {
        removeStyleForSelectedSeed();

        const oldCell = seed.cellId !== 0 ? document.querySelector(`[${seed.color}="${seed.cellId}"]`) : null;
        const currentState = seed.element.getAttribute('state');

        // If the seed just left a cell and the cell still has seeds 
        if (oldCell && oldCell.lastChild) {
            // Let the players know how many seeds are left on the old cell
            oldCell.lastChild.textContent = oldCell.childElementCount > 1 ? oldCell.childElementCount : '';
        }

        // Let the players know how many seeds are now on the new cell
        seed.element.textContent = currentState === 'in-board' && seed.element.parentNode.childElementCount > 1 ? seed.element.parentNode.childElementCount : '';
        seed.active = false;
    }
}

// Scheme-specific (high-level) event handlers: called directly by event triggers

const onSeedDragStart = (event) => {
    initSeed(event.target);

    // So when the seed is dragged the number on it (if any) won't show
    seed.element.textContent = '';

    const cell = (seed.state === 'in-board') ? seed.element.parentNode : null;
    // When a seed is dragged from a cell containing at least 3 seeds we get to see how many seeds will be left on top of the seed just
    // beneath the one being dragged
    if (cell) {
        const seedBeneath = cell.childNodes.length > 2 ? cell.childNodes.item(cell.childNodes.length - 2) : null;
        console.log(seedBeneath);
        if (seedBeneath) {
            seedBeneath.textContent = cell.childNodes.length - 1;
        }
    }
    onSeedSelection();
}

const onSeedDragEnd = (event) => endSeedSelection();

const onCellDragOver = (event) => event.preventDefault();

// The seed will already be active when dragging it
const onCellDragDrop = (event) => {
    const cell = event.target.classList.contains('cell') ? event.target : event.target.parentNode;
    const cellId = Number(cell.getAttribute(seed.color));

    // Move the seed only if it wasn't dropped on the same cell
    if (cellId !== seed.cellId) onCellSelection(cell, cellId);
}


const onSeedClick = (event) => {
    // The seed just selected
    const currentSeed = event.target;
    const currentSeedState = currentSeed.getAttribute('state');
    const currentSeedId = currentSeed.getAttribute('id');
    const currentSeedColor = currentSeed.classList.item(1);
    const currentSeedCellId = Number(currentSeed.parentNode.getAttribute(currentSeedColor));

    // There's already an active seed but another is being clicked on
    // When one seed is active and another seed in-board is selected, that will be interpreted as making a move to that cell instead
    if (seed.active) {
        // If the same seed is selected
        if (seed.element.getAttribute('id') === currentSeedId)
            return endSeedSelection(seed);

        if (currentSeedState === 'in-house' || (currentSeedState === 'in-board' && seed.cellId === currentSeedCellId)) {
            // Deselect the current seed and select the new seed
            endSeedSelection();
            initSeed(currentSeed);
            onSeedSelection();
        }
    } else {
        initSeed(currentSeed);
        onSeedSelection();
    }
}

const onCellClick = (event) => {
    const cell = event.target.classList.contains('cell') ? event.target : event.target.parentNode;
    const cellId = Number(cell.getAttribute(seed.color));
    // Places a seed on the cell only if there is an active seed and the selected cell is not the same cell. Incidentally, the second 
    // condition ensures that when we select a seed that is in-board this event handler (which is inherited by all children of cells)
    // will not override the behaviour of the onSeedClick() event handler
    if (seed.active && cellId !== seed.cellId) {
        onCellSelection(cell, cellId);
        endSeedSelection();
    }
}


// Non-scheme-specific (low-level) event handlers: these guys are called by the scheme-specific handlers defined above rather than
// directly during event triggers

function onSeedSelection() {
    if (correctPlayerTurn()) {
        if (dice.empty()) {
            message('Roll the dice first.');
            endSeedSelection();
        }
        else if (!HasValidMoves(seed)) {
            message('No valid moves for this seed.');
            endSeedSelection();
        }
        // Valid selection
        else return setStyleForSelectedSeed();
    } else {
        message('Not your turn yet.');
        endSeedSelection();
    }
}


function onCellSelection(cell, cellId) {
    if (isValidMove(seed, cellId)) {
        if (cellId !== 57) {
            // If the cell is empty
            if (!cell.hasChildNodes()) cell.append(seed.element);
            else {
                // The most recent seed placed on the cell
                const targetSeed = cell.lastChild;
                const targetSeedColor = targetSeed.classList.item(1);
                const targetSeedPlayerId = targetSeed.getAttribute('player-id');
                // The player id of the dragged seed
                const playerId = seed.element.getAttribute('player-id');

                // If the seeds are associated with the same player
                if (targetSeedPlayerId === playerId) cell.append(seed.element);
                else {
                    const isLastSeed = document.querySelectorAll(`#gameboard [player-id="${playerTurns.playerId}"]`).length === 1;

                    // There is a die outstanding and the seed is not the last seed of the player and the player has no way of playing the outstanding die
                    if (!isLastSeed && dice.outstanding() && !currentPlayerHasValidMoves(seed.element.getAttribute('id'), dice.outstanding())) {
                        dice.revert();
                        return message('You can not play this move as you have no other way of completing the dice.');
                    }

                    seed.element.style.position = 'relative';

                    // Send the seed outside the board
                    let container = document.getElementById(`outside-${seed.color}-container`);
                    container.append(seed.element);

                    disableSeed(seed);

                    // Send the target back home
                    container = document.querySelector(`#${targetSeedColor}-house .seed-container`);
                    container.append(targetSeed);
                    targetSeed.textContent = '';
                    targetSeed.style.position = 'relative';
                    targetSeed.setAttribute('state', 'in-house');
                }
            }
            // When a seed enters the game
            if (seed.state === 'in-house') {
                seed.element.setAttribute('state', 'in-board');
                seed.element.style.position = 'absolute';
            }

            // Turns will only change as long as there's still a game to play
            if (!checkWin()) {
                if (dice.empty() && !dice.doubleSix()) changePlayerTurns();
            }
            else gameOver();

        } else {
            seed.element.style.position = 'relative';
            // Send the seed outside the board
            document.getElementById(`outside-${seed.color}-container`).append(seed.element);
            disableSeed(seed);
        }
    }
    else return message(`You can't go there`);
}


function onCellDoubleClick(event) {
    const cell = event.target.classList.contains('cell') ? event.target : event.target.parentNode;
    // If there's more than one seed on the cell, take the bottom seed (first child) and place it on top of the rest (last child)
    if (cell.childElementCount > 1) {
        const firstChild = cell.firstChild;

        firstChild.textContent = cell.childElementCount;

        cell.lastChild.textContent = '';
        cell.removeChild(firstChild);
        cell.append(firstChild);
    }
}


// Checks if a seed has a valid move or if it can play the die face given
function HasValidMoves(seed, die) {
    if (seed.state === 'in-house') return (!die ? dice.hasSix() : die === 6);
    else if (seed.state === 'in-board') {
        // Check if the minimum die face can be played from the cell the seed is on
        const cell = document.querySelector(`[${seed.color}="${seed.cellId + (!die ? dice.min() : die)}"`);
        return cell !== null;
    }

    return false;
}


// Checks through all the seeds of the current player to determine if there's a seed with a valid move or which can play the die passed
// Excludes the seed with an id value of excludesId if provided
function currentPlayerHasValidMoves(excludesId, die) {
    const allPlayerSeeds = [...document.querySelectorAll(`#gameboard [player-id="${playerTurns.playerId}"]`)];
    // The seed to look up
    const seed = Seed.new();

    return (
        allPlayerSeeds.some((element) => {
            if (element.getAttribute('id') !== excludesId) {
                seed.element = element;
                seed.color = element.classList.item(1);
                seed.state = element.getAttribute('state');
                seed.cellId = Number(element.parentNode.getAttribute(seed.color));
                return HasValidMoves(seed, die);
            }
        })
    );
}


function isValidMove(seed, cellId) {
    if (seed.state === 'in-board') {
        const distance = cellId - seed.cellId;
        // A seed in the game will play the first die, the second die, or both faces of the dice in one move
        return Boolean(
            ((distance === dice[0]) && (dice[0] = dice.EMPTY_DIE)) ||
            ((distance === dice[1]) && (dice[1] = dice.EMPTY_DIE)) ||
            ((distance === dice[0] + dice[1]) && (dice[0] = dice[1] = dice.EMPTY_DIE))
        );

    } else if (seed.state === 'in-house') {
        // A seed in-house either plays a 6 die to move in-board (whether from the first or second die) or plays a 6 die and the other die at once
        return Boolean(
            (cellId === 1 && ((dice[0] === 6 && (dice[0] = dice.EMPTY_DIE)) || (dice[1] === 6 && (dice[1] = dice.EMPTY_DIE)))) ||
            (cellId === 1 + (dice[0] === 6 ? dice[1] : dice[0]) && (dice[0] = dice[1] = dice.EMPTY_DIE))
        );
    }
    return false;
}


function rollDice() {
    // There's no seed selected and the last move has been played (both die faces are empty) 
    // The first condition is done to accommodate touch control scheme
    if (!seed.active) {
        if (dice.empty()) {
            dice.face1 = dice[0] = Math.floor(Math.random() * 6 + 1);
            dice.face2 = dice[1] = Math.floor(Math.random() * 6 + 1);
            // dice.face1 = dice[0] = 6;
            // dice.face2 = dice[1] = 1;

            console.log(`dice: ${dice[0]}, ${dice[1]}`);

            // Change turns if a player has no moves
            if (!currentPlayerHasValidMoves()) changePlayerTurns();
        }
        else message(`Player ${playerTurns.playerId} needs to complete the current dice -> ${dice.face1} ${dice.face2}.\nOutstanding dice -> ${dice.number(dice[0])} ${dice.number(dice[1])}`);
    }
}


function changePlayerTurns() {
    playerTurns.next();
    dice.reset();

    console.log(`turn: ${playerTurns.playerId}`);
}


const correctPlayerTurn = () => Number(seed.element.getAttribute('player-id')) === playerTurns.playerId;

// A player wins when any of theri seeds can't be found on the gameboard
const checkWin = () => document.querySelectorAll(`#gameboard [player-id="${playerTurns.playerId}"]`).length === 0;



function disableGameBoard() {
    document.querySelector('.home').removeEventListener('click', rollDice);

    (options.controlScheme === 'drag-and-drop') ? removeDragAndDropScheme() : removeTouchScheme();

    allCells?.forEach(cell => {
        cell.style.cursor = 'default';
    })
}


function gameOver() {
    showDialogBox({
        title: 'Game Over',
        content: `
            <div class="game-over-congratulations">Congratulations, player ${playerTurns.playerId}!</div>
            <br>To play again, click 'Start', or close the dialog to stop the game.
            <br><br><span class="winner">Winner:</span> Player ${playerTurns.playerId}`,
        yes: 'Start',
        callbackfns: {
            yes: startNewGame,
            close: disableGameBoard
        }
    });
}

function startNewGame() {
}


// Starts the app: called here so all script processing must have been done first
// init();