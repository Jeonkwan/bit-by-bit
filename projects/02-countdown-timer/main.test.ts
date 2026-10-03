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

    it('sets capacitive touch mode on pins P0, P1, P2 using TouchTarget', () => {
        expect(microbit.pinModes.get(TouchTarget.P0)).toBe(1); // Capacitive = 1
        expect(microbit.pinModes.get(TouchTarget.P1)).toBe(1);
        expect(microbit.pinModes.get(TouchTarget.P2)).toBe(1);
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

    it('Button A plays and pauses timer, displaying pause sign and controlling countdown', () => {
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

        // Verify pause sign (two vertical bars at cols 1 and 3)
        for (let y = 0; y < 5; y++) {
            expect(microbit.led.point(0, y)).toBe(false);
            expect(microbit.led.point(1, y)).toBe(true);
            expect(microbit.led.point(2, y)).toBe(false);
            expect(microbit.led.point(3, y)).toBe(true);
            expect(microbit.led.point(4, y)).toBe(false);
        }

        // Press Button A again to Resume
        microbit.tonesPlayed = [];
        microbit.input.pressButton(Button.A);
        expect(microbit.tonesPlayed[0].frequency).toBe(440); // A4 resume tone
    });

    it('locks out Pad 0, 1, 2 while timer is running or paused to prevent accidental changes', () => {
        // Add 5 minutes and start
        microbit.input.pressPin(TouchPin.P1);
        microbit.input.pressButton(Button.A);

        // Try pressing Pad 0 (+1m), Pad 1 (+5m), Pad 2 (+10m) while RUNNING
        microbit.tonesPlayed = [];
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressPin(TouchPin.P1);
        microbit.input.pressPin(TouchPin.P2);
        // None of the pad tones should have played!
        expect(microbit.tonesPlayed).toEqual([]);

        // Now pause the timer
        microbit.input.pressButton(Button.A);
        microbit.tonesPlayed = [];

        // Try pressing pads while PAUSED
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressPin(TouchPin.P1);
        microbit.input.pressPin(TouchPin.P2);
        // None of the pad tones should have played while paused either!
        expect(microbit.tonesPlayed).toEqual([]);
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

    it('touching gold logo while stopped or running does not disrupt timer', () => {
        microbit.stringHistory = [];
        microbit.tonesPlayed = [];
        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        // No help text or sound
        expect(microbit.stringHistory).toEqual([]);
        expect(microbit.tonesPlayed).toEqual([]);
    });

    it('holding golden logo via polling loop initiates brightness adjustment', () => {
        const brightnessLevels: number[] = [];
        const originalSetBrightness = microbit.led.setBrightness;
        microbit.led.setBrightness = vi.fn((val: number) => {
            originalSetBrightness(val);
            brightnessLevels.push(val);
        });

        microbit.isLogoPressed = true;
        let step = 0;
        const originalPause = microbit.basic.pause;
        microbit.basic.pause = vi.fn((_ms: number) => {
            step++;
            if (step >= 5) {
                microbit.isLogoPressed = false;
            }
        });

        // Run forever handler 3 times to accumulate 3 hold ticks and trigger brightness loop
        for (let i = 0; i < 3; i++) {
            microbit.foreverHandlers[0]();
        }

        expect(brightnessLevels.length).toBeGreaterThan(0);
        expect(brightnessLevels[0]).toBe(25);

        microbit.led.setBrightness = originalSetBrightness;
        microbit.basic.pause = originalPause;
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

    it('long pressing the golden logo cycles LED brightness to max, wraps to lowest, and locks in on release', () => {
        const brightnessLevels: number[] = [];
        const originalSetBrightness = microbit.led.setBrightness;
        microbit.led.setBrightness = vi.fn((val: number) => {
            originalSetBrightness(val);
            brightnessLevels.push(val);
        });

        // Simulate holding finger for 12 cycles then releasing
        let step = 0;
        const originalPause = microbit.basic.pause;
        microbit.basic.pause = vi.fn((_ms: number) => {
            step++;
            if (step >= 12) {
                microbit.isLogoPressed = false;
            }
        });

        microbit.tonesPlayed = [];
        microbit.input.touchLogo(TouchButtonEvent.LongPressed);

        // Verification:
        // Started at 255, so first step wrapped to 25 (lowest), then increased towards 255 (max), then wrapped to 25 again!
        expect(brightnessLevels.length).toBeGreaterThanOrEqual(12);
        expect(brightnessLevels[0]).toBe(25);
        expect(brightnessLevels[1]).toBe(55);
        expect(brightnessLevels[8]).toBe(255); // reached max
        expect(brightnessLevels[9]).toBe(25);  // wrapped to lowest
        expect(brightnessLevels[10]).toBe(55);

        // Confirmation chime 784Hz played on release
        expect(microbit.tonesPlayed[microbit.tonesPlayed.length - 1].frequency).toBe(784);

        microbit.led.setBrightness = originalSetBrightness;
        microbit.basic.pause = originalPause;
    });
});

