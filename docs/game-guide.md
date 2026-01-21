# TrinityTriumph Game Guide

## Overview
TrinityTriumph is a pixel RPG prototype that mixes a roaming field with
rock‑paper‑scissors combat. You explore a scrolling world, trigger random
encounters, and win fights using elemental attack/defense stats and gear.

## Field Exploration
- The player stays centered; the world scrolls around you.
- Move with arrow keys or WASD.
- Terrain types:
  - Grass (G): walkable.
  - Road (R): walkable.
  - Water (W): blocked.
  - Mountain (M): blocked.
- Random encounters can occur while walking on walkable tiles.
- Each enemy can be encountered only once per run.

## Battle Flow
1. Command phase: choose GU/CHOKI/PA.
2. Battle phase: moves reveal and clash.
3. Result phase: damage applies, burst updates, and the round resets.
4. When an enemy or player reaches 0 HP, the battle ends.

## Elements and Stats
Moves map to elements:
- GU = rock
- CHOKI = scissors
- PA = paper

Each character and enemy has per‑element stats:
- Attack: increases damage dealt when using that element.
- Defense: reduces damage taken when hit by that element.

Damage calculation:
- Base damage comes from difficulty tuning.
- Element modifier adjusts damage using attacker attack vs defender defense.

## Burst System
- Burst gauge fills on any outcome.
- At 100, you can arm burst (center triangle button in battle).
- Armed burst adds bonus damage to your next win and then resets to 0.

## Equipment
- You can equip up to 3 items in the field screen.
- Items add elemental attack/defense bonuses.
- Equip only works in field mode (not during battle).

## Game States
High‑level modes:
- Field: exploration, encounters, equipment.
- Battle: command/battle/result flow.

Round outcomes:
- Win: enemy takes damage, burst increases.
- Lose: player takes damage, burst increases.
- Draw: both take damage, burst increases.

## Reset
- Reset returns to the field, restores HP, clears defeated enemies, and
  removes all equipped items.
