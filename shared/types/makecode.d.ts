// MakeCode micro:bit global type declarations

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
}

declare namespace music {
    function playTone(frequency: number, duration: number): void;
    function ringTone(frequency: number): void;
    function rest(duration: number): void;
}

declare namespace control {
    function millis(): number;
    function reset(): void;
}
