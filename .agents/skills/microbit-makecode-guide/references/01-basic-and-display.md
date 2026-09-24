# MakeCode API: Basic & Display (`basic.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/basic](https://makecode.microbit.org/reference/basic)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/basic.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/basic.md)
- **Supported Hardware**: BBC micro:bit V1 and V2

---

## Overview
The `basic` namespace provides core functions for program execution, pausing, and displaying text, numbers, images, and built-in icons on the 5x5 LED screen.

---

## API Signatures & Methods

### 1. `basic.showIcon(icon: IconNames, interval?: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/show-icon](https://makecode.microbit.org/reference/basic/show-icon)
- **Description**: Displays a predefined image on the 5x5 LED screen.
- **Parameters**:
  - `icon`: Member of `IconNames` enum (e.g. `IconNames.Heart`, `IconNames.Happy`, `IconNames.Sad`, `IconNames.Yes`, `IconNames.No`).
  - `interval` *(optional)*: Duration in milliseconds to hold the icon before continuing (default: 600ms).
```typescript
basic.showIcon(IconNames.Heart);
basic.showIcon(IconNames.Happy, 1000);
```

### 2. `basic.showString(text: string, interval?: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/show-string](https://makecode.microbit.org/reference/basic/show-string)
- **Description**: Scrolls text across the 5x5 LED display from right to left.
- **Parameters**:
  - `text`: String to display.
  - `interval` *(optional)*: Milliseconds per frame shift (default: 150ms).
```typescript
basic.showString("Hello!");
```

### 3. `basic.showNumber(value: number, interval?: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/show-number](https://makecode.microbit.org/reference/basic/show-number)
- **Description**: Shows a number. Single digits are shown statically; multi-digit numbers scroll across the display.
```typescript
basic.showNumber(42);
```

### 4. `basic.showLeds(leds: string, interval?: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/show-leds](https://makecode.microbit.org/reference/basic/show-leds)
- **Description**: Draws a custom 5x5 LED bitmap using `#` for lit and `.` for unlit pixels.
```typescript
basic.showLeds(`
    . # . # .
    # # # # #
    # # # # #
    . # # # .
    . . # . .
`);
```

### 5. `basic.clearScreen(): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/clear-screen](https://makecode.microbit.org/reference/basic/clear-screen)
- **Description**: Turns off all 25 LEDs immediately.
```typescript
basic.clearScreen();
```

### 6. `basic.pause(millis: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/pause](https://makecode.microbit.org/reference/basic/pause)
- **Description**: Pauses the current fiber/coroutine execution for the specified milliseconds without freezing background events.
```typescript
basic.pause(500); // Wait 500 ms
```

### 7. `basic.forever(handler: () => void): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/forever](https://makecode.microbit.org/reference/basic/forever)
- **Description**: Repeatedly executes a loop in the background, yielding between iterations to allow other events to fire.
```typescript
basic.forever(() => {
    basic.showIcon(IconNames.Heart);
    basic.pause(500);
    basic.clearScreen();
    basic.pause(500);
});
```

### 8. `basic.showArrow(direction: ArrowNames, interval?: number): void`
- **Doc URL**: [https://makecode.microbit.org/reference/basic/show-arrow](https://makecode.microbit.org/reference/basic/show-arrow)
- **Description**: Shows an arrow pointing in one of 8 compass directions (`ArrowNames.North`, `ArrowNames.South`, etc.).
