# MakeCode API: LED Screen (`led.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/led](https://makecode.microbit.org/reference/led)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/led.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/led.md)
- **Supported Hardware**: BBC micro:bit V1 and V2

---

## Overview
The `led` namespace provides fine-grained control over individual pixels in the 5x5 LED matrix, screen brightness, bargraph visualizations, and display enable/disable states.

Coordinate system:
- **X**: `0` (left) to `4` (right)
- **Y**: `0` (top) to `4` (bottom)
- Center pixel is at `(2, 2)`.

---

## API Signatures & Methods

### 1. Pixel Control
- **`led.plot(x: number, y: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/plot](https://makecode.microbit.org/reference/led/plot)
  - Turns on the LED at coordinates `(x, y)`.
  ```typescript
  led.plot(0, 0); // Top-left LED
  led.plot(2, 2); // Center LED
  ```
- **`led.unplot(x: number, y: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/unplot](https://makecode.microbit.org/reference/led/unplot)
  - Turns off the LED at coordinates `(x, y)`.
- **`led.point(x: number, y: number): boolean`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/point](https://makecode.microbit.org/reference/led/point)
  - Returns `true` if the LED at `(x, y)` is currently lit, `false` otherwise.
- **`led.toggle(x: number, y: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/toggle](https://makecode.microbit.org/reference/led/toggle)
  - Inverts the state of the LED at `(x, y)` (on becomes off, off becomes on).
- **`led.plotBrightness(x: number, y: number, brightness: number): void`**
  - Sets the brightness of a specific pixel (0 to 255).

---

### 2. Bar Graphs & Visualization
- **`led.plotBarGraph(value: number, high: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/plot-bar-graph](https://makecode.microbit.org/reference/led/plot-bar-graph)
  - Displays a vertical bar graph on the 5x5 grid representing `value` relative to `high` maximum.
  ```typescript
  basic.forever(() => {
      let light = input.lightLevel();
      led.plotBarGraph(light, 255);
  });
  ```

---

### 3. Screen Settings & Control
- **`led.setBrightness(value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/set-brightness](https://makecode.microbit.org/reference/led/set-brightness)
  - Adjusts global display brightness from 0 (off) to 255 (maximum).
- **`led.brightness(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/brightness](https://makecode.microbit.org/reference/led/brightness)
  - Returns the current global brightness setting (0..255).
- **`led.stopAnimation(): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/stop-animation](https://makecode.microbit.org/reference/led/stop-animation)
  - Immediately aborts any ongoing scrolling string or icon transition animation.
- **`led.enable(on: boolean): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/led/enable](https://makecode.microbit.org/reference/led/enable)
  - Enables or disables the LED display. Disabling display frees up GPIO pins shared with the matrix for external hardware circuits.
