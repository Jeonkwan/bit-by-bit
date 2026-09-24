# BBC micro:bit Development & Testing Workspace

A modular, Docker-isolated workspace for building, automatically testing, and simulating BBC micro:bit projects using **Microsoft MakeCode (Static TypeScript)** with **Google Antigravity AI Agents**.

---

## Architecture Overview

```
microbits/
├── AGENTS.md                                # Antigravity agent instructions & workspace rules
├── README.md                                # Workspace guide & documentation
│
├── .agents/skills/                          # Antigravity Skills
│   ├── microbit-container-builder/          # Manage & build the Docker test environment
│   ├── microbit-project-creator/            # Scaffold new micro:bit projects
│   ├── microbit-test-runner/                # Run & diagnose in-container tests
│   ├── microbit-makecode-guide/             # MakeCode API reference & coding patterns
│   └── microbit-board-flasher/              # Hardware flash, dist caching, rollback & serial
│
├── shared/                                  # Shared test infrastructure
│   ├── types/makecode.d.ts                  # Type definitions for MakeCode global APIs
│   └── mocks/microbit.ts                    # In-memory virtual micro:bit runtime mock
│
├── projects/                                # Independent projects & experiments
│   └── 01-blinking-heart/                   # Starter project
│       ├── main.ts                          # Copy-pasteable into MakeCode website
│       ├── main.test.ts                     # Automated Vitest unit tests
│       └── README.md                        # Project notes & instructions
│
├── dist/                                    # Compiled .hex binary cache
│   └── 01-blinking-heart/                   # Timestamp versions: <project>_<YYYY-MM-DD_HHMM>.hex
│
├── rollbacks/                               # Reversed source code from .hex files
│   └── <project>_<YYYY-MM-DD_HHMM>/         # Extracted main.ts, pxt.json, and metadata
│
├── scripts/                                 # Host automation scripts
│   ├── board.py                             # USB hardware detection, flashing, and serial
│   └── hex_converter.py                     # Reverse Universal Hex -> TypeScript (LZMA)
│
├── Dockerfile                               # Node 20 LTS testing environment
├── docker-compose.yml                       # Docker orchestration & volume mounts
└── run                                      # Universal CLI helper script
```

---

## Quick Start

### 1. Build the Docker Container Image
Build the isolated Node 20 testing container once:
```bash
./run build-image
```

### 2. Run Automated Tests
Run tests inside the Docker container:
```bash
# Test all projects
./run test

# Test a specific project
./run test 01-blinking-heart
```

### 3. Create a New Project
Scaffold a new project folder with boilerplate code, tests, and documentation:
```bash
./run new 02-digital-dice
```

---

## Physical Hardware & Deployment

### Detect Connected micro:bit
```bash
./run board
```
Detects board version (e.g. V2.2), unique board ID, DAPLink firmware version, and USB serial COM port (`/dev/cu.usbmodem*`).

### Cache Compiled Binaries (`dist/`)
Cache a compiled `.hex` file downloaded from the MakeCode editor:
```bash
# Automatically finds microbit-<project>.hex in ~/Downloads
./run cache 01-blinking-heart

# Or specify a hex file path directly
./run cache 01-blinking-heart path/to/my-code.hex
```
Saves immutable timestamp versions to `dist/<project>/<project>_<YYYY-MM-DD_HHMM>.hex` and links `latest.hex`.

### Flash Hardware via USB
```bash
./run flash 01-blinking-heart
```
Flashes the latest cached binary directly to `/Volumes/MICROBIT` and monitors DAPLink reboot.

### Reverse Convert `.hex` to `.ts` (`rollbacks/`)
Convert any MakeCode Universal Hex file back into readable TypeScript source code:
```bash
./run rollback dist/01-blinking-heart/latest.hex
```
Extracts `main.ts`, `pxt.json`, and project metadata into `rollbacks/<project>_<YYYY-MM-DD_HHMM>/`.

### Real-Time Serial Monitor
Stream live serial logs (`serial.writeLine(...)`) from the board over USB:
```bash
./run monitor
```

---

## How to Simulate on MakeCode Web

1. Open [makecode.microbit.org](https://makecode.microbit.org/) in your browser.
2. Click **New Project**.
3. Toggle the editor mode from **Blocks** to **JavaScript** (TypeScript) at the top.
4. Open your project's `main.ts` (e.g., `projects/01-blinking-heart/main.ts`), copy all code, and paste it into the editor.
5. Watch the virtual micro:bit on the left panel compile and run your code immediately!
6. Click virtual buttons (A, B, A+B), shake the board, or adjust sensor sliders to interact.

---

## Working with Antigravity AI Agents

This workspace is fully configured for Google Antigravity:
- **`AGENTS.md`**: Enforces MakeCode TypeScript rules, containerized testing, timestamp binary caching, and dedicated rollback directories.
- **Custom Skills in `.agents/skills/`**:
  - `microbit-container-builder`: Teaches the agent to manage Docker images.
  - `microbit-project-creator`: Teaches the agent to scaffold new projects.
  - `microbit-test-runner`: Teaches the agent how to run tests and self-correct on failure.
  - `microbit-makecode-guide`: Provides complete MakeCode API definitions and patterns.
  - `microbit-board-flasher`: Handles board detection, caching, flashing, rollbacks, and serial monitoring.

