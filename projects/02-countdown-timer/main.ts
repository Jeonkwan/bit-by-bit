/**
 * 02-Countdown-Timer
 * 
 * Microsoft MakeCode Static TypeScript for BBC micro:bit (V1 & V2 compatible).
 * Copy and paste this file into the 'JavaScript' tab at https://makecode.microbit.org/
 * 
 * Features:
 * - Boot & Idle Sequence:
 *   - Ascending greeting chime and rising hourglass logo on startup.
 *   - Starts at 0 minutes (no preset default).
 *   - While idle at 0m, displays a living animated sandglass (sand trickles down,
 *     then the sandglass rotates 180° and trickles again in a smooth loop).
 * - Gold Touch Logo (V2):
 *   - Tapping the gold logo above the LED matrix scrolls concise instructions:
 *     "PADS: +1m +5m +10m | A:START/PAUSE | B:RESET"
 *   - Touching any other input (Pad 0, 1, 2, Button A, Button B) or tapping the
 *     logo again immediately stops the instruction with zero delay.
 * - Capacitive Touch Pad Duration Increments:
 *   - Pad 0: Adds +1 Minute per tap (C4 confirmation tone)
 *   - Pad 1: Adds +5 Minutes per tap (G4 confirmation tone)
 *   - Pad 2: Adds +10 Minutes per tap (C5 confirmation tone)
 *   - Taps accumulate flexibly up to 99 minutes.
 * - Controls:
 *   - Button A: Play / Pause toggle. If 0m set, prompts user to tap pads.
 *   - Button B: Reset timer to 0m (returns to idle animated sandglass).
 * - Orbiting Edge Dot Activity Indicator:
 *   - >= 60s (Minutes mode): An edge dot orbits clockwise around the 16 perimeter
 *     LEDs every 200ms while running, and freezes in place when paused.
 *   - < 60s (Seconds mode): Edge dot turns OFF completely, keeping the screen
 *     clean for fast-changing second digits (59..10, 9..0).
 * - Alarm on Expiry:
 *   - Long-duration repeating alert sound (880Hz/1046Hz) and flashing animated
 *     target/diamond shapes when countdown hits 0.
 *   - Dismissal: Pressing Button A or Button B immediately silences the sound
 *     and resets to the idle animated sandglass.
 */

// --- State Variables ---
let totalSeconds = 0;       // Starts at 0m (user sets time via pads)
let remainingSeconds = 0;
let isRunning = false;
let isPaused = false;
let isAlarming = false;
let isShowingHelp = false;
let dotIndex = 0;
let subSecondTicks = 0;
let idleFrame = 0;
let alarmCycle = 0;

// 16 Perimeter Coordinates (Clockwise around border)
const PERIM_X: number[] = [0, 1, 2, 3, 4, 4, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0];
const PERIM_Y: number[] = [0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 4, 3, 2, 1];

// 2x5 Compact Bitmap Digits for 0-9 (two columns wide per digit)
const DIGITS_2X5: number[][] = [
    [3, 2, 2, 2, 3], // 0: ##, #., #., #., ##
    [1, 1, 1, 1, 1], // 1: .#, .#, .#, .#, .#
    [3, 1, 3, 2, 3], // 2: ##, .#, ##, #., ##
    [3, 1, 3, 1, 3], // 3: ##, .#, ##, .#, ##
    [2, 2, 3, 1, 1], // 4: #., #., ##, .#, .#
    [3, 2, 3, 1, 3], // 5: ##, #., ##, .#, ##
    [3, 2, 3, 3, 3], // 6: ##, #., ##, ##, ##
    [3, 1, 1, 1, 1], // 7: ##, .#, .#, .#, .#
    [3, 3, 3, 3, 3], // 8: ##, ##, ##, ##, ##
    [3, 3, 3, 1, 3], // 9: ##, ##, ##, .#, ##
];

