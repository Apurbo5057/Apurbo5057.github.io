# Apurbo — Research & Engineering Portfolio

Personal portfolio for **Md. Mosharaf Hossain Apurbo**, CSE undergraduate at BUET.

Live site: **https://apurbo5057.github.io/**

An original mountain Basecamp landing and furnished canvas tent with seven
research panels, a Dhaka clock, day/night lighting, and night fireflies.
Outside, three animated campers gather around a nighttime fire. The Campfire
button visits the clearing; optional original music starts only after pressing Play.
There is also a plain HTML portfolio at `classic.html`. No package installation or build
is needed to run it. Three.js is version-pinned in `js/three.js`; fonts and
Three.js load from CDNs. The plain page works without JavaScript, WebGL, or CDNs.
Visitor tracking is disabled.

## Local development

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Preview day with `?hour=13`, night with `?hour=22`.
Use `#office` to enter immediately or `#projects` to open a section. The clock
switches lighting. Arrow keys switch panels; Escape closes them.

Dark mode is the default. Click the seated character or the “Say hi” button
for a friendly wave and heart. Reduced-motion visitors get a still greeting.

## Editing

- `index.html`: profile, links, and seven content templates. Edit content here.
- `classic.html`: generated mirror; regenerate after changing templates.
- `js/config.js`: sections, markers, camera framing, visitor settings.
- `js/room.js`: timber deck, education books, and award frames.
- `js/tent.js`: stitched canvas, poles, ropes, tied-back flaps, and deck steps.
- `js/campsite.js`: stone fire ring, logs, flames, guitar, and seated campers.
- `js/camp-music.js`: opt-in original synthesized music; stops on leaving the campfire.
- `js/landscape.js`: original procedural mountains, pines, ferns, and fireflies.
- `assets/img/basecamp.svg`: original illustrated mountain landscape.
- `js/character.js`: seated desk worker and subtle typing animation.
- `js/textures.js`: canvas roadmap, monitor, calendar, and books.
- `js/clock.js`: Dhaka clock and daylight settings.
- `css/office.css`: structural styles; `css/basecamp.css`: nature design;
  `css/classic.css`: plain page layout.
- `assets/img/monogram.svg`: initials artwork; replace with your photo if desired.
- `assets/cv/`: provided LaTeX CV and compiled PDF.
- `scripts/`: plain-page generation and validation.

```sh
python scripts/build-classic.py
python scripts/validate.py
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=assets/cv -jobname=Apurbo-CV assets/cv/CV.tex
```

Content comes from the supplied CV. The main profile uses `Apurbo5057`; project
links use the `Roll-no-57` repositories in the CV. Accepted workshop papers and
the under-review capstone are labelled separately. No portrait, publication
URLs, or demo video were supplied, so the site uses initials and canvas artwork.

## Deployment

`main` deploys through `.github/workflows/pages.yml`. Set GitHub Pages source to
**GitHub Actions**. The workflow regenerates the plain page, validates files,
and uploads only public static assets. CV source is public alongside its PDF.
The original MIT notice is retained in `LICENSE` as required for the adapted
implementation. Original personal profile content and media are removed.
