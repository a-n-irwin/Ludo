// This script file is a buffer for all dynamically-generated markup

const gameplayOptionsHTML = `
    <form action="" method="" id="gameplay-options-form">
        <section class="gameplay-options">
            <label for="control-scheme-select">Control Scheme:</label>
            <select name="controlScheme" id="control-scheme-select">
                <option value="drag-and-drop">Drag and drop</option>
                <option value="touch">Touch</option>
            </select>
        </section>
        <section class="gameplay-options">
            <label for="players-select">Players:</label>
            <select name="players" id="players-select">
                <option value="2">Two Players</option>
                <option value="3">Three Players</option>
                <option value="4">Four Players</option>
            </select>
        </section>
        <br>
        <section class="gameplay-options">
            <fieldset>
                <legend>Houses</legend>
            </fieldset>
            <label class="houses-label">
                <input type="checkbox" name="houses" class="house-color-checkbox" value="green" checked>Green
            </label>
            <label class="houses-label">
                <input type="checkbox" name="houses" class="house-color-checkbox" value="red" checked>Red
            </label>
            <label class="houses-label">
                <input type="checkbox" name="houses" class="house-color-checkbox" value="blue" checked>Blue
            </label>
            <label class="houses-label">
                <input type="checkbox" name="houses" class="house-color-checkbox" value="yellow" checked>Yellow
            </label>
        </section>
        <br>
        <section class="gameplay-options">
            <label for="board-rotation-select">Board Rotation:</label>
            <select name="boardRotation" id="board-rotation-select" disabled>
                <option value="0">Default (Green)</option>
                <option value="90">90 degs (Yellow)</option>
                <option value="180">180 degs (Blue)</option>
                <option value="270">270 degs (Red)</option>
            </select>
        </section>
    </form>
`;
