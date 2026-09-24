# MakeCode API: Control & System (`control.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/control](https://makecode.microbit.org/reference/control)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/control.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/control.md)
- **Supported Hardware**: BBC micro:bit V1 and V2

---

## Overview
The `control` namespace provides low-level system utilities, high-precision timers, background thread spawning (`inBackground`), software system resets, hardware identifiers, and internal event routing.

---

## API Signatures & Methods

### 1. Timers & Clocks
- **`control.millis(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/millis](https://makecode.microbit.org/reference/control/millis)
  - Returns elapsed milliseconds since the micro:bit powered on or reset.
  ```typescript
  let startTime = control.millis();
  // ... perform action ...
  let elapsedTime = control.millis() - startTime;
  ```
- **`control.micros(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/micros](https://makecode.microbit.org/reference/control/micros)
  - High-resolution timer returning elapsed microseconds.
- **`control.waitMicros(micros: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/wait-micros](https://makecode.microbit.org/reference/control/wait-micros)
  - Busy-waits for a precise microsecond duration (for low-level sensor timing).

---

### 2. Concurrency & Background Threads
- **`control.inBackground(body: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/in-background](https://makecode.microbit.org/reference/control/in-background)
  - Spawns a cooperative lightweight green thread/fiber to run asynchronously in parallel with the main loop.
  ```typescript
  control.inBackground(() => {
      while (true) {
          basic.pause(1000);
          music.playTone(Note.C, 100);
      }
  });
  ```

---

### 3. Device Info & Reset
- **`control.reset(): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/reset](https://makecode.microbit.org/reference/control/reset)
  - Performs a warm software reboot of the micro:bit board.
- **`control.deviceName(): string`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/device-name](https://makecode.microbit.org/reference/control/device-name)
  - Returns a unique, friendly 5-letter device name (e.g. "zogep", "tovuk") derived from the hardware serial number.
- **`control.deviceSerialNumber(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/device-serial-number](https://makecode.microbit.org/reference/control/device-serial-number)
  - Returns the unique 32-bit hardware chip ID.

---

### 4. Custom System Events
- **`control.raiseEvent(src: number, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/raise-event](https://makecode.microbit.org/reference/control/raise-event)
  - Fires an event into the micro:bit event bus.
- **`control.onEvent(src: number, value: number, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/control/on-event](https://makecode.microbit.org/reference/control/on-event)
  - Listens for a specific bus event matching `src` ID and `value` code.
