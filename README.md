# ✨ Counter

A single-file, dependency-free counter app with a dark, animated interface — custom step sizes, goal tracking, milestone celebrations, undo, keyboard shortcuts, and live session stats.

![status](https://img.shields.io/badge/status-active-C8FF57)
![license](https://img.shields.io/badge/license-MIT-blue)
![deploy](https://github.com/<your-username>/counter-app/actions/workflows/deploy.yml/badge.svg)

**[Live Demo →](https://<your-username>.github.io/counter-app/)**

## Features

- **Increment / decrement** with adjustable step size (1, 5, 10, custom)
- **Undo** last action and **reset** the session
- **Goal tracking** with a live progress bar and celebration toast on completion
- **Milestone flashes** at 10, 25, 50, 100, 250, 500, 1000
- **Session stats** — total taps, max, min, and average value
- **History dots** showing your recent increment/decrement pattern
- **Keyboard shortcuts**:
  - `↑` / `+` — increment
  - `↓` / `-` — decrement
  - `Z` — undo
  - `R` — reset
  - `G` — open goal modal
  - `1`–`4` — select step size
- **Animated particle background** that reacts to the current value

## Demo

Open [`index.html`](./index.html) directly in any modern browser — no build step, no dependencies, no server required.

## Getting Started

```bash
git clone https://github.com/<your-username>/counter-app.git
cd counter-app
open index.html   # or just double-click the file
```

### Optional: run with a local server

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Tech Stack

- Vanilla HTML, CSS, and JavaScript — no frameworks, no build tools
- [Google Fonts](https://fonts.google.com/) (DM Mono, Syne)
- Canvas API for the ambient particle background

## Project Structure

```
counter-app/
├── .github/
│   ├── workflows/deploy.yml     # GitHub Pages auto-deploy
│   └── ISSUE_TEMPLATE/          # bug & feature templates
├── index.html                   # entire app: markup, styles, and logic
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```


## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, and use the issue templates for bug reports or feature requests.

## License

Released under the [MIT License](./LICENSE).
