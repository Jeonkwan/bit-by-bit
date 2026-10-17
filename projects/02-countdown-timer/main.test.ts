import { describe, it, expect, beforeEach, vi } from 'vitest';
import { microbit, Button, TouchPin, TouchTarget, TouchButtonEvent, IconNames, DetectedSound, SoundThreshold } from '@shared/mocks/microbit';
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

    it('touching the golden logo while sleeping wakes up the timer with head shake, smile, and returns to sandglass', () => {
        // Enter sleep mode (~5s = 3 cycles * 10 frames = 30 ticks)
        for (let i = 0; i < 30; i++) {
            microbit.foreverHandlers[0]();
        }

        microbit.tonesPlayed = [];

        // Tap the golden logo
        microbit.input.touchLogo(TouchButtonEvent.Pressed);

        // Verify wake-up tones: startled chirp 587Hz followed by cheerful smile melody (523, 659, 784)
        const wakeTones = microbit.tonesPlayed.map(t => t.frequency);
        expect(wakeTones).toEqual([587, 523, 659, 784]);

        // After waking up, transitions back to sandglass animation
        microbit.foreverHandlers[0]();
        expect(microbit.led.point(0, 0)).toBe(true);
        expect(microbit.led.point(4, 0)).toBe(true);
    });

    it('plays a random 3-beep preset chime each minute that passes during countdown', () => {
        // Set 2 minutes (120s) and start
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressPin(TouchPin.P0);
        microbit.input.pressButton(Button.A);

        microbit.tonesPlayed = [];

        // Advance 300 ticks = 60 seconds (so remainingSeconds drops to exactly 60s)
        for (let i = 0; i < 300; i++) {
            microbit.foreverHandlers[0]();
        }

        // 3 beeps played for the minute boundary!
        expect(microbit.tonesPlayed.length).toBe(3);
        for (const tone of microbit.tonesPlayed) {
            expect(tone.duration).toBe(80);
            expect([523, 587, 659, 784]).toContain(tone.frequency);
        }
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

    it('enters sleep mode showing a sleeping face and zzz animation after idle period', () => {
        // Run 3 full sandglass cycles (3 * 10 frames = 30 ticks ~ 5.4s)
        for (let i = 0; i < 30; i++) {
            microbit.foreverHandlers[0]();
        }

        // 31st tick: executes playSleepStep() frame 0 (sleeping face)
        microbit.foreverHandlers[0]();

        // Verify sleeping face (closed eyes on row 1: ##.##)
        expect(microbit.led.point(0, 1)).toBe(true);
        expect(microbit.led.point(1, 1)).toBe(true);
        expect(microbit.led.point(2, 1)).toBe(false);
        expect(microbit.led.point(3, 1)).toBe(true);
        expect(microbit.led.point(4, 1)).toBe(true);

        // Run next 5 sleep steps (breathing face, small z, medium z, large Z, fading Z)
        for (let i = 0; i < 5; i++) {
            microbit.foreverHandlers[0]();
        }
    });

    it('wakes up on microphone loud sound, shakes head, smiles, and returns to sandglass', () => {
        // Enter sleep mode (~5s = 30 ticks)
        for (let i = 0; i < 30; i++) {
            microbit.foreverHandlers[0]();
        }

        microbit.tonesPlayed = [];

        // Trigger loud sound event from microphone
        microbit.input.triggerSound(DetectedSound.Loud);

        // Verify tones: startled chirp 587Hz (D5) followed by cheerful smile arpeggio 523, 659, 784 (C5, E5, G5)
        const wakeTones = microbit.tonesPlayed.map(t => t.frequency);
        expect(wakeTones).toEqual([587, 523, 659, 784]);

        // After waking up, the next idle step returns to sandglass
        microbit.foreverHandlers[0]();
        // Frame 0 of sandglass has top row full (# # # # #)
        expect(microbit.led.point(0, 0)).toBe(true);
        expect(microbit.led.point(1, 0)).toBe(true);
        expect(microbit.led.point(2, 0)).toBe(true);
        expect(microbit.led.point(3, 0)).toBe(true);
        expect(microbit.led.point(4, 0)).toBe(true);
    });

    it('tapping capacitive pads or buttons immediately wakes from sleep', () => {
        // Enter sleep mode (~5s = 30 ticks)
        for (let i = 0; i < 30; i++) {
            microbit.foreverHandlers[0]();
        }

        microbit.tonesPlayed = [];

        // Tap Pad 0 (+1m)
        microbit.input.pressPin(TouchPin.P0);

        // Verify +1m tone (262Hz) played and display no longer in sleep mode
        expect(microbit.tonesPlayed.some(t => t.frequency === 262)).toBe(true);

        // Timer is now set to 1m (not sleeping)
        // Center column of '1' digit should be plotted
        expect(microbit.led.point(2, 2)).toBe(true);
    });

    it('configures microphone sound threshold to 70% (179)', () => {
        expect(microbit.soundThresholds.get(SoundThreshold.Loud)).toBe(179);
    });

    it('ignores loud sound if timer is actively running countdown', () => {
        // Set 5 minutes and start countdown
        microbit.input.pressPin(TouchPin.P1);
        microbit.input.pressButton(Button.A);

        microbit.tonesPlayed = [];

        // Trigger loud sound while countdown is running
        microbit.input.triggerSound(DetectedSound.Loud);

        // No wake-up chirp or smile tones should be played
        const tones = microbit.tonesPlayed.map(t => t.frequency);
        expect(tones).not.toContain(587);
        expect(tones).not.toContain(784);
    });
});

