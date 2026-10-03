// MakeCode micro:bit global type declarations

declare function randint(min: number, max: number): number;

declare enum IconNames {
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

declare enum Button {
    A = 1,
    B = 2,
    AB = 3,
}

declare enum Gesture {
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

declare enum DigitalPin {
    P0 = 100,
    P1 = 101,
    P2 = 102,
    P8 = 108,
    P12 = 112,
    P16 = 116,
}

declare enum AnalogPin {
    P0 = 100,
    P1 = 101,
    P2 = 102,
    P3 = 103,
    P4 = 104,
    P10 = 110,
}

declare enum TouchPin {
    P0 = 0,
    P1 = 1,
    P2 = 2,
}

declare enum TouchTarget {
    P0 = 0,
    P1 = 1,
    P2 = 2,
    LOGO = 3,
}

declare enum TouchTargetMode {
    Resistive = 0,
    Capacitive = 1,
}

declare enum TouchButtonEvent {
    Touched = 0,
    Released = 1,
    Pressed = 3,
    LongPressed = 4,
}

declare enum Direction {
    Right = 90,
    Left = -90,
}

declare enum LedSpriteProperty {
    X = 0,
    Y = 1,
    Direction = 2,
    Brightness = 3,
    Blink = 4,
}

declare namespace basic {
    function showIcon(icon: IconNames, interval?: number): void;
    function showString(text: string, interval?: number): void;
    function showNumber(value: number, interval?: number): void;
    function showLeds(leds: string, interval?: number): void;
    function clearScreen(): void;
    function pause(millis: number): void;
    function forever(handler: () => void): void;
}

declare namespace input {
    function onButtonPressed(button: Button, handler: () => void): void;
    function onGesture(gesture: Gesture, handler: () => void): void;
    function buttonIsPressed(button: Button): boolean;
    function onPinPressed(pin: TouchPin, handler: () => void): void;
    function onPinReleased(pin: TouchPin, handler: () => void): void;
    function pinIsPressed(pin: TouchPin): boolean;
    function onLogoEvent(action: TouchButtonEvent, handler: () => void): void;
    function logoIsPressed(): boolean;
    function temperature(): number;
    function lightLevel(): number;
    function compassHeading(): number;
    function acceleration(dimension: 'x' | 'y' | 'z' | 'strength'): number;
}

declare namespace led {
    function plot(x: number, y: number): void;
    function unplot(x: number, y: number): void;
    function point(x: number, y: number): boolean;
    function toggle(x: number, y: number): void;
    function brightness(): number;
    function setBrightness(value: number): void;
    function plotBarGraph(value: number, high: number): void;
    function stopAnimation(): void;
}

declare namespace music {
    function playTone(frequency: number, duration: number): void;
    function ringTone(frequency: number): void;
    function rest(duration: number): void;
    function stopAllSounds(): void;
    function setVolume(volume: number): void;
    function volume(): number;
    function setTempo(bpm: number): void;
    function tempo(): number;
}

declare namespace radio {
    function setGroup(id: number): void;
    function sendNumber(value: number): void;
    function sendString(msg: string): void;
    function sendValue(name: string, value: number): void;
    function onReceivedNumber(handler: (receivedNumber: number) => void): void;
    function onReceivedString(handler: (receivedString: string) => void): void;
    function onReceivedValue(handler: (name: string, value: number) => void): void;
    function setTransmitPower(power: number): void;
}

declare namespace game {
    interface LedSprite {
        move(leds: number): void;
        turn(direction: Direction, degrees: number): void;
        ifOnEdgeBounce(): void;
        get(property: LedSpriteProperty): number;
        set(property: LedSpriteProperty, value: number): void;
        change(property: LedSpriteProperty, value: number): void;
        isTouching(other: LedSprite): boolean;
        isTouchingEdge(): boolean;
        delete(): void;
    }

    function createSprite(x: number, y: number): LedSprite;
    function addScore(points: number): void;
    function score(): number;
    function setScore(score: number): void;
    function setLife(lives: number): void;
    function addLife(lives: number): void;
    function removeLife(lives: number): void;
    function startCountdown(ms: number): void;
    function gameOver(): void;
    function isGameOver(): boolean;
}

declare namespace pins {
    function digitalReadPin(name: DigitalPin): number;
    function digitalWritePin(name: DigitalPin, value: number): void;
    function analogReadPin(name: AnalogPin): number;
    function analogWritePin(name: AnalogPin, value: number): void;
    function servoWritePin(name: AnalogPin, degrees: number): void;
    function map(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number;
    function touchSetMode(name: TouchTarget, mode: TouchTargetMode): void;
}

declare namespace serial {
    function writeLine(text: string): void;
    function writeNumber(value: number): void;
    function writeValue(name: string, value: number): void;
    function writeString(text: string): void;
    function readLine(): string;
    function readString(): string;
    function redirectToUSB(): void;
}

declare namespace control {
    function millis(): number;
    function micros(): number;
    function waitMicros(micros: number): void;
    function reset(): void;
    function deviceName(): string;
    function deviceSerialNumber(): number;
    function inBackground(body: () => void): void;
}
