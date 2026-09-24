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

export enum DigitalPin {
    P0 = 100,
    P1 = 101,
    P2 = 102,
    P8 = 108,
    P12 = 112,
    P16 = 116,
}

export enum AnalogPin {
    P0 = 100,
    P1 = 101,
    P2 = 102,
    P3 = 103,
    P4 = 104,
    P10 = 110,
}

export enum Direction {
    Right = 90,
    Left = -90,
}

export enum LedSpriteProperty {
    X = 0,
    Y = 1,
    Direction = 2,
    Brightness = 3,
    Blink = 4,
}

export class MockLedSprite {
    public x: number;
    public y: number;
    public direction: number = 90;
    public brightness: number = 255;
    public blink: number = 0;
    public isDeleted: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public move(leds: number): void {
        const rad = (this.direction * Math.PI) / 180;
        this.x = Math.round(this.x + Math.cos(rad) * leds);
        this.y = Math.round(this.y + Math.sin(rad) * leds);
    }

    public turn(direction: Direction, degrees: number): void {
        this.direction = (this.direction + (direction === Direction.Right ? degrees : -degrees)) % 360;
    }

    public ifOnEdgeBounce(): void {
        if (this.x <= 0 || this.x >= 4) {
            this.direction = (180 - this.direction) % 360;
            this.x = Math.max(0, Math.min(4, this.x));
        }
        if (this.y <= 0 || this.y >= 4) {
            this.direction = (-this.direction) % 360;
            this.y = Math.max(0, Math.min(4, this.y));
        }
    }

    public get(prop: LedSpriteProperty): number {
        switch (prop) {
            case LedSpriteProperty.X: return this.x;
            case LedSpriteProperty.Y: return this.y;
            case LedSpriteProperty.Direction: return this.direction;
            case LedSpriteProperty.Brightness: return this.brightness;
            case LedSpriteProperty.Blink: return this.blink;
        }
    }

    public set(prop: LedSpriteProperty, val: number): void {
        switch (prop) {
            case LedSpriteProperty.X: this.x = val; break;
            case LedSpriteProperty.Y: this.y = val; break;
            case LedSpriteProperty.Direction: this.direction = val; break;
            case LedSpriteProperty.Brightness: this.brightness = val; break;
            case LedSpriteProperty.Blink: this.blink = val; break;
        }
    }

    public change(prop: LedSpriteProperty, val: number): void {
        this.set(prop, this.get(prop) + val);
    }

    public isTouching(other: MockLedSprite): boolean {
        return this.x === other.x && this.y === other.y && !this.isDeleted && !other.isDeleted;
    }

    public isTouchingEdge(): boolean {
        return this.x === 0 || this.x === 4 || this.y === 0 || this.y === 4;
    }

    public delete(): void {
        this.isDeleted = true;
    }
}

export class MockMicroBit {
    public Button = Button;
    public IconNames = IconNames;
    public Gesture = Gesture;
    public DigitalPin = DigitalPin;
    public AnalogPin = AnalogPin;
    public Direction = Direction;
    public LedSpriteProperty = LedSpriteProperty;

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

    // Radio mock state
    public radioGroup: number = 0;
    public sentRadioPackets: Array<{ type: 'number' | 'string' | 'value'; payload: any; name?: string }> = [];
    public radioNumberHandlers: Array<(val: number) => void> = [];
    public radioStringHandlers: Array<(msg: string) => void> = [];
    public radioValueHandlers: Array<(name: string, val: number) => void> = [];

    // Game mock state
    public currentGameScore: number = 0;
    public currentGameLives: number = 3;
    public isGameOverState: boolean = false;
    public sprites: MockLedSprite[] = [];

    // Pins mock state
    public pinValues: Map<number, number> = new Map();
    public servoValues: Map<number, number> = new Map();

    // Serial mock state
    public serialHistory: string[] = [];

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

        this.radioGroup = 0;
        this.sentRadioPackets = [];
        this.radioNumberHandlers = [];
        this.radioStringHandlers = [];
        this.radioValueHandlers = [];

