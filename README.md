# math-problems-generator

A simple, printable random math worksheet generator

Select one or more operation buttons to choose which problems appear. **Mix**
selects all four operations; at least one operation must remain selected.

## Run without a server

Open `index.html` directly in a browser. The site runs entirely in the browser and does not need Node.js or a web server.

## Static build

To create a static build, install the build dependency and build:

```bash
npm install
npm run build
```

Open `dist/index.html` directly in a browser. Keep the `dist/` folder together so its relative CSS and JavaScript files are available. No server is required.

## Development

For live reload during development, install dependencies and start Vite:

```bash
npm run dev
```

## Deployment

Push to `main` or run the **Deploy to GitHub Pages** workflow manually to build and deploy the site. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.