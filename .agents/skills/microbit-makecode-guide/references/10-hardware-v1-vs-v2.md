# micro:bit Hardware Comparison: V1 vs V2

- **Official micro:bit Features Guide**: [https://microbit.org/get-started/user-guide/features/](https://microbit.org/get-started/user-guide/features/)
- **Technical Specs**: [https://tech.microbit.org/hardware/](https://tech.microbit.org/hardware/)

---

## Hardware Specifications Matrix

| Feature | micro:bit V1 (1.3 / 1.5) | micro:bit V2 (2.0 / 2.2) | MakeCode API Impact |
| :--- | :--- | :--- | :--- |
| **SoC Processor** | Nordic nRF51822 (16 MHz ARM Cortex-M0) | Nordic nRF52833 (64 MHz ARM Cortex-M4F) | V2 runs code ~4x faster with floating-point hardware |
| **RAM** | 16 KB RAM | 128 KB RAM | V2 can hold much larger arrays, buffers, and variables |
| **Flash ROM** | 256 KB Flash | 512 KB Flash | V2 can store larger compiled codebases |
| **Built-in Speaker** | ❌ None (requires external buzzer/headphones on P0) |  On-board magnetic speaker | `music.*` plays out loud instantly on V2 |
| **Microphone** | ❌ None |  MEMS microphone + mic LED | `input.onSound(...)` and `input.soundLevel()` only on V2 |
| **Touch Logo** | ❌ None (only edge pins P0..P2) |  Capacitive touch gold logo | `input.onLogoEvent(...)` and `input.logoIsPressed()` only on V2 |
| **Data Logging** | ❌ None |  Internal Flash log file (`MY_DATA.HTM`) | `datalogger.*` only supported on V2 |
| **5x5 LED Matrix** |  Red 5x5 LED grid |  Red 5x5 LED grid | Fully supported on both |
| **Buttons A & B** |  Two tactile push buttons |  Two tactile push buttons | Fully supported on both |
| **Radio (2.4 GHz)** |  Nordic proprietary radio |  Nordic proprietary radio | Fully compatible between V1 and V2 |
| **Bluetooth (BLE)** |  BLE 4.0 |  BLE 5.0 | Supported on both |
| **Edge Pins** |  Flat edge connector |  Notched edge (prevents alligator clip slips) | Pins 0, 1, 2, 3V, GND compatible |
| **Sleep / Power Off** | ❌ Unplug required |  Hold rear reset button to sleep | `power.lowPowerPause(...)` supported on V2 |

---

## Agent Guidance When Writing Code

1. **If targeting universal compatibility (runs on any micro:bit)**:
   - Stick to `basic`, `input.onButtonPressed`, `input.onGesture`, `led`, `radio`, `game`, `pins`, and `serial`.
   - Avoid `input.onSound`, `input.onLogoEvent`, and `datalogger.*`.
2. **If utilizing V2 features**:
   - Explicitly document in the project's `README.md` that micro:bit V2 is required.
   - Mention in the code comments that the built-in speaker, microphone, or touch logo is utilized.
