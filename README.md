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
- **Floating + draggable** panel, collapsible with one click
- **Lap counter** display
- Clean dark F1 broadcast aesthetic with Titillium Web font

---

## Installation

### Via SillyTavern URL Installer (recommended)

1. In SillyTavern, go to **Extensions → Install Extension**
2. Paste the URL of this repository:
   ```
   https://github.com/Th3ssa/f1-timing-tower
   ```
3. Click **Install**
4. Hard-refresh the page

### Manual (Termux / local)

```bash
cd ~/SillyTavern/public/extensions/third-party/
git clone https://github.com/Th3ssa/f1-timing-tower.git
```

Then reload SillyTavern and enable the extension in the Extensions panel.

---

## Setup — AI Instructions

The extension works by parsing a ` ```f1timing ` JSON code block that the AI appends to racing messages. You need to tell your AI model to output this.

**Option A — System Prompt** *(recommended)*
Copy the contents of [`INSTRUCTIONS.txt`](./INSTRUCTIONS.txt) → **SYSTEM PROMPT BLOCK** section into your character card's `system_prompt` field.

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
      "team": "apex",
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

### Team keys
`apex` · `ferrari` · `redbull` · `mercedes` · `mclaren` · `aston` · `alpine` · `williams` · `haas` · `sauber` · `cadillac` · `racing bulls`

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
| `""` | No data yet |

---

## Compatibility

- SillyTavern 1.10.x and above
- Works on desktop and Termux (Android)
- Requires a model capable of following structured output instructions (Claude, GPT-4+, good local models with sufficient context)

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

Built for a 2027 F1 alternate universe roleplay project in SillyTavern.