// 3x5 Centered Bitmap Digits for 0-9 (three columns wide per digit)
const DIGITS_3X5: number[][] = [
    [7, 5, 5, 5, 7], // 0: ###, #.#, #.#, #.#, ###
    [2, 6, 2, 2, 7], // 1: .#., ##., .#., .#., ###
    [7, 1, 7, 4, 7], // 2: ###, ..#, ###, #.., ###
    [7, 1, 7, 1, 7], // 3: ###, ..#, ###, ..#, ###
    [5, 5, 7, 1, 1], // 4: #.#, #.#, ###, ..#, ..#
    [7, 4, 7, 1, 7], // 5: ###, #.., ###, ..#, ###
    [7, 4, 7, 5, 7], // 6: ###, #.., ###, #.#, ###
    [7, 1, 1, 1, 1], // 7: ###, ..#, ..#, ..#, ..#
    [7, 5, 7, 5, 7], // 8: ###, #.#, ###, #.#, ###
    [7, 5, 7, 1, 7], // 9: ###, #.#, ###, ..#, ###
];

// --- Boot Audio & Visuals ---
function playGreetingChime() {
    music.playTone(262, 100); // C4
    music.playTone(330, 100); // E4
    music.playTone(392, 100); // G4
    music.playTone(523, 200); // C5
}

function showRisingHourglass() {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        # # # # #
    `);
    basic.pause(70);
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        # # # # #
        . # # # .
    `);
    basic.pause(70);
    basic.showLeds(`
        . . . . .
        . . . . .
        # # # # #
        . # # # .
        . . # . .
    `);
    basic.pause(70);
    basic.showLeds(`
        . . . . .
        # # # # #
        . # # # .
        . . # . .
        . # # # .
    `);
    basic.pause(70);
    basic.showLeds(`
        # # # # #
        . # # # .
        . . # . .
        . # # # .
        # # # # #
    `);
    basic.pause(70);
}

// --- Idle Sandglass Animation (Trickling sand + 180° rotation loop) ---
function playHourglassStep() {
    if (isRunning || remainingSeconds > 0 || isAlarming || isShowingHelp) return;

    if (idleFrame === 0) {
        basic.showLeds(`
            # # # # #
            . # # # .
            . . # . .
            . . . . .
            # # # # #
        `);
    } else if (idleFrame === 1) {
        basic.showLeds(`
            # # # # #
            . # . # .
            . . # . .
            . . # . .
            # # # # #
        `);
    } else if (idleFrame === 2) {
        basic.showLeds(`
            . # # # .
            . # . # .
            . . # . .
            . . # . .
            # # # # #
        `);
    } else if (idleFrame === 3) {
        basic.showLeds(`
            . # # # .
            . . # . .
            . . # . .
            . # # # .
            # # # # #
        `);
    } else if (idleFrame === 4) {
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . # # # .
            # # # # #
        `);
    } else if (idleFrame === 5) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . # # # .
            # # # # #
        `);
    } else if (idleFrame === 6) {
        // Rotate 45°
        basic.showLeds(`
            . . # # #
            . . . # #
            . . # . #
            . # . . .
            # # . . .
        `);
    } else if (idleFrame === 7) {
        // Rotate 90° (horizontal)
        basic.showLeds(`
            # . . . #
            # # . # #
            # # # # #
            # # . # #
            # . . . #
        `);
    } else if (idleFrame === 8) {
        // Rotate 135°
        basic.showLeds(`
            # # . . .
            . # . . .
            . . # . #
            . . . # #
            . . # # #
        `);
    } else if (idleFrame === 9) {
        // Flipped 180° (top full again, ready for next trickle)
        basic.showLeds(`
            # # # # #
            . # # # .
            . . # . .
            . . . . .
            # # # # #
        `);
    }

    basic.pause(180);
    idleFrame = (idleFrame + 1) % 10;
}

// --- Help Instruction System ---
function stopHelp() {
    if (isShowingHelp) {
        isShowingHelp = false;
        basic.clearScreen();
    }
}

function showHelp() {
    if (isAlarming) {
        dismissAlarm();
        return;
    }

    if (isShowingHelp) {
        // Tapping logo while help is scrolling cancels it
        stopHelp();
        renderDisplay();
        return;
    }

    isShowingHelp = true;
    music.playTone(523, 100); // C5 chime for help

    const segments = [
        "PADS: +1m +5m +10m | ",
        "A:START/PAUSE | ",
        "B:RESET"
    ];

    for (let s = 0; s < segments.length; s++) {
        if (!isShowingHelp) break;
        basic.showString(segments[s], 100);
        if (!isShowingHelp) break;
        basic.pause(80);
    }

    isShowingHelp = false;
    renderDisplay();
}

