# 02-countdown-timer

A full-featured BBC micro:bit countdown timer built using Microsoft MakeCode (Static TypeScript). Designed with a living animated sandglass idle loop, cumulative capacitive touch pad duration increments, Play/Pause on Button A, Reset on Button B, an orbiting perimeter dot activity indicator (active only for minutes), zero-scroll static display engine, and an extended alarm.

---

## Features

1. **Boot & Living Sandglass Idle Animation**:
   - Plays a pleasant ascending major arpeggio chime (`C4 -> E4 -> G4 -> C5`).
   - Starts at **0 minutes** (no preset default).
   - While idle at 0m, displays a living **animated sandglass**: sand grains visibly trickle down from the top bulb into the bottom bulb, and then the sandglass rotates 180° in a continuous smooth loop!
2. **Capacitive Touch Pad Increments (Cumulative & Flexible)**:
   - **Pad 0**: Adds **+1 minute** per tap (`262Hz` C4 confirmation tone).
   - **Pad 1**: Adds **+5 minutes** per tap (`392Hz` G4 confirmation tone).
   - **Pad 2**: Adds **+10 minutes** per tap (`523Hz` C5 confirmation tone).
   - Taps accumulate flexibly up to 99 minutes (e.g. Pad 1 (+5m) + Pad 0 (+1m) + Pad 0 (+1m) = 7 minutes).
   - **Lockout Protection**: Once the countdown has started (actively running or paused), pad touches are locked and ignored so accidental finger contact will never ruin your timer progress.
   - Configured with `pins.touchSetMode(TouchTarget.*, TouchTargetMode.Capacitive)` for bare-finger tapping on micro:bit V2 without holding GND.
3. **Gold Touch Logo Controls (V2)**:
   - **Tap (Short Press - Help / Silence)**:
     - **Active Only When Stopped/Idle**: Tapping the gold micro:bit logo while the countdown is actively running or paused is ignored, ensuring your active timer is never disturbed.
     - When idle or setting time, tapping the gold logo scrolls concise help instructions:
       `"PADS: +1m +5m +10m | A:START/PAUSE | B:RESET"`
     - **Instant Interruptibility (`led.stopAnimation`)**: Touching any pad (**Pad 0, 1, 2**), pressing **Button A**, pressing **Button B**, or tapping the gold logo again **immediately aborts** the help scroll with zero delay and executes your input on the spot.
     - If the alarm is sounding, touching the gold logo immediately silences and dismisses it.
   - **Long Press (LED Brightness Cycling & Lock)**:
     - Keep your finger held on the golden logo to cycle the 5x5 LED matrix brightness up to maximum (`255`), wrap back to lowest visible level (`25`), and cycle up again.
     - Continuous real-time audio pitch feedback rises and falls with the brightness level (`220Hz` to `660Hz`).
     - Releasing your finger locks the brightness at that exact level and plays a pleasant confirmation chime (`784Hz`).
4. **Controls**:
   - **Button A (Play / Pause)**:
     - If stopped: starts the timer (if 0m is set, prompts user to tap pads).
     - If running: pauses the timer and **displays a prominent pause symbol (`||`)**.
     - If paused: unpauses and immediately restores the remaining digits and continues counting down.
   - **Button B (Reset to 0)**:
     - Resets total and remaining time to 0 minutes (`196Hz` reset tone) and returns to the idle animated sandglass.
5. **Orbiting Edge Dot Activity Indicator**:
   - The outer perimeter of the 5x5 screen has 16 border LEDs.
   - **&ge; 60s (Minutes mode)**: A dot travels continuously clockwise around the perimeter every 200ms while running, and **freezes in place** when paused.
   - **< 60s (Seconds mode)**: The edge dot turns **completely OFF**, keeping the screen clear and uncluttered for fast-changing second digits.
6. **Zero-Scroll Static Display Engine**:
   - **>= 60s**: Shows remaining whole minutes (`1`..`9` centered 3x5, `10`..`99` compact 2x5) without horizontal scrolling delay.
   - **59s to 10s**: Shows remaining 2-digit seconds (`59`, `58`... `10`) in-place using the compact 2x5 font.
   - **Final 9s to 0s**: Displays centered bold single digits (`9` down to `0`) with audible warning ticks on each second.
7. **Extended Alarm Sequence on Expiry**:
   - Plays a long rhythmic multi-tone alert pattern (`880Hz` beeps and `1046Hz` chime) alongside an expanding animated target/diamond shape.
   - **Dismissal**: Pressing **Button A**, **Button B**, or tapping the **Gold Logo** immediately silences the alarm sound and resets to the idle animated sandglass.

---

## Hardware Pin Connections

```
     _________________________
    |  BBC micro:bit          |
    |      [GOLD LOGO]        |  <-- Touch for Help / Silence Alarm
    |                         |
    |      [5x5 LED]          |
    |                         |
    |   [A]             [B]   |
    | Play/Pause       Reset  |
    |_________________________|
     | | | | | | | | | | | | |
      0   1   2       3V  GND
     +1m +5m +10m    Power Ground
```

- **Gold Logo**: Tap for Help instructions (`PADS: +1m +5m +10m | A:START/PAUSE | B:RESET`) / Silence alarm
- **Pad 0**: Adds +1 Minute
- **Pad 1**: Adds +5 Minutes
- **Pad 2**: Adds +10 Minutes
- **Button A**: Play / Pause Toggle (silences alarm when ringing)
- **Button B**: Reset to 0 (silences alarm when ringing)
- **Pad 3V**: 3.3V DC Power output (do not use as touch input)
- **Pad GND**: Ground

---

## How to Test

Run the automated Vitest test suite inside Docker:
```bash
./run test 02-countdown-timer
```

Run all workspace tests, MakeCode compatibility linter, and TypeScript compiler check:
```bash
./run test
./run lint
./run typecheck
```

---

## How to Run in MakeCode Simulator

1. Open [makecode.microbit.org](https://makecode.microbit.org/) in your web browser.
2. Click **New Project** and name it `Countdown Timer`.
3. Switch from **Blocks** to the **JavaScript** tab at the top.
4. Copy the entire contents of [`main.ts`](./main.ts) and paste it into the editor.
5. In the interactive simulator:
   - Watch the rising boot logo, followed by the living sandglass trickling and rotating while waiting for your input!
   - Click the **gold micro:bit logo** at any time to scroll the quick guide instructions (`PADS: +1m +5m +10m | A:START/PAUSE | B:RESET`), or tap any button/pad to cancel scrolling instantly!
   - Click **0** (+1m), **1** (+5m), and **2** (+10m) to set your desired time.
   - Click **Button A** to start counting down. Notice the dot orbiting the perimeter during the minutes phase!
   - When the countdown drops below 60 seconds, notice how the edge dot cleanly shuts off so you can watch the large second digits count down.
   - When the alarm sounds, click **Button A**, **Button B**, or tap the **Gold Logo** to silence it and return to the animated sandglass!
