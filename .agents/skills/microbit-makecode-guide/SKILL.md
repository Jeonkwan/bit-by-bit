---
name: microbit-makecode-guide
description: >-
  Reference guide for Microsoft MakeCode APIs (Static TypeScript) for BBC micro:bit.
  Use when writing micro:bit code, choosing hardware APIs, managing sensors/LEDs/buttons, or verifying MakeCode syntax compatibility.
---

# Micro:bit MakeCode Guide

This skill provides API reference and coding patterns for Microsoft MakeCode Static TypeScript.

## Core Namespaces

### 1. Basic & Display
```typescript
basic.showIcon(IconNames.Heart);
basic.showString("Hi");
basic.showNumber(42);
basic.clearScreen();
basic.pause(500); // 500ms
basic.forever(() => {
    // runs periodically in background loop
});
```

### 2. Input & Sensors
```typescript
// Buttons
input.onButtonPressed(Button.A, () => { /* Button A pressed */ });
input.onButtonPressed(Button.B, () => { /* Button B pressed */ });
input.onButtonPressed(Button.AB, () => { /* Both pressed */ });
let pressed = input.buttonIsPressed(Button.A);

// Gestures
input.onGesture(Gesture.Shake, () => { /* Shake detected */ });
input.onGesture(Gesture.TiltLeft, () => { /* Tilted left */ });

// Environmental Sensors
let temp = input.temperature();        // in Celsius
let light = input.lightLevel();        // 0 to 255
let heading = input.compassHeading();  // 0 to 359 degrees
```

### 3. LED Matrix Control
```typescript
led.plot(2, 2);              // Turn on center LED (x: 0..4, y: 0..4)
led.unplot(2, 2);            // Turn off center LED
led.toggle(2, 2);            // Invert LED state
let isOn = led.point(2, 2);  // Check if pixel is lit
led.setBrightness(128);      // 0 to 255
```

### 4. Sound & Music
```typescript
music.playTone(262, 500);    // Play Middle C (262Hz) for 500ms
music.ringTone(440);         // Ring A4 continuously
music.rest(200);             // Rest for 200ms
```

## Static TypeScript (STS) Constraints
- Avoid `any` where possible.
- Avoid dynamic runtime reflection (`eval`, dynamic property lookups like `obj[key]`).
- Keep code synchronous or event-driven via `input.onButtonPressed`.
