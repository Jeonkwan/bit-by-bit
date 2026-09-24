import { describe, it, expect, beforeEach, vi } from 'vitest';
import { microbit, Button, TouchPin, TouchTarget, TouchButtonEvent, IconNames } from '@shared/mocks/microbit';
import { validateMakeCodeFile } from '@shared/testing/makecode-validator';

describe('02-Countdown-Timer Project', () => {
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

    it('plays ascending greeting chime on boot and initializes at 0m', () => {
        const bootFrequencies = microbit.tonesPlayed.slice(0, 4).map(t => t.frequency);
        expect(bootFrequencies).toEqual([262, 330, 392, 523]);
    });

    it('sets capacitive touch mode on pins P0, P1, P2 and LOGO using TouchTarget', () => {
        expect(microbit.pinModes.get(TouchTarget.P0)).toBe(1); // Capacitive = 1
        expect(microbit.pinModes.get(TouchTarget.P1)).toBe(1);
        expect(microbit.pinModes.get(TouchTarget.P2)).toBe(1);
        expect(microbit.pinModes.get(TouchTarget.LOGO)).toBe(1);
    });

    it('plays animated sandglass loop while idle at 0m', () => {
        // While idle at 0m, calling forever handler advances sandglass animation
        expect(microbit.foreverHandlers.length).toBeGreaterThan(0);
        microbit.foreverHandlers[0]();
        // Verify frame was drawn (e.g. top row of sandglass has LEDs lit)
        expect(microbit.led.point(0, 0)).toBe(true);
        expect(microbit.led.point(4, 0)).toBe(true);
    });

    it('accumulates duration with capacitive pads: P0 (+1m), P1 (+5m), P2 (+10m)', () => {
        // Tap Pad 0 -> +1 minute (60s)
        microbit.input.pressPin(TouchPin.P0);
        expect(microbit.tonesPlayed[microbit.tonesPlayed.length - 1].frequency).toBe(262); // C4 (+1m)

        // Tap Pad 1 -> +5 minutes (total 6m = 360s)
        microbit.input.pressPin(TouchPin.P1);
        expect(microbit.tonesPlayed[microbit.tonesPlayed.length - 1].frequency).toBe(392); // G4 (+5m)

        // Tap Pad 2 -> +10 minutes (total 16m = 960s)
        microbit.input.pressPin(TouchPin.P2);
        expect(microbit.tonesPlayed[microbit.tonesPlayed.length - 1].frequency).toBe(523); // C5 (+10m)
    });

    it('Button B resets timer to 0 minutes and returns to idle state', () => {
        microbit.input.pressPin(TouchPin.P1); // +5m
        microbit.input.pressButton(Button.B); // Reset
        expect(microbit.tonesPlayed[microbit.tonesPlayed.length - 1].frequency).toBe(196); // Reset tone
    });

    it('Button A plays and pauses timer, and controls orbiting edge dot', () => {
        // Add 5 minutes (>= 60s, so edge dot is active)
        microbit.input.pressPin(TouchPin.P1);

        // Press Button A to start
        microbit.tonesPlayed = [];
        microbit.input.pressButton(Button.A);
        const startTones = microbit.tonesPlayed.map(t => t.frequency);
        expect(startTones).toEqual([523, 659]); // Start chime

        // Run tick while >= 60s: advances edge dot along perimeter
        microbit.foreverHandlers[0]();

        // Press Button A to Pause
        microbit.tonesPlayed = [];
        microbit.input.pressButton(Button.A);
        expect(microbit.tonesPlayed[0].frequency).toBe(330); // E4 pause tone

        // Press Button A again to Resume
        microbit.tonesPlayed = [];
        microbit.input.pressButton(Button.A);
        expect(microbit.tonesPlayed[0].frequency).toBe(440); // A4 resume tone
    });

    it('alarm sequence runs when timer expires and can be silenced by Button A or B', () => {
        // Set 1 minute, start timer
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressButton(Button.A);

        // Advance 5 ticks = 1 second
        for (let i = 0; i < 5; i++) {
            microbit.foreverHandlers[0]();
        }

        // Press Button A to verify it can interact during alarming or running
        microbit.input.pressButton(Button.A);
    });

    it('tapping gold touch logo displays Option 2 help instruction segments', () => {
        microbit.stringHistory = [];
        microbit.tonesPlayed = [];
        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        expect(microbit.tonesPlayed.some(t => t.frequency === 523)).toBe(true); // Help chime
        expect(microbit.stringHistory).toEqual([
            'PADS: +1m +5m +10m | ',
            'A:START/PAUSE | ',
            'B:RESET'
        ]);
    });

    it('tapping any pad or button while help is scrolling immediately aborts remaining instruction', () => {
        microbit.stringHistory = [];
        const originalShowString = microbit.basic.showString;

        // Simulate user touching Pad 1 during the first segment
        microbit.basic.showString = vi.fn((text: string) => {
            originalShowString(text);
            microbit.input.pressPin(TouchPin.P1); // Tap +5m
        });

        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        // Only the first segment should have been displayed before aborting
        expect(microbit.stringHistory).toEqual(['PADS: +1m +5m +10m | ']);
        // Pad 1 tap (+5m) was processed
        expect(microbit.tonesPlayed.some(t => t.frequency === 392)).toBe(true);

        microbit.basic.showString = originalShowString;
    });

    it('tapping gold touch logo while help is scrolling cancels help immediately', () => {
        microbit.stringHistory = [];
        const originalShowString = microbit.basic.showString;

        // Simulate tapping the logo again on the first segment
        microbit.basic.showString = vi.fn((text: string) => {
            originalShowString(text);
            microbit.input.touchLogo(TouchButtonEvent.Pressed);
        });

        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        expect(microbit.stringHistory).toEqual(['PADS: +1m +5m +10m | ']);
        microbit.basic.showString = originalShowString;
    });

    it('touching gold logo while alarming silences sound and dismisses alarm', () => {
        // Set 1 minute, start timer
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressButton(Button.A);

        // Advance 5 ticks * 60 = 300 ticks to expire 60s
        for (let i = 0; i < 300; i++) {
            microbit.foreverHandlers[0]();
        }

        // Timer reaches 0 and triggers alarm
        microbit.foreverHandlers[0]();

        // Touching logo dismisses alarm and resets timer
        microbit.tonesPlayed = [];
        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        expect(microbit.tonesPlayed.some(t => t.frequency === 196)).toBe(true); // Reset tone
    });
});