// --- Display Rendering Functions ---
function drawDigit2x5(digit: number, startX: number) {
    if (digit < 0 || digit > 9) return;
    const pattern = DIGITS_2X5[digit];
    for (let y = 0; y < 5; y++) {
        const rowBits = pattern[y];
        if ((rowBits & 2) !== 0) {
            led.plot(startX, y);
        } else {
            led.unplot(startX, y);
        }
        if ((rowBits & 1) !== 0) {
            led.plot(startX + 1, y);
        } else {
            led.unplot(startX + 1, y);
        }
    }
}

function drawDigit3x5(digit: number) {
    if (digit < 0 || digit > 9) return;
    const pattern = DIGITS_3X5[digit];
    for (let y = 0; y < 5; y++) {
        const rowBits = pattern[y];
        led.unplot(0, y);
        if ((rowBits & 4) !== 0) led.plot(1, y); else led.unplot(1, y);
        if ((rowBits & 2) !== 0) led.plot(2, y); else led.unplot(2, y);
        if ((rowBits & 1) !== 0) led.plot(3, y); else led.unplot(3, y);
        led.unplot(4, y);
    }
}

function drawBaseDigits() {
    if (!isRunning && remainingSeconds === 0) {
        return;
    }

    if (remainingSeconds >= 60) {
        // Minutes display (1..99)
        const mins = Math.ceil(remainingSeconds / 60);
        if (mins >= 10) {
            const tens = Math.floor(mins / 10);
            const units = mins % 10;
            drawDigit2x5(tens, 0);
            led.unplot(2, 0); led.unplot(2, 1); led.unplot(2, 2); led.unplot(2, 3); led.unplot(2, 4);
            drawDigit2x5(units, 3);
        } else {
            drawDigit3x5(mins);
        }
    } else if (remainingSeconds >= 10) {
        // Under 60 seconds (59..10) - static 2-digit seconds
        const tens = Math.floor(remainingSeconds / 10);
        const units = remainingSeconds % 10;
        drawDigit2x5(tens, 0);
        led.unplot(2, 0); led.unplot(2, 1); led.unplot(2, 2); led.unplot(2, 3); led.unplot(2, 4);
        drawDigit2x5(units, 3);
    } else if (remainingSeconds > 0) {
        // Final 9 seconds (9..1) - bold centered digits with pip tone
        drawDigit3x5(remainingSeconds);
        if (isRunning && !isPaused && subSecondTicks === 0) {
            music.playTone(880, 40); // 880Hz short countdown warning tick
        }
    } else {
        drawDigit3x5(0);
    }
}

function renderDisplay() {
    if (isAlarming || isShowingHelp) {
        return;
    }

    drawBaseDigits();

    // Render orbiting edge dot ONLY during minutes phase (>= 60s)
    // When remainingSeconds < 60s, edge dot is OFF to keep display clean for fast digits!
    if (isRunning && remainingSeconds >= 60) {
        let px = PERIM_X[dotIndex];
        let py = PERIM_Y[dotIndex];
        led.toggle(px, py); // Invert perimeter pixel to create visible contrast blip
    }
}

// --- Extended Alarm Sequence ---
function triggerAlarm() {
    isAlarming = true;
    isRunning = false;
    isPaused = false;
    remainingSeconds = 0;
    alarmCycle = 0;
}

function runAlarmCycle() {
    if (!isAlarming) return;

    // Pulse 1: Display 0 and play first alert tone
    drawDigit3x5(0);
    music.playTone(880, 120);
    basic.pause(60);
    if (!isAlarming) return;

    // Pulse 2: Small Diamond and second alert tone
    basic.showIcon(IconNames.SmallDiamond);
    music.playTone(880, 120);
    basic.pause(60);
    if (!isAlarming) return;

    // Pulse 3: Target icon and high chime tone
    basic.showIcon(IconNames.Target);
    music.playTone(1046, 250);
    basic.pause(120);

    alarmCycle++;
    // Auto-timeout after 60 cycles (~45 seconds) if unattended
    if (alarmCycle >= 60) {
        dismissAlarm();
    }
}

