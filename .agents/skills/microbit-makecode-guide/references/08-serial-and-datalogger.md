# MakeCode API: Serial & Data Logger (`serial.*` & `datalogger.*`)

- **Official Web Documentation (Serial)**: [https://makecode.microbit.org/reference/serial](https://makecode.microbit.org/reference/serial)
- **Official Web Documentation (Datalogger)**: [https://makecode.microbit.org/reference/datalogger](https://makecode.microbit.org/reference/datalogger)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/serial.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/serial.md)
- **Supported Hardware**:
  - `serial`: micro:bit V1 and V2 (via USB CDC virtual COM port or edge pins P0/P1)
  - `datalogger`: micro:bit V2 only (onboard flash filesystem)

---

## Overview
- **Serial**: Streams real-time diagnostic print statements and telemetry data over the USB cable to a computer (viewable in the MakeCode Console simulator or tools like `screen` / `pyserial`).
- **Datalogger**: Records multi-column sensor data offline to the micro:bit V2 onboard non-volatile flash memory, saving as an interactive `MY_DATA.HTM` spreadsheet file accessible when plugged into a PC.

---

## Serial API Signatures & Methods

### 1. Writing Data to Serial / USB
- **`serial.writeLine(text: string): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/serial/write-line](https://makecode.microbit.org/reference/serial/write-line)
  - Sends a string followed by a newline (`\r\n`).
  ```typescript
  serial.writeLine("Program initialized!");
  ```
- **`serial.writeNumber(value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/serial/write-number](https://makecode.microbit.org/reference/serial/write-number)
- **`serial.writeValue(name: string, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/serial/write-value](https://makecode.microbit.org/reference/serial/write-value)
  - Formats data as `name:value` (automatically recognized and plotted as a live real-time chart in the MakeCode simulator!).
  ```typescript
  basic.forever(() => {
      serial.writeValue("light", input.lightLevel());
      serial.writeValue("temp", input.temperature());
      basic.pause(100);
  });
  ```

### 2. Reading Data from Serial
- **`serial.readLine(): string`**
  - Reads characters from serial buffer until a newline delimiter is received.
- **`serial.onDataReceived(delimiters: string, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/serial/on-data-received](https://makecode.microbit.org/reference/serial/on-data-received)
  - Triggers an event when the specified character (e.g. `serial.delimiters(Delimiters.NewLine)`) is received over serial.

### 3. Routing & Configuration
- **`serial.redirectToUSB(): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/serial/redirect-to-usb](https://makecode.microbit.org/reference/serial/redirect-to-usb)
  - Ensures serial stream routes directly to the computer via USB (default: 115200 baud).

---

## Data Logger API (micro:bit V2)

- **`datalogger.log(data: datalogger.ColumnValue[]): void`**
  - Logs a row of data with column names and values to internal flash memory.
  ```typescript
  datalogger.log(
      datalogger.createCV("temperature", input.temperature()),
      datalogger.createCV("light", input.lightLevel())
  );
  ```
- **`datalogger.includeTimestamp(format: FlashLogTimeStampFormat): void`**
  - Automatically prepends timestamp columns (e.g. `FlashLogTimeStampFormat.Seconds` or `Milliseconds`).
- **`datalogger.deleteLog(deleteType?: DeleteType): void`**
  - Clears logged data from the onboard storage.
