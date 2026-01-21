# TrinityTriumph Overview

## Quick Summary
TrinityTriumph is a Vite + React + TypeScript prototype that delivers a
fast, cyber-styled rock-paper-scissors duel. The core loop is timed and
state-driven, with a burst mechanic that rewards streaks.

## Game Loop
1. Command phase: player picks a move.
2. Battle phase: moves are revealed with a short delay.
3. Result phase: HP and burst update based on the outcome.
4. Return to command or end the match when HP hits 0.

## Core Rules
- Move types: rock, scissors, paper.
- Outcome: win/lose/draw (standard RPS).
- Burst gauge: fills on any outcome; at 100, can be armed.
- Armed burst: on the next win, adds bonus damage and consumes the gauge.

## Folder Layout
- `src/` app source.
- `src/components/` UI by domain (game, layout, ui).
- `src/store/` game state and rules (Zustand).
- `src/data/` enemy and character definitions.
- `src/types/` shared type definitions.
- `src/utils/` small utilities (RNG, RPS compare).
- `src/hooks/` shared hooks (sound).
- `src/assets/` static art (sprites).

## Key Files
- `src/store/useGameStore.ts` main rules, phase changes, tuning.
- `src/components/game/StatusHud.tsx` HP, burst, telegraph UI.
- `src/components/game/CommandDeck.tsx` move input.
- `src/components/game/BattleArea.tsx` move reveal and impact effects.
