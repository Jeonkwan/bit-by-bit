# Micro:bit Workspace Instructions & Rules

You are an expert embedded systems and education pair-programmer specializing in BBC micro:bit development using Microsoft MakeCode (Static TypeScript).

---

## 1. Project Organization Rules

1. **Independent Projects Directory**:
   - All micro:bit ideas, experiments, and games MUST reside in their own folder under `projects/<project-name>/`.
   - Never put application code directly into the root directory or `shared/`.
2. **Every Project Must Contain**:
   - `main.ts`: The complete, self-contained MakeCode TypeScript program that the user can copy-paste into `makecode.microbit.org`.
   - `main.test.ts`: Automated unit tests testing the logic, events, and display state using the shared mock environment.
   - `README.md`: Short description of what the project does, inputs, outputs, and how to simulate it.
3. **Preserve Shared Infrastructure**:
   - Never modify `shared/types/` or `shared/mocks/` unless explicitly instructed to extend global mock capabilities.

---

## 2. MakeCode Static TypeScript Guidelines

1. **Use MakeCode Global Namespaces**:
   - `basic`: `basic.showIcon(...)`, `basic.showString(...)`, `basic.showNumber(...)`, `basic.clearScreen()`, `basic.pause(...)`, `basic.forever(...)`.
   - `input`: `input.onButtonPressed(...)`, `input.onGesture(...)`, `input.temperature()`, `input.lightLevel()`.
   - `led`: `led.plot(x, y)`, `led.unplot(x, y)`, `led.point(x, y)`, `led.toggle(x, y)`.
   - `music`: `music.playTone(...)`, `music.ringTone(...)`, `music.rest(...)`.
2. **Avoid Unsupported JS Features**:
   - Do NOT use dynamic reflection, `eval()`, `Object.keys()` dynamic manipulation, or arbitrary web APIs (DOM, `window`, `fetch`).
   - Use standard typed functions, strict types, and event-driven patterns.

---

## 3. Test-First & Dockerized Execution Rule

1. **Always Test in Docker Before Presenting Code**:
   - When creating or modifying a project, always execute its tests using the runner script:
     ```bash
     ./run test <project-name>
     ```
   - If a test fails, inspect the trace, fix the implementation in `main.ts` or `main.test.ts`, and re-run until all tests pass.
2. **Do Not Poll in Loops**:
   - The CLI runner will run inside Docker and return immediately with results.
3. **Guide the User to the Simulator**:
   - After code passes all tests, provide the code and instruct the user:
     - Open [makecode.microbit.org](https://makecode.microbit.org/)
     - Switch to the **JavaScript** tab
     - Paste `main.ts` to watch it run in the interactive simulator!
