/** Representation of a cell on the game board. The red, green, blue, and yellow properties of the cell represent the position of the cell
from the red, green, blue and yellow houses respectively */
const Cell = {
    new: (red = 0, green = 0, blue = 0, yellow = 0) => ({
        red: red,
        green: green,
        blue: blue,
        yellow: yellow
    })
}