function dismissAlarm() {
    if (isAlarming) {
        isAlarming = false;
        music.stopAllSounds();
        resetTimer();
    }
}

// --- Timer Control Functions ---
function addMinutes(mins: number) {
    stopHelp();

    if (isAlarming) {
        dismissAlarm();
        return;
    }

    const addSecs = mins * 60;
    if (remainingSeconds + addSecs > 5940) {
        remainingSeconds = 5940;
    } else {
        remainingSeconds += addSecs;
    }
    totalSeconds = remainingSeconds;

    // Sound feedback based on amount added
    if (mins === 1) {
        music.playTone(262, 80);  // C4 for +1m
    } else if (mins === 5) {
        music.playTone(392, 80);  // G4 for +5m
    } else if (mins === 10) {
        music.playTone(523, 80);  // C5 for +10m
    }

    renderDisplay();
}

function resetTimer() {
    stopHelp();

    if (isAlarming) {
        dismissAlarm();
        return;
    }

    isRunning = false;
    isPaused = false;
    totalSeconds = 0;
    remainingSeconds = 0;
    dotIndex = 0;
    subSecondTicks = 0;
    idleFrame = 0;
    music.playTone(196, 120); // G3 reset tone
    // Return to idle sandglass loop
}

function togglePlayPause() {
    stopHelp();

    if (isAlarming) {
        dismissAlarm();
        return;
    }

    // If stopped/idle
    if (!isRunning) {
        if (remainingSeconds === 0) {
            // No duration set yet: prompt user to tap pads
            basic.showIcon(IconNames.Confused);
            basic.pause(300);
            return;
        }
        isRunning = true;
        isPaused = false;
        dotIndex = 0;
        subSecondTicks = 0;
        music.playTone(523, 80);
        music.playTone(659, 120);
        renderDisplay();
        return;
    }

    // If currently running, toggle pause
    isPaused = !isPaused;
    if (isPaused) {
        music.playTone(330, 100); // E4 pause tone
    } else {
        music.playTone(440, 100); // A4 resume tone
    }
    renderDisplay();
}

// --- Capacitive Touch Pin Event Handlers ---
pins.touchSetMode(TouchTarget.P0, TouchTargetMode.Capacitive);
pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive);
pins.touchSetMode(TouchTarget.P2, TouchTargetMode.Capacitive);
pins.touchSetMode(TouchTarget.LOGO, TouchTargetMode.Capacitive);

// Pad 0: Adds +1 minute
input.onPinPressed(TouchPin.P0, function () {
    addMinutes(1);
});

// Pad 1: Adds +5 minutes
input.onPinPressed(TouchPin.P1, function () {
    addMinutes(5);
});

// Pad 2: Adds +10 minutes
input.onPinPressed(TouchPin.P2, function () {
    addMinutes(10);
});

// Gold Touch Logo: Display instructions ("PADS: +1m +5m +10m | A:START/PAUSE | B:RESET")
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    showHelp();
});

// --- Button Event Handlers ---
// Button A: Play / Pause toggle (or dismiss alarm / cancel help)
input.onButtonPressed(Button.A, function () {
    togglePlayPause();
});

// Button B: Reset timer to 0 (or dismiss alarm / cancel help)
input.onButtonPressed(Button.B, function () {
    resetTimer();
});

// --- Main Loop ---
basic.forever(function () {
    if (isShowingHelp) {
        basic.pause(100);
    } else if (isAlarming) {
        runAlarmCycle();
    } else if (isRunning && !isPaused && remainingSeconds > 0) {
        basic.pause(200);
        if (remainingSeconds >= 60) {
            dotIndex = (dotIndex + 1) % 16;
        }
        subSecondTicks++;
        if (subSecondTicks >= 5) {
            subSecondTicks = 0;
            remainingSeconds--;
            if (remainingSeconds === 0) {
                triggerAlarm();
                return;
            }
        }
        renderDisplay();
    } else if (!isRunning && remainingSeconds === 0 && !isAlarming) {
        // Idle waiting for input: play animated sandglass loop
        playHourglassStep();
    } else {
        basic.pause(100);
    }
});

// --- Boot Initialization Sequence ---
playGreetingChime();
showRisingHourglass();
