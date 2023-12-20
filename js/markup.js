// This script file is a buffer for all dynamically-generated markup

const gameplayOptionsHTML = `
    <section class="gameplay-options">
        <label for="control-scheme-select">Control Scheme:</label>
        <select id="control-scheme-select">
            <option value="drag-and-drop">Drag and drop</option>
            <option value="touch">Touch</option>
        </select>
    </section>
    <section class="gameplay-options">
        <label for="players-select">Players:</label>
        <select id="players-select">
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
            <input class="house-color" type="checkbox" name="houses" value="red" checked>Red
        </label>
        <label class="houses-label">
            <input class="house-color" type="checkbox" name="houses" value="green" checked>Green
        </label>
        <label class="houses-label">
            <input class="house-color" type="checkbox" name="houses" value="blue" checked>Blue
        </label>
        <label class="houses-label">
            <input class="house-color" type="checkbox" name="houses" value="yellow" checked>Yellow
        </label>
    </section>
`;