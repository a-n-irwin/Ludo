// Handle pausing the game
document.getElementById('pause-button').addEventListener('click', () => {
    showDialogBox({
        title: 'Paused Menu',
        content: 'The game has been paused',
    });
});

