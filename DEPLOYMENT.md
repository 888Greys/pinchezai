# Deployment

This project now has a production-oriented Docker setup separate from the local development setup.

## Services

- `frontend`: Vite app built into static assets and served by Nginx
- `backend`: FastAPI app
- `qdrant`: vector database
- `supabase`: external dependency for auth and storage

## Required secrets

Set these in `backend/.env` on the server:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `GOOGLE_API_KEY` or the active LLM provider key
- `QDRANT_API_KEY` if you use Qdrant Cloud
- `DEFAULT_LLM`

Set these in a root `.env` file based on `.env.prod.example`:

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ALLOWED_ORIGINS`
- `QDRANT_URL`

## Start

```bash
cp .env.prod.example .env
cp backend/.env.example backend/.env
docker compose --env-file .env -f docker-compose.prod.yml up --build -d
```

The frontend will be exposed on port `8080`, backend on `8000`, and Qdrant on `6333`.

## Reverse proxy

Put Nginx, Caddy, or your edge proxy in front of:

- `app.your-domain` -> `http://server-ip:8080`
- `api.your-domain` -> `http://server-ip:8000`

Set:

- `VITE_API_URL=https://api.your-domain`
- `ALLOWED_ORIGINS=https://app.your-domain`

## Notes

- Keep the existing `docker-compose.yml` for development.
- The frontend requires Supabase env vars at build time.
- If you already use Qdrant Cloud, point `QDRANT_URL` there and remove the local `qdrant` service if desired.
