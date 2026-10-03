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
3. **CRITICAL: NEVER Use `export` or `import` in `main.ts`**:
   - In MakeCode, all top-level symbols (variables, functions, classes) are implicitly global within the project.
   - Using `export` at the top level causes MakeCode compilation error:
     `"all symbols in the top level scope are always exported. Please use a namespace if you want to export only some."`
   - Never write `export` or `import` in `main.ts`. Write plain top-level variables and functions:
     ```typescript
     let isBigHeart = true;
     function toggleHeart() { ... }
     ```
   - In `main.test.ts`, do NOT use named imports from `./main`. Instead, simulate how real micro:bit hardware boots up:
     ```typescript
     beforeEach(async () => {
         microbit.reset();
         vi.resetModules();
         await import('./main');
     });
     ```
   - Always include the MakeCode validation test in `main.test.ts`:
     ```typescript
     it('is valid MakeCode TypeScript (no top-level exports or imports)', () => {
         const result = validateMakeCodeFile(new URL('./main.ts', import.meta.url).pathname);
         expect(result.errors).toEqual([]);
         expect(result.valid).toBe(true);
     });
     ```

---

## 3. Test-First & Dockerized Execution Rule

1. **Always Test in Docker Before Presenting Code**:
   - When creating or modifying a project, always execute its tests using the runner script:
     ```bash
     ./run test <project-name>
     ```
     (Note: `./run` automatically includes the `--rm` flag to prevent accumulating exited containers).
  - Never rebuild the Docker image (`./run build-image`) for code modifications; the workspace is mounted dynamically. Rebuild only if `package.json` or `Dockerfile` changes.
  - If ever running `docker compose run` directly, always include `--rm`.
  - If a test fails, inspect the trace, fix the implementation in `main.ts` or `main.test.ts`, and re-run until all tests pass.
2. **Individual vs Suite Testing**:
  - Run `./run test <project-name>` during active development to only test the project you are working on.
  - Run `./run test` before concluding to ensure no regressions across other projects.
  - Run `./run lint` to validate MakeCode Static TypeScript rules (no exports/imports) across all projects.
  - Run `./run typecheck` to verify TypeScript types without emitting code.
3. **Do Not Poll in Loops**:
   - The CLI runner will run inside Docker and return immediately with results.
3. **Guide the User to the Simulator**:
   - After code passes all tests, provide the code and instruct the user:
     - Open [makecode.microbit.org](https://makecode.microbit.org/)
     - Switch to the **JavaScript** tab
     - Paste `main.ts` to watch it run in the interactive simulator!

---

## 4. Compilation, Hardware Deployment & Hex Rollbacks

1. **Containerized MakeCode Compilation & Binary Caching (`dist/`)**:
   - Compile TypeScript to Universal Hex (`.hex`) inside Docker and auto-cache:
     ```bash
     ./run compile <project-name>
     ```
   - Automatically outputs timestamp version `dist/<project>/<project>_<YYYY-MM-DD_HHMM>.hex` and `dist/<project>/latest.hex`.
   - Embeds original source code with LZMA compression into Intel HEX custom 0x0D records for full reversibility.
2. **Board Detection & Hardware Status**:
   - Detect connected physical micro:bit boards via `./run board`.
   - Reads `DETAILS.TXT` to determine board version (e.g. V2.2), unique board ID, DAPLink version, and serial COM port (`/dev/cu.usbmodem*`).
3. **Flashing Hardware**:
   - Flash cached project binaries to connected micro:bits via:
     ```bash
     ./run flash <project-name>
     ```
   - Safely streams binary chunks without extended attributes and monitors DAPLink reboot cycles.
4. **Hex to TypeScript Rollback Extraction (`rollbacks/`)**:
   - Convert MakeCode Universal Hex files back into original `.ts` source code inside Docker:
     ```bash
     ./run rollback <path-to-hex-file> [project-name]
     ```
   - All rollback conversions MUST be output into a dedicated rollback directory with the format:
     `rollbacks/<project-name>_<YYYY-MM-DD_HHMM>/`
   - Reconstructs `main.ts`, `pxt.json`, and `metadata.json` directly from MakeCode's embedded LZMA compressed source chunks.
5. **Live Serial Monitor**:
   - Stream real-time telemetry and debug output from the micro:bit:
     ```bash
     ./run monitor [baud-rate]
     ```


