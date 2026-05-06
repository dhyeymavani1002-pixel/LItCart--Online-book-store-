# LitCart Deployment Guide

This repo is ready for:

- Frontend on Netlify or Vercel
- Backend on Render

## Recommended setup

- Frontend: Netlify or Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas

## Backend on Render

This repo includes a root `render.yaml` blueprint for the API.

Important settings:

- Root directory: `Backend/myapi`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set these environment variables in Render:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `ALLOWED_ORIGINS`

Example `ALLOWED_ORIGINS` value:

```text
https://your-site.netlify.app,https://your-project.vercel.app
```

## Frontend on Netlify

This repo includes a root `netlify.toml`.

Netlify will use:

- Base directory: `Frontend/angular-litcart`
- Build command: `npm run build`
- Publish directory: `dist/angular-litcart`

Before deploying, set the backend URL in:

- `Frontend/angular-litcart/public/app-config.js`

Example:

```js
window.LITCART_API_URL = 'https://your-backend.onrender.com';
```

## Frontend on Vercel

Set the Vercel project root directory to:

```text
Frontend/angular-litcart
```

The frontend folder already includes:

- `vercel.json` for SPA route rewrites

Before deploying, set the backend URL in:

- `Frontend/angular-litcart/public/app-config.js`

Example:

```js
window.LITCART_API_URL = 'https://your-backend.onrender.com';
```

## Local development

Backend:

```powershell
cd "Backend\myapi"
node server.js
```

Frontend:

```powershell
cd "Frontend\angular-litcart"
npm.cmd start
```

## Important security note

For public deployment, do not rely on hardcoded secrets in source code.

Use:

- Render environment variables for backend secrets
- MongoDB Atlas Network Access rules for your deployed backend
