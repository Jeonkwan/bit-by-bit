/**
 * 01-Blinking-Heart
 * 
 * Paste this file into the 'JavaScript' tab at https://makecode.microbit.org/
 * 
 * Press Button A to toggle between big heart and small heart.
 * Press Button B to clear screen.
 */

let isBigHeart = true;

function toggleHeart() {
    isBigHeart = !isBigHeart;
    if (isBigHeart) {
        basic.showIcon(IconNames.Heart);
    } else {
        basic.showIcon(IconNames.SmallHeart);
    }
}

function clearDisplay() {
    basic.clearScreen();
}

// Event Listeners
input.onButtonPressed(Button.A, function () {
    toggleHeart();
});

input.onButtonPressed(Button.B, function () {
    clearDisplay();
});

// Default initial state
basic.showIcon(IconNames.Heart);
