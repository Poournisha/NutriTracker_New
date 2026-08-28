# Deploy NutriMeasure AI (Free)

The project is split into two deployable parts:
- **Backend** (Flask) → [Render](https://render.com) free web service + free Postgres
- **Frontend** (React/Vite) → [Vercel](https://vercel.com) (or Netlify) free

Both tiers are free. No credit card is required for Vercel; Render's free tier may
ask for a card to prevent abuse but has a free plan.

---

## 1. Backend on Render

1. Push this repo to GitHub.
2. Go to **Render → New → Blueprints**, connect the repo, and select `render.yaml`.
   Render automatically creates the Postgres database and the web service.
3. In the backend service **Environment**, set:
   - `CORS_ORIGINS` = your frontend URL, e.g. `https://nutrimeasure-ai.vercel.app`
   - `DEMO_MODE` = `true`, `CHATBOT_DEMO_MODE` = `true`
   - `SECRET_KEY` / `JWT_SECRET_KEY` are auto-generated.
4. Deploy. Note the backend URL, e.g. `https://nutrimeasure-backend.onrender.com`.

The start command runs `python -m app.seed.seed_database` (creates tables + seeds 20
foods + admin) and then launches `gunicorn`.

## 2. Frontend on Vercel

1. **Vercel → New Project**, import the GitHub repo, set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Output:** `dist`
2. Add an Environment Variable:
   - `VITE_API_BASE_URL` = `https://nutrimeasure-backend.onrender.com` (the Render URL)
3. Deploy. Your app is live at the Vercel URL.

> `vercel.json` already contains the Vite build settings and SPA rewrite.
> If you prefer **Netlify**, use the same build command/Output and set the same
> `VITE_API_BASE_URL`; the SPA fallback is handled by Vercel/Netlify automatically.

## 3. Using it

- Open the Vercel URL.
- Log in with the seeded admin: `admin@nutrimeasure.ai` / `AdminPass123!`
  (or register a new account).
- Go to **Analyze Meal**, upload a clear food photo, then **Save Meal to Daily Intake**.

## Env reference

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Render (auto) | Postgres connection string |
| `CORS_ORIGINS` | Render | Comma-separated allowed frontend origins |
| `DEMO_MODE` / `CHATBOT_DEMO_MODE` | Render | Use deterministic demo ML/chatbot when weights/keys absent |
| `VITE_API_BASE_URL` | Vercel/Netlify | Backend base URL the frontend calls in production |
| `SECRET_KEY` / `JWT_SECRET_KEY` | Render (auto) | App/JWT secrets |

## Local / Docker (alternative)

```bash
docker-compose up --build
# frontend: http://localhost:5173   backend: http://localhost:5000
```
