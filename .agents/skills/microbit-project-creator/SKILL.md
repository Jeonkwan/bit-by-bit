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
- **NEVER use `export` or `import` in `main.ts`**: MakeCode compiles all files in a single project scope where all top-level symbols are implicitly global. Adding `export` causes MakeCode to fail with:
  *"all symbols in the top level scope are always exported. Please use a namespace if you want to export only some."*
- Declare top-level variables and functions directly:
  ```typescript
  let counter = 0;
  function updateScore() {
      counter += 1;
      basic.showNumber(counter);
  }
  ```
- Attach event handlers using `input.onButtonPressed`, `input.onGesture`, etc.
- Set initial display with `basic.showIcon` or `basic.showString`.

### 4. Write Comprehensive Unit Tests in `main.test.ts`
Simulate how real micro:bit hardware boots up using `vi.resetModules()` and dynamic `import('./main')`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { microbit, Button, IconNames } from '@shared/mocks/microbit';
import { validateMakeCodeFile } from '@shared/testing/makecode-validator';

describe('Project Logic', () => {
    beforeEach(async () => {
        microbit.reset();
        vi.resetModules();
        await import('./main');
    });

    it('is valid MakeCode TypeScript (no top-level exports or imports)', () => {
        const result = validateMakeCodeFile(new URL('./main.ts', import.meta.url).pathname);
        expect(result.errors).toEqual([]);
        expect(result.valid).toBe(true);
    });

    it('handles button A press', () => {
        microbit.input.pressButton(Button.A);
        expect(microbit.basic.lastString).toBe('A');
    });
});
```
Test:
- MakeCode compatibility (no `export` / `import` statements).
- Initial state on boot (`microbit.lastIcon`, `microbit.lastString`).
- Event responses (`microbit.input.pressButton(Button.A)`).
- Visual outputs (`microbit.lastIcon`, `microbit.lastString`, `microbit.led.point(x, y)`).

### 5. Run & Verify Tests
Run the project's tests and lint checks inside Docker:
```bash
./run test <project-name>
./run lint
./run typecheck
```
Only conclude once all checks pass!
