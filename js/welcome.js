// // First time running the app
// if (localStorage.getItem('firstRu') === null) {
//     // So the player can't close the welcome dialog unitl they get to configure the game settings
//     showDialogBox({
//         title: 'Welcome!',
//         content: `Hello there! Welcome to Ludo Champions. Click the 'Help' button to learn how to play Ludo, or 'Play' to start playing.`,
//         yes: 'Help',
//         no: 'Play',
//         callbackfns: {
//             yes: () => {

//             },

//             no: () => showGameplayOptions()
//         }
//     }, false);

//     localStorage.setItem('firstRun', false);

// } else showGameplayOptions();

showGameplayOptions();

function displayLudoInstructions() {

}