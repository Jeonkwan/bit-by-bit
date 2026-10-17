import {
    microbit,
    DetectedSound,
    SoundThreshold,
    IconNames,
    Button,
    Gesture,
    DigitalPin,
    AnalogPin,
    TouchPin,
    TouchTarget,
    TouchTargetMode,
    TouchButtonEvent,
    Direction,
    LedSpriteProperty,
} from './microbit';

// Expose microbit globals for unit tests
(globalThis as any).basic = microbit.basic;
(globalThis as any).input = microbit.input;
(globalThis as any).led = microbit.led;
(globalThis as any).music = microbit.music;
(globalThis as any).radio = microbit.radio;
(globalThis as any).game = microbit.game;
(globalThis as any).pins = microbit.pins;
(globalThis as any).serial = microbit.serial;
(globalThis as any).control = microbit.control;

(globalThis as any).DetectedSound = DetectedSound;
(globalThis as any).SoundThreshold = SoundThreshold;
(globalThis as any).IconNames = IconNames;
(globalThis as any).Button = Button;
(globalThis as any).Gesture = Gesture;
(globalThis as any).DigitalPin = DigitalPin;
(globalThis as any).AnalogPin = AnalogPin;
(globalThis as any).TouchPin = TouchPin;
(globalThis as any).TouchTarget = TouchTarget;
(globalThis as any).TouchTargetMode = TouchTargetMode;
(globalThis as any).TouchButtonEvent = TouchButtonEvent;
(globalThis as any).Direction = Direction;
(globalThis as any).LedSpriteProperty = LedSpriteProperty;
(globalThis as any).randint = (min: number, max: number) => microbit.randint(min, max);
