# MakeCode API: Sound & Music (`music.*`)

- **Official Web Documentation**: [https://makecode.microbit.org/reference/music](https://makecode.microbit.org/reference/music)
- **GitHub Source**: [https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/music.md](https://github.com/microsoft/pxt-microbit/blob/master/docs/reference/music.md)
- **Supported Hardware**: BBC micro:bit V1 (via edge pin P0 / buzzer) and V2 (via built-in speaker or pin P0)

---

## Overview
The `music` namespace allows playing musical notes, pitch frequencies, preset songs, rhythm tempos, and expressive sound effects.

---

## API Signatures & Methods

### 1. Pitch & Tones
- **`music.playTone(frequency: number, duration: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/music/play-tone](https://makecode.microbit.org/reference/music/play-tone)
  - **Parameters**:
    - `frequency`: Frequency in Hertz (Hz), e.g. `Note.C`, `Note.D`, `Note.E` or raw numbers (Middle C = 262, A4 = 440).
    - `duration`: Duration in milliseconds, or beat constants (`music.beat(BeatFraction.Whole)`).
  ```typescript
  music.playTone(Note.C, music.beat(BeatFraction.Whole));
  music.playTone(440, 500); // 440Hz for 500ms
  ```
- **`music.ringTone(frequency: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/music/ring-tone](https://makecode.microbit.org/reference/music/ring-tone)
  - Emits a tone continuously until stopped or another tone/rest is played.
- **`music.rest(duration: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/music/rest](https://makecode.microbit.org/reference/music/rest)
  - Silences sound for a given duration.
- **`music.stopAllSounds(): void`**
  - Immediately silences any active playing melody, tone, or sound effect.

---

### 2. Melodies & Sound Effects
- **`music.playMelody(melody: string, tempo: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/music/play-melody](https://makecode.microbit.org/reference/music/play-melody)
  - Plays an 8-note melody string, e.g. `"C5 B A G F E D C "`.
- **`soundExpression.*.play()` & `soundExpression.*.playUntilDone()`**
  - Built-in expressive sound effects (micro:bit V2 or simulator):
    - `soundExpression.giggle`
    - `soundExpression.happy`
    - `soundExpression.hello`
    - `soundExpression.mysterious`
    - `soundExpression.sad`
    - `soundExpression.slide`
    - `soundExpression.soar`
    - `soundExpression.spring`
    - `soundExpression.twinkle`
    - `soundExpression.yawn`
  ```typescript
  soundExpression.happy.playUntilDone();
  ```

---

### 3. Tempo & Volume Control
- **`music.setTempo(bpm: number): void`**
  - **Doc URL**: [https://makecode.microbit.org/reference/music/set-tempo](https://makecode.microbit.org/reference/music/set-tempo)
  - Sets the playback speed in beats per minute (BPM) (default: 120 BPM).
- **`music.tempo(): number`**
  - Returns current tempo in BPM.
- **`music.changeTempoBy(bpm: number): void`**
  - Adjusts tempo relatively.
- **`music.setVolume(volume: number): void`**
  - Sets volume level from 0 (mute) to 255 (maximum).
- **`music.volume(): number`**
  - Returns current volume (0..255).
- **`music.setBuiltInSpeakerEnabled(enabled: boolean): void`**
  - Enables or disables the micro:bit V2 onboard speaker (diverts audio to edge connector pin 0 if disabled).
