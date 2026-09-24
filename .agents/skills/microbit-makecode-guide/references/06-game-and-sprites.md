# MakeCode API: 2D Game & Sprites (`game.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/game](https://makecode.microbit.org/reference/game)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/game.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/game.md)
- **Supported Hardware**: BBC micro:bit V1 and V2

---

## Overview
The `game` namespace provides a complete 2D sprite engine on the 5x5 LED screen, complete with sprite coordinates, heading angles, edge bouncing, collision detection, health lives, scores, countdown timers, and built-in game-over screens.

---

## API Signatures & Methods

### 1. Sprite Creation & Movement
- **`game.createSprite(x: number, y: number): game.LedSprite`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/create-sprite](https://makecode.microbit.org/reference/game/create-sprite)
  - Creates a blinking LED sprite at coordinates `(x, y)` facing right (direction 90°).
  ```typescript
  let player = game.createSprite(2, 4);
  ```
- **`sprite.move(leds: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/move](https://makecode.microbit.org/reference/game/move)
  - Moves the sprite forward by `leds` steps in its current heading direction.
- **`sprite.turn(direction: Direction, degrees: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/turn](https://makecode.microbit.org/reference/game/turn)
  - Turns sprite heading `Direction.Right` or `Direction.Left` by `degrees` (e.g. 45°, 90°, 180°).
- **`sprite.ifOnEdgeBounce(): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/if-on-edge-bounce](https://makecode.microbit.org/reference/game/if-on-edge-bounce)
  - If the sprite touches an outer boundary (x < 0, x > 4, y < 0, y > 4), it reflects its heading angle.
- **`sprite.delete(): void`**
  - Removes the sprite from the screen.

---

### 2. Coordinates & Properties
- **`sprite.get(property: LedgerSpriteProperty): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/get](https://makecode.microbit.org/reference/game/get)
  - Properties: `LedSpriteProperty.X`, `Y`, `Direction`, `Brightness`, `Blink`.
- **`sprite.set(property: LedSpriteProperty, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/set](https://makecode.microbit.org/reference/game/set)
- **`sprite.change(property: LedSpriteProperty, value: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/change](https://makecode.microbit.org/reference/game/change)
  - Adds `value` to the property (e.g. `sprite.change(LedSpriteProperty.X, 1)`).

---

### 3. Collisions
- **`sprite.isTouching(other: game.LedSprite): boolean`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/is-touching](https://makecode.microbit.org/reference/game/is-touching)
  - Returns `true` if this sprite occupies the same coordinate as `other`.
- **`sprite.isTouchingEdge(): boolean`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/is-touching-edge](https://makecode.microbit.org/reference/game/is-touching-edge)
  - Returns `true` if sprite is on any border LED.

---

### 4. Score, Lives & Game Loop
- **`game.addScore(points: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/add-score](https://makecode.microbit.org/reference/game/add-score)
- **`game.score(): number`**
  - Returns current player score.
- **`game.setLife(lives: number): void`** / **`game.removeLife(life: number): void`**
  - Tracks player lives; triggers automatic game over when lives reach 0.
- **`game.startCountdown(ms: number): void`**
  - Starts a background countdown timer that triggers game over on expiration.
- **`game.gameOver(): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/game/game-over](https://makecode.microbit.org/reference/game/game-over)
  - Plays game over sound, scrolls "GAMEOVER", displays the final score, and restarts.
- **`game.isGameOver(): boolean`**
  - Returns `true` if game has ended.
