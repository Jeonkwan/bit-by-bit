---
name: microbit-test-runner
description: >-
  Execute automated tests for micro:bit projects inside the Docker container environment and interpret results.
  Use when running unit tests, verifying bug fixes, running regression suites, or diagnosing test failures.
---

# Micro:bit Test Runner

This skill guides the agent in running automated tests across micro:bit projects inside Docker.

## Commands

### 1. Test a Specific Project
```bash
./run test <project-name>
```
*Example:*
```bash
./run test 01-blinking-heart
```

### 2. Test All Projects
```bash
./run test
```

### 3. Container Lifecycle & Cleanup
- The `./run` script automatically adds `--rm` to all `docker compose run` calls. This ensures every test container is cleanly removed immediately upon exit and no exited containers pile up.
- If running raw docker commands manually, ALWAYS pass `--rm`.
- Code changes in `projects/` are immediately mounted live—do NOT rebuild the container image when editing code.

### 4. Run Static Type Checking
```bash
./run typecheck
```

## Diagnosing Test Failures
- **Assertion Failure on Icon**:
  Check `microbit.lastIcon` vs `IconNames.<Target>`. Ensure the button handler was triggered properly.
- **LED Pixel Check**:
  Use `microbit.led.point(x, y)` to verify if coordinate `(x, y)` is turned on (`true`) or off (`false`). Coordinates range from `0` to `4`.
- **String / Number output**:
  Check `microbit.lastString` or `microbit.lastNumber`.
