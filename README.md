# kyleo.co.uk

My personal site, built with React, React Router and Sass and deployed to Netlify. Live at [kyleo.co.uk](https://kyleo.co.uk).

## What's here

- **`/`** is a one-page intro: name, job title, local time and contact links.
- **`/admin`** is "Grey Cat", a demo CMS that shows my UI work: layout, navigation, forms and a small library of accessible components. Sign in with `demo` / `demo`.

The CMS is a front-end showcase with no backend. Edits made in Settings are stored in your browser's localStorage, which means you can see them on the homepage but nobody else can.

## Adding a showcase component

1. Create the component in `src/showcase/examples/`.
2. Register it in `src/showcase/index.js` with a title, summary, build notes and source path.
3. Add styles to `src/sass/backend/admin-components/_showcase.scss`, using the `sc-` prefix.

It then appears on `/admin/components` and in the dashboard count.

## Scripts

```bash
npm start      # dev server on http://localhost:3000
npm run build  # production build to /build
```
