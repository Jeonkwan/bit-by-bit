import { describe, it, expect, beforeEach, vi } from 'vitest';
import { microbit, IconNames, Button } from '@shared/mocks/microbit';
import { validateMakeCodeFile } from '@shared/testing/makecode-validator';

describe('01-Blinking-Heart Project', () => {
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

    it('shows big heart on initial startup', () => {
        expect(microbit.lastIcon).toBe(IconNames.Heart);
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
