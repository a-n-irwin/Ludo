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

    /** In the case where the dice value is dice.EMPTY_DIE it returns 0 instead, 
     * otherwise it simply returns the face value of the die */
    number: (face = 0) => face === dice.EMPTY_DIE ? 0 : face,

    /** Returns the sum of dice value that is left to be played */
    outstanding: () => dice.number(dice[0]) + dice.number(dice[1])
}