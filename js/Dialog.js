const main = document.querySelector('main');

// The div which covers the game area, hidden by default
const gameAreaCover = document.getElementById('game-area-cover');
const dialogSection = document.getElementById('dialog-section');

const dialog = document.querySelector('dialog');
const dialogTitle = document.querySelector('dialog-title');
const dialogContent = document.querySelector('dialog-content');

const closeButton = document.getElementById('dialog-close-button');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');

let callbackfns;


const DialogBoxParameter = {
    new: () => {
        return ({
            title: 'Dialog',
            content: 'Hello there!',
            // The button options for yes and no buttons
            yes: 'Yes',
            no: 'No',
            // Functions associated with a particular button
            // It is required that the callback names match the button options above
            callbackfns: {

            },
        });
    }
};

const defaultParameter = DialogBoxParameter.new();


// Makes sure all buttons on the dialog will execute the callbacks associated with them when they are clicked, if available
document.querySelectorAll('.dialog-button').forEach(button => {
    button.addEventListener('click', event => {
        // If the callback returns true
        if (callbackfns && callbackfns[event.target.value]?.call()) hideDialogBox();
    });
});


// Default close button behaviour
closeButton.addEventListener('click', () => {
    hideDialogBox();
});


function showDialogBox(params = defaultParameter, showCloseButton = true) {
    main.style.opacity = '0.5';
    // Show the game area cover so the players can't interact with the game
    gameAreaCover.style.display = 'block';

    // Setting button visibility
    closeButton.style.visibility = showCloseButton ? 'visible' : 'hidden';
    // If the buttons' callbacks exists this will ensure the button is visible to trigger the callback
    yesButton.style.display = params.callbackfns?.yes ? 'inline-block' : 'none';
    noButton.style.display = params.callbackfns?.no ? 'inline-block' : 'none';

    dialogTitle.textContent = params.title;
    dialogContent.innerHTML = params.content;

    // Whether to change the default button texts
    if (params.yes) yesButton.textContent = params.yes;
    if (params.no) noButton.textContent = params.no;

    callbackfns = params.callbackfns;

    // Show the dialog
    dialogSection.style.display = 'flex';
    dialog.style.display = 'block';
}



function hideDialogBox() {
    if (dialog.style.display !== 'none') {

        // Reset the button options
        yesButton.textContent = 'Yes';
        noButton.textContent = 'No';

        gameAreaCover.style.display = dialogSection.style.display = dialog.style.display = 'none';
        main.style.opacity = 1;
    }
}

