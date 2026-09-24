# MakeCode API: Input & Sensors (`input.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/input](https://makecode.microbit.org/reference/input)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/input.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/input.md)
- **Supported Hardware**: BBC micro:bit V1 and V2 (microphone and capacitive logo are V2 only)

---

## Overview
The `input` namespace handles all physical interactions, gestures, environmental readings, touch pins, and V2 microphone/logo sensing.

---

## API Signatures & Methods

### 1. Buttons
- **`input.onButtonPressed(button: Button, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/on-button-pressed](https://makecode.microbit.org/reference/input/on-button-pressed)
  - **Buttons**: `Button.A`, `Button.B`, `Button.AB`
  ```typescript
  input.onButtonPressed(Button.A, () => {
      basic.showString("A");
  });
  ```
- **`input.buttonIsPressed(button: Button): boolean`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/button-is-pressed](https://makecode.microbit.org/reference/input/button-is-pressed)
  - Checks if a button is currently held down.

---

### 2. Gestures & Accelerometer
- **`input.onGesture(gesture: Gesture, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/on-gesture](https://makecode.microbit.org/reference/input/on-gesture)
  - **Supported Gestures**:
    - `Gesture.Shake`
    - `Gesture.LogoUp`, `Gesture.LogoDown`
    - `Gesture.ScreenUp`, `Gesture.ScreenDown`
    - `Gesture.TiltLeft`, `Gesture.TiltRight`
    - `Gesture.FreeFall`, `Gesture.ThreeG`, `Gesture.SixG`, `Gesture.EightG`
  ```typescript
  input.onGesture(Gesture.Shake, () => {
      let dice = randint(1, 6);
      basic.showNumber(dice);
  });
  ```
- **`input.acceleration(dimension: Dimension): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/acceleration](https://makecode.microbit.org/reference/input/acceleration)
  - **Dimensions**: `Dimension.X`, `Dimension.Y`, `Dimension.Z`, `Dimension.Strength`
  - **Returns**: Acceleration in milli-g (1000 mg = 1g). Range: -2000 to +2000 mg (or up to 8000 mg if range expanded).
- **`input.rotation(kind: Rotation): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/rotation](https://makecode.microbit.org/reference/input/rotation)
  - Pitch (tilt forward/backward: -180 to 180) and Roll (tilt left/right: -180 to 180).
- **`input.setAccelerometerRange(range: AcceleratorRange): void`**
  - `AcceleratorRange.OneG`, `TwoG`, `FourG`, `EightG`.

---

### 3. Environmental Sensors
- **`input.temperature(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/temperature](https://makecode.microbit.org/reference/input/temperature)
  - **Returns**: Ambient temperature estimate in degrees Celsius (°C).
- **`input.lightLevel(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/light-level](https://makecode.microbit.org/reference/input/light-level)
  - **Returns**: Light reading from 0 (dark) to 255 (bright) measured by sensing reverse current through the LED matrix.
- **`input.compassHeading(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/compass-heading](https://makecode.microbit.org/reference/input/compass-heading)
  - **Returns**: Direction from 0 to 359 degrees (0 = North, 90 = East, 180 = South, 270 = West).
- **`input.magneticForce(dimension: Dimension): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/magnetic-force](https://makecode.microbit.org/reference/input/magnetic-force)
  - **Returns**: Magnetic field strength in micro-Teslas (µT).

---

### 4. Touch Pins
- **`input.onPinPressed(pin: TouchPin, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/on-pin-pressed](https://makecode.microbit.org/reference/input/on-pin-pressed)
  - **Pins**: `TouchPin.P0`, `TouchPin.P1`, `TouchPin.P2`
- **`input.pinIsPressed(pin: TouchPin): boolean`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/pin-is-pressed](https://makecode.microbit.org/reference/input/pin-is-pressed)

---

### 5. micro:bit V2 Specific Inputs
- **`input.onLogoEvent(action: TouchButtonEvent, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/on-logo-event](https://makecode.microbit.org/reference/input/on-logo-event)
  - **Actions**: `TouchButtonEvent.Pressed`, `TouchButtonEvent.Touched`, `TouchButtonEvent.Released`, `TouchButtonEvent.LongPressed`
  - Available only on micro:bit V2 (capacitive gold logo at top).
- **`input.logoIsPressed(): boolean`**
  - Returns `true` if the gold logo is currently touched.
- **`input.onSound(sound: DetectedSound, handler: () => void): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/on-sound](https://makecode.microbit.org/reference/input/on-sound)
  - **Sounds**: `DetectedSound.Loud`, `DetectedSound.Quiet`
  - Available on micro:bit V2 via built-in MEMS microphone.
- **`input.soundLevel(): number`**
  - **Doc URL**: [https://makecode.microbit.org/reference/input/sound-level](https://makecode.microbit.org/reference/input/sound-level)
  - Returns sound level from 0 to 255.
