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

## 2. Flashing Code to the Board

To flash a project to the connected micro:bit:
```bash
./run flash <project-name>
```

### How Flashing Works:
1. Locates the compiled `.hex` file in `dist/<project-name>/latest.hex` (or scans for any `.hex` in the project or downloads directory).
2. If no cached `.hex` exists, prompts the developer to download the `.hex` from the MakeCode web simulator or compile it.
3. Automatically copies the `.hex` file to `/Volumes/MICROBIT`.
4. Observes the DAPLink flashing process:
   - The yellow LED on the back of the micro:bit flashes rapidly.
   - The USB drive unmounts and remounts.
5. Verifies successful completion.

---

## 3. Timestamp Binary Caching (`dist/`)

When flashing or archiving binaries for a project, caching allows flashing multiple micro:bit boards or testing different physical units without recompilation.

To cache a `.hex` file:
```bash
./run cache <project-name> <path-to-hex-file>
```
Or simply:
```bash
./run cache <project-name>
```
*(Automatically picks up `microbit-<project-name>.hex` from `~/Downloads/` if omitted).*

### Storage Convention:
Binaries are stored in `dist/<project-name>/`:
- `dist/<project-name>/<project-name>_<YYYY-MM-DD_HHMM>.hex`: Immutable timestamp version (e.g. `dist/01-blinking-heart/01-blinking-heart_2026-09-24_1350.hex`).
- `dist/<project-name>/latest.hex`: Symlink or pointer to the latest cached binary for easy one-step flashing.

---

## 4. Reversing / Rollback: `.hex` to `.ts` (`rollbacks/`)

Microsoft MakeCode Universal Hex files embed the complete original TypeScript source code, `pxt.json` configuration, and project metadata inside Intel HEX `0x0D` custom records compressed with LZMA.

Any MakeCode `.hex` can be reverse-converted back into readable `.ts` code!

To convert a `.hex` file back to TypeScript:
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

### When to Use Rollback:
- When recovering an older version of code from an archived `.hex` file.
- When inspecting what code is running inside a `.hex` file from a student, colleague, or backup.
- When rolling back changes after an experiment or hardware test.

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

1. **macOS Extended Attributes Issue**:
   - The micro:bit DAPLink FAT16/12 filesystem does NOT support POSIX extended attributes (`getxattr`). Running `ls -la /Volumes/MICROBIT` can hang.
   - Always access files directly by path (`open('/Volumes/MICROBIT/DETAILS.TXT')`) and use binary streams (`shutil.copyfile`) without preserving metadata attributes.
2. **Re-flashing Multiple Boards**:
   - Once a binary is cached with `./run cache <project>`, you can plug in any number of micro:bit boards sequentially and run `./run flash <project>` to flash them instantly.
3. **MakeCode Simulator Workflow**:
   - Edit or test code in `projects/<project-name>/main.ts`.
   - Copy-paste into [makecode.microbit.org](https://makecode.microbit.org/) to simulate or click **Download** to obtain the compiled `.hex`.
   - Cache it with `./run cache <project>` and flash with `./run flash <project>`.
