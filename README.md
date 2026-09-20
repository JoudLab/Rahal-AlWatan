# رحّال الوطن | Rahal Al-Watan

An interactive educational quiz game with a Saudi theme. A friendly robot travels across a map of Saudi Arabia through **10 cities**, and each city asks **one question** about the Kingdom.

لعبة تفاعلية تعليمية بطابع سعودي: يرافق اللاعب روبوتًا في رحلة عبر 10 مدن، ويجيب عن 10 أسئلة عن المملكة العربية السعودية.

**Live Demo:** _add the GitHub Pages link here after publishing_ <!-- e.g. https://<username>.github.io/Rahal-AlWatan/ -->

---

## Overview

Rahal Al-Watan is a small static web game written in plain HTML, CSS and JavaScript. The player starts in Taif, follows a fixed route across the map, and moves to the next city only after answering the current question correctly. The interface is in Arabic (right-to-left) and works on desktop and mobile screens.

## Features

- 10 stations and 10 multiple-choice questions, one per city
- Schematic map of Saudi Arabia with a route that is drawn as the robot travels
- Wrong answers never end the game: the chosen answer is locked and the player tries again
- Progress indicator ("المحطة 3 من 10") with 10 segments
- Solo and two-player modes with hidden per-player timing
- Celebration screen with confetti, and replay / home buttons
- Responsive layout, light and dark colour schemes, and reduced-motion support
- No backend, no build step, no external JavaScript libraries

## Game Modes

**Solo**
- The player enters a name and answers all 10 questions.
- The total answering time is shown on the final screen.

**Team (two players)**
- Two players enter their names.
- Questions alternate: player 1 gets questions 1, 3, 5, 7, 9 and player 2 gets questions 2, 4, 6, 8, 10.
- The current player is shown on every question.
- Each player's time starts when their question appears and stops at their correct answer. Robot movement between cities is not counted, and no timer is shown during play.
- The final screen shows both times and who was faster, or a tie.

## Journey Route

| # | City | Topic |
|---|------|-------|
| 1 | الطائف (Taif) | National Day |
| 2 | جدة (Jeddah) | What Jeddah is known for |
| 3 | الرياض (Riyadh) | Capital city |
| 4 | أبها (Abha) | Highest mountain peak |
| 5 | الدمام (Dammam) | Body of water |
| 6 | مكة المكرمة (Makkah) | The mosque of the Kaaba |
| 7 | الأحساء (Al-Ahsa) | Official currency |
| 8 | العلا (AlUla) | What AlUla is famous for |
| 9 | حائل (Hail) | Founder of the Kingdom |
| 10 | المدينة المنورة (Madinah) | The national flag |

## Technologies Used

- HTML5
- CSS3 (custom properties, grid and flexbox, animations)
- Vanilla JavaScript (ES5-style, no dependencies)
- Inline SVG for the map and icons
- [Tajawal](https://fonts.google.com/specimen/Tajawal) font from Google Fonts (falls back to system Arabic fonts if offline)

## How to Run Locally

No installation or build is required.

**Option 1:** open `index.html` in a browser.

**Option 2:** serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages Deployment

1. Create a new repository (suggested name: `Rahal-AlWatan`).
2. Upload the contents of this folder to the repository root, so `index.html` sits at the top level.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then save.
5. After a minute or two the game is available at `https://<username>.github.io/Rahal-AlWatan/`.
6. Paste that link into the **Live Demo** line above.

All asset paths are relative, so the game works from a repository sub-path.

## Project Structure

```
Rahal-AlWatan/
├── index.html        # Entry point: all screens (start, setup, map, question, end)
├── css/
│   └── style.css     # Styles, colour tokens, animations
├── js/
│   └── game.js       # Game logic, questions, map, timing
├── assets/
│   └── robot.webp    # Robot mascot
├── .nojekyll         # Tells GitHub Pages to serve files as-is
└── README.md
```

To change questions or cities, edit the `QUESTIONS` and `STOPS` arrays at the top of `js/game.js`.

## Notes

- The map is a simplified, schematic outline. City positions in the Hejaz area are slightly spread apart so their markers do not overlap, so it is not a survey-accurate map.
- The robot artwork is based on a reference illustration supplied by the project author.
