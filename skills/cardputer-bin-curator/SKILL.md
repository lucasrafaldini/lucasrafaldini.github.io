---
name: cardputer-bin-curator
description: Guidelines and schema for cataloging, verifying, and updating M5Cardputer firmware binaries in cardputer-bins/index.html.
---

# Cardputer Bin Curator

## Overview
Manages the portable firmware repository for M5Cardputer devices stored in `cardputer-bins/index.html` inside the `CB_DATA` JSON array.

## Entry Schema
Each firmware entry in `CB_DATA` must conform to the following schema:
```json
{
  "n": "Firmware Name",
  "dsc": "One to two sentences describing key features, hardware controls, and protocol capabilities.",
  "a": "Author or GitHub organization",
  "dl": 12345,
  "cv": "cover_image_hash.png",
  "gh": "https://github.com/org/repo",
  "ver": "v1.0.0",
  "date": "YYYY-MM-DD",
  "bin": "direct_url_or_hash.bin",
  "tag": "sec | sys | game | media | tool"
}
```

## Supported Tags
- `sec`: Cybersecurity, penetration testing, RFID/NFC, WiFi/BLE auditing.
- `sys`: Operating systems, micro-launchers, bootloaders, and system menus.
- `game`: Emulators, retro games, native game ports.
- `media`: Audio players, streaming clients, radio, video players.
- `tool`: Utility suites, serial terminals, sensor monitors, calculators.

## Validation Steps
1. Ensure the binary URL (`bin`) is either a valid asset hash or a direct HTTPS release link.
2. Confirm the description has no prohibited dash characters (`\u2014`, `\u2013`).
3. Verify that the tag matches one of the 5 canonical tags.
