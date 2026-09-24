---
name: microbit-makecode-guide
description: >-
  Reference guide and offline documentation library for Microsoft MakeCode APIs (Static TypeScript) on BBC micro:bit.
  Use when writing micro:bit code, choosing hardware APIs, checking method signatures, or verifying MakeCode syntax compatibility.
---

# Micro:bit MakeCode Guide & API Reference

Authoritative local reference manual for Microsoft MakeCode Static TypeScript APIs on the BBC micro:bit.

All reference documentation in this skill is grounded directly in the official MakeCode documentation:
- **Official Documentation Portal**: [https://makecode.microbit.org/reference](https://makecode.microbit.org/reference)
- **Official Open-Source Source**: [https://github.com/microsoft/pxt-microbit/tree/master/docs/reference](https://github.com/microsoft/pxt-microbit/tree/master/docs/reference)

---

## Detailed Category References

Before designing, brainstorming, or writing code, read the specific reference file for the subsystem you are targeting:

| Subsystem | Scope & Key Functions | Local Reference File | Official Web URL |
| :--- | :--- | :--- | :--- |
| **Basic & Display** | `basic.showIcon`, `showString`, `showNumber`, `showLeds`, `pause`, `forever` | [`01-basic-and-display.md`](./references/01-basic-and-display.md) | [makecode.microbit.org/reference/basic](https://makecode.microbit.org/reference/basic) |
| **Input & Sensors** | `input.onButtonPressed`, `onGesture`, `acceleration`, `temperature`, `compass`, `light` | [`02-input-and-sensors.md`](./references/02-input-and-sensors.md) | [makecode.microbit.org/reference/input](https://makecode.microbit.org/reference/input) |
| **Sound & Music** | `music.playTone`, `ringTone`, `rest`, `setVolume`, `playMelody`, `soundExpression` | [`03-sound-and-music.md`](./references/03-sound-and-music.md) | [makecode.microbit.org/reference/music](https://makecode.microbit.org/reference/music) |
| **LED Matrix** | `led.plot`, `unplot`, `point`, `toggle`, `plotBarGraph`, `setBrightness` | [`04-led-matrix.md`](./references/04-led-matrix.md) | [makecode.microbit.org/reference/led](https://makecode.microbit.org/reference/led) |
| **Radio Comms** | `radio.setGroup`, `sendNumber`, `sendString`, `sendValue`, `onReceived*`, `receivedPacket` | [`05-radio-communication.md`](./references/05-radio-communication.md) | [makecode.microbit.org/reference/radio](https://makecode.microbit.org/reference/radio) |
| **Game & Sprites** | `game.createSprite`, `move`, `turn`, `ifOnEdgeBounce`, `isTouching`, `addScore`, `gameOver` | [`06-game-and-sprites.md`](./references/06-game-and-sprites.md) | [makecode.microbit.org/reference/game](https://makecode.microbit.org/reference/game) |
| **Pins & Hardware I/O** | `pins.digitalReadPin`, `digitalWritePin`, `analogReadPin`, `servoWritePin`, `i2c`, `spi` | [`07-pins-and-io.md`](./references/07-pins-and-io.md) | [makecode.microbit.org/reference/pins](https://makecode.microbit.org/reference/pins) |
| **Serial & Datalogger** | `serial.writeLine`, `writeValue`, `readString`, `datalogger.log` | [`08-serial-and-datalogger.md`](./references/08-serial-and-datalogger.md) | [makecode.microbit.org/reference/serial](https://makecode.microbit.org/reference/serial) |
| **Control & Timers** | `control.millis`, `micros`, `reset`, `inBackground`, `deviceName`, `raiseEvent` | [`09-control-and-system.md`](./references/09-control-and-system.md) | [makecode.microbit.org/reference/control](https://makecode.microbit.org/reference/control) |
| **Hardware V1 vs V2** | Speaker, microphone, capacitive touch logo, memory & processor comparison | [`10-hardware-v1-vs-v2.md`](./references/10-hardware-v1-vs-v2.md) | [microbit.org/features](https://microbit.org/get-started/user-guide/features/) |

---

## Static TypeScript Rules & Constraints

1. **Strict Types & Static Typing**:
   MakeCode uses **Static TypeScript (STS)**, which compiles directly to ARM Thumb machine code.
   - Avoid `any`, dynamic property accesses (`obj[dynamicKey]`), `eval()`, and browser DOM APIs (`window`, `document`).
2. **Synchronous & Event Driven**:
   Use `basic.pause(ms)` for time delays and `input.onButtonPressed(...)` for events.
3. **Random Numbers**:
   Use `randint(min, max)` to generate integers between `min` and `max` inclusive.
