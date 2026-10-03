---
name: microbit-board-flasher
description: >-
  Detect connected BBC micro:bit boards via USB, flash MakeCode hex files, manage timestamp-versioned binary caches in dist/,
  convert .hex files back into .ts source code in rollbacks/, and monitor live serial telemetry.
  Use when transferring code to physical hardware, checking board connection, archiving binaries, or recovering source code from hex files.
---

# Micro:bit Board Flasher & Hex Rollback

This skill guides the agent and developer in deploying code to physical BBC micro:bit hardware, caching compiled binaries with human-readable timestamp versions, converting `.hex` files back into `.ts` code in dedicated rollback directories, and monitoring serial output.

---

## 1. Board Detection & Status

The micro:bit mounts on the host OS as a USB Mass Storage device (`/Volumes/MICROBIT` on macOS, `/media/*/MICROBIT` or `/run/media/*/MICROBIT` on Linux, drive letters on Windows) with an accompanying serial COM / CDC port (`/dev/cu.usbmodem*`).

To inspect the connected micro:bit hardware:
```bash
./run board
```
This queries DAPLink, parses `DETAILS.TXT`, and displays:
- **Board Version**: e.g., BBC micro:bit V2.2
- **Unique Board ID**: Hardware serial / unique identifier
- **DAPLink Firmware**: Bootloader version
- **Mount Path**: USB volume location
- **Serial Port**: Host device path for serial communication (e.g., `/dev/cu.usbmodem102`)

---

## 2. Compiling TypeScript to Universal HEX (`./run compile`)

Compilation runs inside a dedicated Docker container using MakeCode CLI (`mkc`):
```bash
./run compile <project-name>
```

### What Compilation Does:
1. Validates `projects/<project-name>/main.ts`.
2. Sets up a clean MakeCode workspace with micro:bit V1 & V2 target definitions.
3. Compiles the TypeScript program into a Universal Intel HEX binary (`binary.hex`).
4. Embeds the original TypeScript source code and metadata as custom 0x0D records with LZMA compression (allowing full decompiler / rollback compatibility and MakeCode web editor importing).
5. Automatically caches the binary in `dist/<project-name>/`:
   - `dist/<project-name>/<project-name>_<YYYY-MM-DD_HHMM>.hex`
   - `dist/<project-name>/latest.hex`

---

## 3. Flashing Code to the Board (`./run flash`)

To flash a project to the connected micro:bit:
```bash
./run flash <project-name>
```

### How Flashing Works:
1. Locates the compiled `.hex` file in `dist/<project-name>/latest.hex` (or compiles it via `./run compile <project-name>` if missing).
2. Copies the `.hex` file directly to `/Volumes/MICROBIT` using attribute-free binary streaming (`cp -X` / low-level chunks).
3. Safely handles DAPLink's auto-reboot:
   - When the firmware completes transfer, DAPLink resets the board immediately.
   - The flasher detects this hardware reset without hanging on macOS `fskit` locks.
4. Verifies the board remounts or serial port is live.

---

## 4. Reversing / Rollback: `.hex` to `.ts` (`rollbacks/`)

Microsoft MakeCode Universal Hex files embed the complete original TypeScript source code, `pxt.json` configuration, and project metadata inside Intel HEX `0x0D` custom records compressed with LZMA.

To convert a `.hex` file back to TypeScript inside Docker:
```bash
./run rollback <path-to-hex-file> [project-name]
```

### Destination Convention:
The converted source code is extracted into a dedicated rollback directory:
```
rollbacks/<project-name>_<YYYY-MM-DD_HHMM>/
├── main.ts      # Extracted TypeScript source code
├── pxt.json     # MakeCode configuration & dependencies
└── metadata.json # Extracted target details and compression stats
```

---

## 5. Live Serial Telemetry Monitor

BBC micro:bit programs frequently send data over serial (`serial.writeLine(...)`, `serial.writeValue(...)`).

To stream serial data in real time from the micro:bit:
```bash
./run monitor [baud-rate]
```
*(Default baud rate is 115200).*
Press `Ctrl+C` to cleanly exit the monitor.

---

## 6. Best Practices & Troubleshooting

1. **macOS `fskit` & DAPLink Disconnection**:
   - On macOS Sonoma and Sequoia, Apple's `fskit` MS-DOS driver manages `/Volumes/MICROBIT`.
   - Never use tools that preserve extended attributes or perform synchronous metadata flush (`shutil.copyfile`, Finder GUI copies).
   - If a previous flash process hung, **unplug and reconnect the micro:bit USB cable** once to release the kernel VFS lock.
2. **Re-flashing Multiple Boards**:
   - Once a binary is cached or compiled, you can plug in any number of micro:bit boards sequentially and run `./run flash <project>` to flash them instantly.
3. **MakeCode Simulator Workflow**:
   - Edit or test code in `projects/<project-name>/main.ts`.
   - You can compile locally with `./run compile <project>` or paste into [makecode.microbit.org](https://makecode.microbit.org/) to simulate.