        this.currentGameScore = 0;
        this.currentGameLives = 3;
        this.isGameOverState = false;
        this.sprites = [];

        this.pinValues.clear();
        this.servoValues.clear();
        this.serialHistory = [];
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
        pause: (_millis: number) => {},
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

        // Test helpers
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
        setVolume: (_vol: number) => {},
        volume: () => 255,
        setTempo: (_bpm: number) => {},
        tempo: () => 120,
    };

    public radio = {
        setGroup: (id: number) => {
            this.radioGroup = id;
        },
        sendNumber: (num: number) => {
            this.sentRadioPackets.push({ type: 'number', payload: num });
        },
        sendString: (str: string) => {
            this.sentRadioPackets.push({ type: 'string', payload: str });
        },
        sendValue: (name: string, val: number) => {
            this.sentRadioPackets.push({ type: 'value', name, payload: val });
        },
        onReceivedNumber: (handler: (num: number) => void) => {
            this.radioNumberHandlers.push(handler);
        },
        onReceivedString: (handler: (str: string) => void) => {
            this.radioStringHandlers.push(handler);
        },
        onReceivedValue: (handler: (name: string, val: number) => void) => {
            this.radioValueHandlers.push(handler);
        },
        setTransmitPower: (_power: number) => {},

        // Test trigger helpers
        receiveNumber: (num: number) => {
            for (const h of this.radioNumberHandlers) h(num);
        },
        receiveString: (str: string) => {
            for (const h of this.radioStringHandlers) h(str);
        },
        receiveValue: (name: string, val: number) => {
            for (const h of this.radioValueHandlers) h(name, val);
        },
    };

    public game = {
        createSprite: (x: number, y: number) => {
            const sprite = new MockLedSprite(x, y);
            this.sprites.push(sprite);
            return sprite;
        },
        addScore: (points: number) => {
            this.currentGameScore += points;
        },
        score: () => this.currentGameScore,
        setScore: (score: number) => {
            this.currentGameScore = score;
        },
        setLife: (lives: number) => {
            this.currentGameLives = lives;
        },
        addLife: (lives: number) => {
            this.currentGameLives += lives;
        },
        removeLife: (lives: number) => {
            this.currentGameLives -= lives;
            if (this.currentGameLives <= 0) {
                this.isGameOverState = true;
            }
        },
        startCountdown: (_ms: number) => {},
        gameOver: () => {
            this.isGameOverState = true;
        },
        isGameOver: () => this.isGameOverState,
    };

    public pins = {
        digitalReadPin: (pin: DigitalPin) => this.pinValues.get(pin) || 0,
        digitalWritePin: (pin: DigitalPin, val: number) => {
            this.pinValues.set(pin, val);
        },
        analogReadPin: (pin: AnalogPin) => this.pinValues.get(pin) || 0,
        analogWritePin: (pin: AnalogPin, val: number) => {
            this.pinValues.set(pin, val);
        },
        servoWritePin: (pin: AnalogPin, degrees: number) => {
            this.servoValues.set(pin, degrees);
        },
        map: (val: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) => {
            return toLow + ((val - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow);
        },
    };

    public serial = {
        writeLine: (text: string) => {
            this.serialHistory.push(text);
        },
        writeNumber: (num: number) => {
            this.serialHistory.push(String(num));
        },
        writeValue: (name: string, val: number) => {
            this.serialHistory.push(`${name}:${val}`);
        },
        writeString: (text: string) => {
            this.serialHistory.push(text);
        },
        readLine: () => '',
        readString: () => '',
        redirectToUSB: () => {},
    };

    public control = {
        millis: () => Date.now(),
        micros: () => Date.now() * 1000,
        waitMicros: (_micros: number) => {},
        reset: () => this.reset(),
        deviceName: () => 'microbit',
        deviceSerialNumber: () => 12345678,
        inBackground: (body: () => void) => {
            body();
        },
    };

    public randint(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export const microbit = new MockMicroBit();
