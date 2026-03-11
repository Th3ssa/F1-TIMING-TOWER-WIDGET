# 🏎 F1 Live Timing Tower — SillyTavern Extension

A live F1 timing tower widget for SillyTavern that updates in real time alongside your racing roleplay. The AI appends structured timing data to its messages; the extension intercepts it, hides it from the chat, and renders a broadcast-accurate timing tower panel.

---

## Features

- **Full 22-driver grid** with positions, gaps, and intervals
- **Sector colors** — purple (overall fastest), green (personal best), yellow (normal)
- **Tire compound indicator** — S / M / H / I / W with color coding
- **Pit stop status** — IN / PIT / OUT badges
- **Fastest lap indicator** per driver
- **Flag & Safety Car banners** — scrolling ticker with color-coded backgrounds
  - 🟢 Green flag
  - 🟡 Yellow flag
  - 🔵 Blue flag
  - 🔴 Red flag *(freezes tower updates)*
  - 🚗 Safety Car *(freezes tower updates)*
  - 🚗 Virtual Safety Car *(freezes tower updates)*
  - 🏁 Chequered flag
- **Position change animations** — row flashes green (gained) or red (lost)
- **Floating + draggable** panel with touch support for mobile
- **Collapsible** with one tap
- **Lap counter** display
- Clean dark F1 broadcast aesthetic with Titillium Web font

---

## Installation
via Github URL in ST extension: https://github.com/Th3ssa/F1-TIMING-TOWER-WIDGET

### Manual (Termux — recommended for ST on Android)

```bash
mkdir -p ~/SillyTavern/data/default-user/extensions/f1-timing-tower
cd ~/SillyTavern/data/default-user/extensions/f1-timing-tower

curl -L "https://raw.githubusercontent.com/Th3ssa/f1-timing-tower/main/manifest.json" -o manifest.json
curl -L "https://raw.githubusercontent.com/Th3ssa/f1-timing-tower/main/index.js" -o index.js
curl -L "https://raw.githubusercontent.com/Th3ssa/f1-timing-tower/main/style.css" -o style.css
```

Then restart ST and hard refresh your browser.

---

## Setup — AI Instructions

The extension works by parsing a ` ```f1timing ` JSON code block that the AI appends to racing messages. You need to tell your AI model to output this.

**Option A — System Prompt** *(recommended)*
Copy the **SYSTEM PROMPT BLOCK** from [`INSTRUCTIONS.txt`](./INSTRUCTIONS.txt) into your character card's `system_prompt` field.

**Option B — Lorebook / World Info**
Use the **LOREBOOK ENTRY** section from `INSTRUCTIONS.txt` — set keywords to trigger on racing terms like `sector`, `lap`, `pit`, `safety car`, `flag`, `overtake`.

---

## JSON Schema Reference

The AI should output this at the end of every racing message:

````
```f1timing
{
  "lap": 34,
  "total_laps": 57,
  "flag": "green",
  "flag_message": "",
  "drivers": [
    {
      "pos": 1,
      "code": "REN",
      "name": "E. Renaud",
      "team": "redbull",
      "gap": "LEADER",
      "interval": "—",
      "tire": "S",
      "tire_laps": 4,
      "s1": "purple",
      "s2": "green",
      "s3": "yellow",
      "pit": false,
      "fl": true
    }
  ]
}
```
````

### Flag values
| Value | Effect |
|---|---|
| `green` | Normal racing |
| `yellow` | Yellow flag, tower continues |
| `blue` | Blue flag, tower continues |
| `red` | Race suspended — **tower freezes** |
| `sc` | Safety Car — **tower freezes** |
| `vsc` | Virtual Safety Car — **tower freezes** |
| `chequered` | Race end |

### Team keys (2026 AU Grid — 11 teams)
| Key | Team |
|---|---|
| `redbull` | Oracle Red Bull Racing |
| `ferrari` | Scuderia Ferrari |
| `mclaren` | McLaren F1 Team |
| `mercedes` | Mercedes-AMG F1 |
| `audi` | Audi F1 Team |
| `cadillac` | Cadillac Racing |
| `aston` | Aston Martin F1 |
| `alpine` | Alpine F1 Team |
| `williams` | Williams Racing |
| `haas` | Haas F1 Team |
| `vcarb` | Visa Cash App RB |

### Tire compounds
| Code | Compound | Color |
|---|---|---|
| S | Soft | Red |
| M | Medium | Yellow |
| H | Hard | White |
| I | Intermediate | Green |
| W | Wet | Blue |

### Sector colors
| Value | Meaning |
|---|---|
| `purple` | Fastest of ALL drivers this session |
| `green` | Personal best for this driver |
| `yellow` | Slower than personal best |
| `""` | No data yet / neutralised period |

---

## Compatibility

- SillyTavern 1.12.x
- Termux (Android) — touch drag supported
- Requires a model capable of structured output (Claude, GPT-4+)

---

## File Structure

```
f1-timing-tower/
├── manifest.json       # ST extension registration
├── index.js            # Core logic — parsing, rendering, drag, flags
├── style.css           # Timing tower styles
├── INSTRUCTIONS.txt    # AI system prompt + lorebook snippets
└── README.md           # This file
```

---

## Credits

Built for a 2026 F1 alternate universe roleplay project in SillyTavern.
Author: Th3ssa — https://github.com/Th3ssa/f1-timing-tower
