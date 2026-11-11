# Apurbo — Research Portfolio

Personal site of **Md. Mosharaf Hossain Apurbo**, CSE undergraduate at BUET.
Live: https://apurbo5057.github.io/

Static HTML (Home, About, Publications, Experience, Blog, Contact) with light/dark themes. Design adapted from https://rigan31.github.io/ with content replaced.

## Layout

```
scripts/build.mjs   all content + page templates; generates the HTML
index.html, about/, publications/, experience/, blog/, contact/, 404.html   generated pages
assets/css|js       compiled stylesheet, site scripts, hero animation
assets/fonts        self-hosted fonts
assets/figures      paper figures
assets/img|logos    portrait and institution logos
assets/cv           CV source (CV.tex) and PDF
.github/workflows   GitHub Pages deploy
```

## Develop

```sh
node scripts/build.mjs        # regenerate pages
python -m http.server 8765    # preview at http://127.0.0.1:8765
```

Push to `main` to deploy. See `AGENTS.md` for editing notes.

## License

MIT
