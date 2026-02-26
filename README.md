# PawLog Frontend (PWA)

React PWA for PawLog pet care management. Uses Google Sign-In and the PawLog backend API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `VITE_API_URL` – Backend API URL (leave empty for dev proxy to localhost:8080)
   - `VITE_GOOGLE_CLIENT_ID` – Google OAuth client ID from [Google Cloud Console](https://console.cloud.google.com/)

3. **Google OAuth**
   - Create a project in Google Cloud Console
   - Enable Google+ API or People API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized JavaScript origins: `http://localhost:5173`, your production URL
   - Copy the Client ID to `VITE_GOOGLE_CLIENT_ID`

## Development

```bash
npm run dev
```

Runs at http://localhost:5173. API requests are proxied to http://localhost:8080.

## Build

```bash
npm run build
```

Output in `dist/`. Deploy to Vercel, Netlify, or Cloudflare Pages.

## Production

Set `VITE_API_URL` to your backend URL (e.g. `https://api.pawlog.com`).
