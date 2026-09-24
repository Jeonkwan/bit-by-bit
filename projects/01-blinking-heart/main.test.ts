import { describe, it, expect, beforeEach } from 'vitest';
import { microbit, IconNames, Button } from '@shared/mocks/microbit';
import * as app from './main';

describe('01-Blinking-Heart Project', () => {
    beforeEach(() => {
        microbit.reset();
        // Re-register events from main.ts
        input.onButtonPressed(Button.A, () => app.toggleHeart());
        input.onButtonPressed(Button.B, () => app.clearDisplay());
    });

    it('toggles heart on Button A press', () => {
        // First press toggles to small heart
        microbit.input.pressButton(Button.A);
        expect(microbit.lastIcon).toBe(IconNames.SmallHeart);

        // Second press toggles back to big heart
        microbit.input.pressButton(Button.A);
        expect(microbit.lastIcon).toBe(IconNames.Heart);
    });

    it('clears screen on Button B press', () => {
        // Turn on an LED
        microbit.led.plot(2, 2);
        expect(microbit.led.point(2, 2)).toBe(true);

        // Press B
        microbit.input.pressButton(Button.B);

        // Verify screen cleared
        expect(microbit.led.point(2, 2)).toBe(false);
    });
});
