export enum IconNames {
    Heart = 0,
    SmallHeart = 1,
    Yes = 2,
    No = 3,
    Happy = 4,
    Sad = 5,
    Confused = 6,
    Angry = 7,
    Asleep = 8,
    Surprised = 9,
    Silly = 10,
    Fabulous = 11,
    Meh = 12,
    TShirt = 13,
    RollerSkate = 14,
    Duck = 15,
    House = 16,
    Tortoise = 17,
    Butterfly = 18,
    StickFigure = 19,
    Ghost = 20,
    Sword = 21,
    Giraffe = 22,
    Skull = 23,
    Umbrella = 24,
    Snake = 25,
    Rabbit = 26,
    Cow = 27,
    QuarterNote = 28,
    EighthNote = 29,
    Pitchfork = 30,
    Target = 31,
    Triangle = 32,
    LeftTriangle = 33,
    Chessboard = 34,
    Diamond = 35,
    SmallDiamond = 36,
    Square = 37,
    SmallSquare = 38,
    Scissors = 39,
}

export enum Button {
    A = 1,
    B = 2,
    AB = 3,
}

export enum Gesture {
    Shake = 11,
    LogoUp = 1,
    LogoDown = 2,
    ScreenUp = 3,
    ScreenDown = 4,
    TiltLeft = 5,
    TiltRight = 6,
    FreeFall = 7,
    ThreeG = 8,
    SixG = 9,
    EightG = 10,
}

export class MockMicroBit {
    public Button = Button;
    public IconNames = IconNames;
    public Gesture = Gesture;

    public screen: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));
    public buttonHandlers: Map<Button, Array<() => void>> = new Map();
    public gestureHandlers: Map<Gesture, Array<() => void>> = new Map();
    public foreverHandlers: Array<() => void> = [];

    // History and telemetry
    public lastIcon: IconNames | null = null;
    public lastString: string | null = null;
    public lastNumber: number | null = null;
    public stringHistory: string[] = [];
    public iconHistory: IconNames[] = [];
    public numberHistory: number[] = [];
    public tonesPlayed: Array<{ frequency: number; duration: number }> = [];

    // State sensors
    public currentTemperature: number = 21;
    public currentLightLevel: number = 128;
    public currentCompassHeading: number = 0;
    public buttonState: Map<Button, boolean> = new Map([
        [Button.A, false],
        [Button.B, false],
        [Button.AB, false],
    ]);

    public reset() {
        this.screen = Array.from({ length: 5 }, () => Array(5).fill(0));
        this.buttonHandlers.clear();
        this.gestureHandlers.clear();
        this.foreverHandlers = [];
        this.lastIcon = null;
        this.lastString = null;
        this.lastNumber = null;
        this.stringHistory = [];
        this.iconHistory = [];
        this.numberHistory = [];
        this.tonesPlayed = [];
        this.currentTemperature = 21;
        this.currentLightLevel = 128;
        this.currentCompassHeading = 0;
        this.buttonState.set(Button.A, false);
        this.buttonState.set(Button.B, false);
        this.buttonState.set(Button.AB, false);
    }

    // --- Mock namespaces ---
    public basic = {
        showIcon: (icon: IconNames) => {
            this.lastIcon = icon;
            this.iconHistory.push(icon);
        },
        showString: (text: string) => {
            this.lastString = text;
            this.stringHistory.push(text);
        },
        showNumber: (num: number) => {
            this.lastNumber = num;
            this.numberHistory.push(num);
        },
        get lastIcon(): IconNames | null {
            return microbit.lastIcon;
        },
        get lastString(): string | null {
            return microbit.lastString;
        },
        get lastNumber(): number | null {
            return microbit.lastNumber;
        },
        showLeds: (pattern: string) => {
            const rows = pattern.trim().split('\n');
            for (let y = 0; y < Math.min(5, rows.length); y++) {
                const chars = rows[y].trim().replace(/\s+/g, '');
                for (let x = 0; x < Math.min(5, chars.length); x++) {
                    this.screen[y][x] = chars[x] === '#' ? 255 : 0;
                }
            }
        },
        clearScreen: () => {
            this.screen = Array.from({ length: 5 }, () => Array(5).fill(0));
        },
        pause: (_millis: number) => {
            // No-op in synchronous testing
        },
        forever: (handler: () => void) => {
            this.foreverHandlers.push(handler);
        },
    };

    public input = {
        onButtonPressed: (button: Button, handler: () => void) => {
            const handlers = this.buttonHandlers.get(button) || [];
            handlers.push(handler);
            this.buttonHandlers.set(button, handlers);
        },
        onGesture: (gesture: Gesture, handler: () => void) => {
            const handlers = this.gestureHandlers.get(gesture) || [];
            handlers.push(handler);
            this.gestureHandlers.set(gesture, handlers);
        },
        buttonIsPressed: (button: Button) => {
            return this.buttonState.get(button) || false;
        },
        temperature: () => this.currentTemperature,
        lightLevel: () => this.currentLightLevel,
        compassHeading: () => this.currentCompassHeading,
        acceleration: (_dimension: string) => 0,

        // Test helper trigger methods
        pressButton: (button: Button) => {
            this.buttonState.set(button, true);
            const handlers = this.buttonHandlers.get(button) || [];
            for (const h of handlers) {
                h();
            }
            this.buttonState.set(button, false);
        },
        triggerGesture: (gesture: Gesture) => {
            const handlers = this.gestureHandlers.get(gesture) || [];
            for (const h of handlers) {
                h();
            }
        },
    };

    public led = {
        plot: (x: number, y: number) => {
            if (x >= 0 && x < 5 && y >= 0 && y < 5) this.screen[y][x] = 255;
        },
        unplot: (x: number, y: number) => {
            if (x >= 0 && x < 5 && y >= 0 && y < 5) this.screen[y][x] = 0;
        },
        point: (x: number, y: number) => {
            if (x >= 0 && x < 5 && y >= 0 && y < 5) return this.screen[y][x] > 0;
            return false;
        },
        toggle: (x: number, y: number) => {
            if (x >= 0 && x < 5 && y >= 0 && y < 5) {
                this.screen[y][x] = this.screen[y][x] > 0 ? 0 : 255;
            }
        },
        brightness: () => 255,
        setBrightness: (_val: number) => {},
        plotBarGraph: (_value: number, _high: number) => {},
    };

    public music = {
        playTone: (frequency: number, duration: number) => {
            this.tonesPlayed.push({ frequency, duration });
        },
        ringTone: (frequency: number) => {
            this.tonesPlayed.push({ frequency, duration: 0 });
        },
        rest: (_duration: number) => {},
    };

    public control = {
        millis: () => Date.now(),
        reset: () => this.reset(),
    };

    // Helper: Run all registered forever() loops once
    public stepForever() {
        for (const handler of this.foreverHandlers) {
            handler();
        }
    }
}

export const microbit = new MockMicroBit();
