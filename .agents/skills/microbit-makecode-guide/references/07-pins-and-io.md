# MakeCode API: Pins & Hardware I/O (`pins.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/pins](https://makecode.microbit.org/reference/pins)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/pins.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/pins.md)
- **Supported Hardware**: BBC micro:bit V1 and V2 edge connector

---

## Overview
The `pins` namespace provides access to the 20 edge connector pins, including large alligator-clip holes (`P0`, `P1`, `P2`, `3V`, `GND`) and smaller pads (`P3` through `P20`). Supports digital I/O, analog PWM, RC hobby servos, I2C, and SPI communications.

---

## API Signatures & Methods

### 1. Digital I/O
- **`pins.digitalReadPin(name: DigitalPin): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/pins/digital-read-pin](https://makecode.microbit.org/reference/pins/digital-read-pin)
  - Returns `0` (LOW, 0V) or `1` (HIGH, 3.3V).
- **`pins.digitalWritePin(name: DigitalPin, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/pins/digital-write-pin](https://makecode.microbit.org/reference/pins/digital-write-pin)
  - Sets pin output to 0 (0V) or 1 (3.3V).
  ```typescript
  pins.digitalWritePin(DigitalPin.P0, 1); // Turn on external LED
  ```
- **`pins.setPull(name: DigitalPin, pull: PinPullMode): void`**
  - Configures internal pull resistors: `PinPullMode.PullUp`, `PinPullMode.PullDown`, `PinPullMode.PullNone`.

---

### 2. Analog & PWM (Pulse-Width Modulation)
- **`pins.analogReadPin(name: AnalogPin): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/pins/analog-read-pin](https://makecode.microbit.org/reference/pins/analog-read-pin)
  - 10-bit ADC read returning values from `0` (0V) to `1023` (3.3V).
  ```typescript
  let sensor = pins.analogReadPin(AnalogPin.P1);
  ```
- **`pins.analogWritePin(name: AnalogPin, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/pins/analog-write-pin](https://makecode.microbit.org/reference/pins/analog-write-pin)
  - Outputs a PWM signal with duty cycle from `0` (0%) to `1023` (100%).
- **`pins.analogSetPeriod(name: AnalogPin, micros: number): void`**
  - Sets PWM frequency period in microseconds (e.g. 20000 µs = 50Hz).
- **`pins.map(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number`**
  - Re-maps a number from one range to another (e.g., mapping 0..1023 analog input to 0..255 LED brightness).

---

### 3. Servos
- **`pins.servoWritePin(name: AnalogPin, degrees: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/pins/servo-write-pin](https://makecode.microbit.org/reference/pins/servo-write-pin)
  - Positions a standard 180° hobby RC servo motor at `degrees` (0 to 180).
  ```typescript
  pins.servoWritePin(AnalogPin.P0, 90); // Center position
  ```
- **`pins.servoSetPulse(name: AnalogPin, micros: number): void`**
  - Directly sets servo pulse width in microseconds (typically 500 to 2500 µs).

---

### 4. I2C & SPI Serial Buses
- **`pins.i2cReadNumber(address: number, format: NumberFormat, repeated?: boolean): number`**
  - Reads data from an I2C slave device on pins P19 (SCL) and P20 (SDA).
- **`pins.i2cWriteNumber(address: number, value: number, format: NumberFormat, repeated?: boolean): void`**
  - Writes data to an I2C slave device.
- **`pins.spiWrite(value: number): number`**
  - Transmits a byte over SPI (MOSI: P15, MISO: P14, SCK: P13) and returns the received byte.
