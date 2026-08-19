# 🦇 BatSignal

A booking site for on-demand help — errands, home setup, event help, and other "missions." Pick a service, date, and time, and it confirms the booking straight to WhatsApp.

**Live site:** https://ishar025.github.io/batmansignal/

## How it works

1. Choose a service, date, time, and duration on the booking form.
2. Confirming saves the booking to Supabase.
3. It opens WhatsApp with a pre-filled message summarizing the request.

## Stack

Plain HTML/CSS/JS, no build step or framework.

- **Storage:** [Supabase](https://supabase.com) (`bookings` table)
- **Hosting:** GitHub Pages, deployed via GitHub Actions on every push to `main`

## Project structure

```
index.html   markup
style.css    styling
script.js    calendar, form validation, Supabase insert, WhatsApp link
```

## Local development

No dependencies to install. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8787
```

Then open http://localhost:8787.

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which builds and deploys the site to GitHub Pages automatically.
