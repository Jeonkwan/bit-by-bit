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
│   └── microbit-makecode-guide/             # MakeCode API reference & coding patterns
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
- **`AGENTS.md`**: Enforces MakeCode TypeScript rules and requires that all code must pass `./run test <project>` in Docker before being presented to you.
- **Custom Skills in `.agents/skills/`**:
  - `microbit-container-builder`: Teaches the agent to manage Docker images.
  - `microbit-project-creator`: Teaches the agent to scaffold new projects.
  - `microbit-test-runner`: Teaches the agent how to run tests and self-correct on failure.
  - `microbit-makecode-guide`: Provides complete MakeCode API definitions and patterns.
