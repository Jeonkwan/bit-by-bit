import { microbit, IconNames, Button, Gesture } from './microbit';

// Expose microbit globals for unit tests
(globalThis as any).basic = microbit.basic;
(globalThis as any).input = microbit.input;
(globalThis as any).led = microbit.led;
(globalThis as any).music = microbit.music;
(globalThis as any).control = microbit.control;
(globalThis as any).IconNames = IconNames;
(globalThis as any).Button = Button;
(globalThis as any).Gesture = Gesture;
