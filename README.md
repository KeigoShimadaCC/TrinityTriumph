# TrinityTriumph

> A pixel-art RPG prototype combining classic field exploration with rock-paper-scissors combat mechanics. Built with React, TypeScript, and Vite.

![Game Banner](https://img.shields.io/badge/Status-In%20Development-yellow) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue) ![React](https://img.shields.io/badge/React-18.3.1-61dafb) ![Vite](https://img.shields.io/badge/Vite-5.4.10-646cff)

---

## 🎮 Overview

**TrinityTriumph** (stylized as *Realm Arena: TrinityTriumph*) is a medieval-fantasy RPG that reimagines rock-paper-scissors as a tactical combat system. Explore a scrolling pixel-art world, trigger random encounters, and master elemental attack/defense mechanics augmented by equipment and burst abilities.

## ✨ Features

### 🗡️ Core Combat System
- **Rock-Paper-Scissors Mechanics** - GU (rock/sword), CHOKI (scissors/magic), PA (paper/prayer)
- **Three-Phase Combat Flow** - Command → Battle → Result with timed reveals
- **Elemental Stats System** - Per-element attack and defense values for deep strategy
- **Telegraph Hints** - Visual indicators showing enemy move tendencies
- **Difficulty Tiers** - Rookie, Veteran, Elite with tuned damage/behavior

### 💥 Burst Mechanic
- **Dynamic Gauge** - Fills on any combat outcome (win/lose/draw)
- **Strategic Arming** - Activate at 100% for bonus damage on next win
- **Risk-Reward** - Consumes gauge after use, encouraging tactical timing

### 🌍 Field Exploration
- **Scrolling World Maps** - Player-centered viewport with 5 distinct regions
  - Grass Field (main overworld)
  - Town Square (NPCs and safe zone)
  - Hidden Glade (forest)
  - Harbor (coastal area)
  - Dark Ruins (end-game zone)
- **Terrain System** - Grass, roads, water (blocked), mountains (blocked)
- **Random Encounters** - Distance-based enemy scaling
- **Special Tiles** - Healing tiles, portals, locked gates requiring key items

### 🎒 RPG Progression
- **Level/EXP System** - Gain experience from battles, level up for stat growth
- **Equipment Slots** - Equip up to 3 items simultaneously
- **Item Effects** - Elemental attack/defense bonuses stack with base stats
- **Stat Calculation** - Base + level bonus + item bonuses = total combat power

### 👾 Enemy Roster (10 Unique Enemies)
| Enemy | Difficulty | Anima | Description |
|-------|-----------|-------|-------------|
| **Goblin Scout** | Rookie | Rust Dagger | Quick and skittish, easy to outplay |
| **Dwarf Guard** | Rookie | Stone Hammer | Sturdy and stubborn, absorbs heavy blows |
| **Elf Blade** | Rookie | Moonsteel | Swift duelist with keen counters |
| **Shadow Rogue** | Veteran | Nightfang | Strikes fast, fades faster |
| **Forest Ranger** | Veteran | Whisper Bow | Balanced tactics and steady aim |
| **Sun Cleric** | Veteran | Halo Sigil | Hard to crack, punishes sloppy hits |
| **Orc Brute** | Veteran | Iron Maul | Raw power with reckless swings |
| **Iron Knight** | Elite | Oathblade | Armored sentinel, slow but crushing |
| **Arcane Mage** | Elite | Void Spark | Unpredictable bursts of power |
| **Crimson Wyvern** | Elite | Skyfire | Aerial menace with searing strikes |

### 🗣️ NPC & Story System
- **Interactive NPCs** - Spread across town, forest, harbor, and ruins
- **Dialogue System** - Randomized multi-line responses
- **Key Item Gifts** - NPCs grant Harbor Pass and Ruins Seal for progression
- **Story Quests** - Guided narrative via quest tracker
- **Event Flags** - Persistent world state changes

### 🎨 UI/UX
- **Retro Pixel Aesthetic** - Game Boy-inspired color palette and fonts
- **Responsive Controls**
  - Keyboard: Arrow keys / WASD for movement
  - Touch: On-screen D-pad for mobile
- **Layered Menus** - Status screen (HP/ATK/DEF) and equipment overlay
- **Visual Feedback** - Screen shake on damage, color-coded move indicators
- **Sound Effects** - Hit, lose, parry, and burst audio cues
- **Admin Tools** - Encounter toggle for testing

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.6.3 | Type safety |
| **Vite** | 5.4.10 | Build tool & dev server |
| **Zustand** | 4.5.5 | State management |
| **Tailwind CSS** | 3.4.13 | Styling |
| **Framer Motion** | 11.2.12 | Animations |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/KeigoShimadaCC/TrinityTriumph.git
cd TrinityTriumph

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🎯 How to Play

### Field Mode
1. **Movement** - Use arrow keys, WASD, or on-screen D-pad
2. **Encounters** - Walk on grass/road tiles to trigger random battles
3. **NPCs** - Step on NPC tiles to interact and receive dialogue/items
4. **Healing** - Step on healing tiles (H) to restore HP
5. **Portals** - Use special tiles (T/N/U/Q) to travel between maps
6. **Equipment** - Press status/equip buttons to manage gear (field only)

### Battle Mode
1. **Command Phase** - Choose GU (SWORD), CHOKI (MAGIC), or PA (PRAYER)
2. **Battle Phase** - Moves reveal simultaneously
3. **Result Phase** - Damage applies based on RPS outcome + elemental modifiers
4. **Outcomes**:
   - **Win** - Enemy takes damage, burst gauge increases
   - **Lose** - You take damage, burst gauge increases
   - **Draw** - Both take reduced damage, burst gauge increases
5. **Burst** - At 100%, click center triangle to arm burst for next win

### Damage Calculation
```
Base Damage (from difficulty tier)
× Element Modifier (attacker attack - defender defense)
+ Burst Bonus (if armed and win)
= Final Damage
```

---

## 📁 Project Structure

```
TrinityTriumph/
├── src/
│   ├── components/        # React components
│   │   ├── game/         # Game-specific UI (BattleArea, CommandDeck, StatusHud, FieldArea)
│   │   ├── layout/       # Layout components (Screen)
│   │   └── ui/           # Reusable UI components (Button)
│   ├── store/            # Zustand state management (useGameStore.ts)
│   ├── data/             # Game data
│   │   ├── enemies.ts    # Enemy definitions
│   │   ├── characters.ts # Player characters
│   │   ├── items.ts      # Equipment items
│   │   ├── keyItems.ts   # Story key items
│   │   ├── npcs.ts       # NPC data
│   │   └── worldMap.ts   # Map layouts
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utilities (RNG, RPS logic)
│   ├── hooks/            # Custom React hooks (useSound)
│   ├── assets/           # Sprites and static files
│   ├── config/           # Configuration (colors)
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── docs/                 # Documentation
│   ├── overview.md       # Technical overview
│   ├── game-guide.md     # Player guide
│   └── task-list.md      # Development roadmap
├── AGENTS.md             # Developer guidelines
└── package.json          # Dependencies and scripts
```

See [docs/overview.md](./docs/overview.md) for detailed architecture documentation.

---

## 🗺️ Roadmap

### ✅ Milestone 1: Core Loop (100%)
- [x] Combat mechanics with phases and HP
- [x] Burst gauge system
- [x] Pixel UI with sprite integration
- [x] Enemy roster (10 enemies)
- [x] Field exploration with encounters

### ✅ Milestone 2: RPG Progression (80%)
- [x] Town map + NPC dialogue
- [x] Item equip system (3 slots)
- [x] Level/EXP progression
- [x] Touch controls for mobile
- [x] Multi-map world (field, town, forest, harbor, ruins)

### 🚧 Milestone 3: World Expansion (0%)
- [ ] Expand overworld with more terrain variety
- [ ] Add 3-4 additional themed maps
- [ ] Regional enemy scaling refinement
- [ ] Admin tools for testing
- [ ] Story pass to tie NPCs/regions together

### 🚧 Milestone 4: Quality Gates (0%)
- [ ] Per-enemy telegraph patterns and modifiers
- [ ] Win/lose screen polish
- [ ] Unit tests for core game logic
- [ ] Tutorial overlay for new players

See [docs/task-list.md](./docs/task-list.md) for full task breakdown.

---

## 🎮 Game Design

### Combat Philosophy
Rock-paper-scissors is elevated through:
1. **Elemental Stats** - Rock/scissors/paper each have attack/defense values
2. **Telegraph System** - Enemies hint at their next move (higher difficulty = less reliable)
3. **Burst Timing** - Deciding *when* to use burst is strategic depth
4. **Equipment Synergy** - Build toward specific element strengths

### Progression Curve
- **Early Game** - Learn mechanics against rookie enemies (Goblin, Dwarf, Elf)
- **Mid Game** - Face veteran enemies requiring stat optimization
- **Late Game** - Elite bosses test mastery of all systems

---

## 🤝 Contributing

This is a personal prototype project, but feedback is welcome! If you find bugs or have suggestions:

1. Open an issue describing the problem/idea
2. For code contributions, see [AGENTS.md](./AGENTS.md) for conventions

---

## 📜 License

This project is currently unlicensed. All rights reserved by the author.

---

## 🙏 Acknowledgments

- **Pixel Art** - Custom sprites and UI elements
- **Font** - Press Start 2P and custom pixel fonts
- **Inspiration** - Classic JRPGs, Game Boy aesthetics, and strategic card games

---

## 📞 Contact

**Developer**: Keigo Shimada  
**GitHub**: [@KeigoShimadaCC](https://github.com/KeigoShimadaCC)  
**Repository**: [TrinityTriumph](https://github.com/KeigoShimadaCC/TrinityTriumph)

---

Made with ❤️ using React + TypeScript + Vite