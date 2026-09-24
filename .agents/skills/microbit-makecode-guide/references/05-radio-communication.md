# MakeCode API: Radio Communication (`radio.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/radio](https://makecode.microbit.org/reference/radio)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/radio.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/radio.md)
- **Supported Hardware**: BBC micro:bit V1 and V2 (2.4 GHz Nordic Radio protocol)

---

## Overview
The `radio` namespace enables wireless peer-to-peer messaging between multiple micro:bit boards without requiring a Wi-Fi router or pairing. Devices communicate on assigned "groups" (channels 0 to 255).

---

## API Signatures & Methods

### 1. Configuration
- **`radio.setGroup(id: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/set-group](https://makecode.microbit.org/reference/radio/set-group)
  - Sets the radio group channel (0 to 255). Devices MUST share the same group ID to communicate.
  ```typescript
  radio.setGroup(42);
  ```
- **`radio.setTransmitPower(power: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/set-transmit-power](https://makecode.microbit.org/reference/radio/set-transmit-power)
  - Configures transmission power from 0 (lowest, ~few meters) to 7 (highest, ~70+ meters line of sight).
- **`radio.setTransmitSerialNumber(transmit: boolean): void`**
  - Sends the board's unique hardware serial number in every transmitted packet header.

---

### 2. Sending Packets
- **`radio.sendNumber(value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/send-number](https://makecode.microbit.org/reference/radio/send-number)
  - Broadcasts a 32-bit floating-point or integer number.
  ```typescript
  input.onButtonPressed(Button.A, () => {
      radio.sendNumber(1);
  });
  ```
- **`radio.sendString(msg: string): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/send-string](https://makecode.microbit.org/reference/radio/send-string)
  - Broadcasts a string (up to 19 characters).
  ```typescript
  radio.sendString("HELLO");
  ```
- **`radio.sendValue(name: string, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/send-value](https://makecode.microbit.org/reference/radio/send-value)
  - Broadcasts a key-value telemetry pair (e.g. name up to 8 chars, number value).
  ```typescript
  radio.sendValue("temp", input.temperature());
  ```

---

### 3. Receiving Packets
- **`radio.onReceivedNumber(handler: (receivedNumber: number) => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/on-received-number](https://makecode.microbit.org/reference/radio/on-received-number)
  - Runs when a packet containing a number is received.
  ```typescript
  radio.onReceivedNumber((receivedNumber) => {
      basic.showNumber(receivedNumber);
  });
  ```
- **`radio.onReceivedString(handler: (receivedString: string) => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/on-received-string](https://makecode.microbit.org/reference/radio/on-received-string)
  - Runs when a string message is received.
  ```typescript
  radio.onReceivedString((receivedString) => {
      basic.showString(receivedString);
  });
  ```
- **`radio.onReceivedValue(handler: (name: string, value: number) => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/on-received-value](https://makecode.microbit.org/reference/radio/on-received-value)
  - Runs when a key-value packet arrives.
  ```typescript
  radio.onReceivedValue((name, value) => {
      if (name == "temp") {
          basic.showNumber(value);
      }
  });
  ```

---

### 4. Packet Telemetry & RSSI
- **`radio.receivedPacket(property: RadioPacketProperty): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/radio/received-packet](https://makecode.microbit.org/reference/radio/received-packet)
  - Inspects metadata of the last received packet:
    - `RadioPacketProperty.SignalStrength`: RSSI (signal strength in dBm, roughly -128 to -42). Great for proximity games and treasure hunts!
    - `RadioPacketProperty.Time`: Microseconds timestamp when packet was received.
    - `RadioPacketProperty.SerialNumber`: Sender device serial number (if enabled).
