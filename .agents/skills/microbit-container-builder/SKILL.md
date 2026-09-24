---
name: microbit-container-builder
description: >-
  Build, rebuild, verify, and manage the Docker container image for testing and developing micro:bit projects.
  Use when the user asks to build or rebuild the Docker image, setup or check the testing container, or troubleshoot container build issues.
---

# Micro:bit Container Builder

This skill instructs the agent on building, checking, and updating the Dockerized micro:bit test and runtime environment.

## When to Use
- Initial repository setup.
- When `package.json` or `Dockerfile` has changed.
- When the user asks to "build container", "prepare docker", "rebuild image", or "check container environment".

## Procedure

### 1. Check Docker Daemon Status
Verify that Docker is accessible:
```bash
docker ps
```
If Docker is not running, prompt the user to start Docker Desktop.

### 2. Build or Rebuild Image
Execute the build command via the runner script:
```bash
./run build-image
```
Alternatively:
```bash
docker compose build test
```

### 3. Verify Container Image
Run a smoke test to confirm the container can execute TypeScript and Vitest:
```bash
./run typecheck
```
If this command exits with code `0`, the container environment is healthy and ready for test execution.
