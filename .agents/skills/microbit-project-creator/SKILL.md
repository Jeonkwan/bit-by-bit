---
name: microbit-project-creator
description: >-
  Scaffold and configure new micro:bit projects with MakeCode TypeScript code, automated Vitest unit tests, and user documentation.
  Use whenever the user wants to create a new micro:bit game, experiment, sensor gadget, or idea.
---

# Micro:bit Project Creator

This skill guides the agent in creating a new micro:bit project within the multi-project workspace.

## Steps

### 1. Choose Project Name
Use a numbered or descriptive kebab-case identifier, e.g.:
- `02-digital-dice`
- `03-reaction-timer`
- `04-step-counter`

### 2. Scaffold Folder Structure
Run the built-in scaffolding command:
```bash
./run new <project-name>
```
This automatically produces:
- `projects/<project-name>/main.ts`
- `projects/<project-name>/main.test.ts`
- `projects/<project-name>/README.md`

### 3. Implement the Logic in `main.ts`
Write idiomatic MakeCode TypeScript:
- Export state and handler functions so they can be directly imported and exercised by unit tests.
- Attach event handlers using `input.onButtonPressed`, `input.onGesture`, etc.
- Set initial display with `basic.showIcon` or `basic.showString`.

### 4. Write Comprehensive Unit Tests in `main.test.ts`
Test:
- Initial state on boot.
- Event responses (`microbit.input.pressButton(Button.A)`).
- Visual outputs (`microbit.lastIcon`, `microbit.lastString`, `microbit.led.point(x, y)`).

### 5. Run & Verify Tests
Run the project's tests inside Docker:
```bash
./run test <project-name>
```
Only proceed once all tests pass!
