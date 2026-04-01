# Deployment

This project now has a production-oriented Docker setup separate from the local development setup.

## Services

- `frontend`: Vite app built into static assets and served by Nginx
- `backend`: FastAPI app
- `qdrant`: vector database
- `supabase`: external dependency for auth and storage

## Required secrets

Use a single root `.env` file based on `.env.prod.example`.

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `GOOGLE_API_KEY` or the active LLM provider key
- `QDRANT_URL` or `QDRANT_CLOUD_URL`
- `QDRANT_API_KEY` or `QDRANT_CLOUD_API_KEY`
- `DEFAULT_LLM`
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ALLOWED_ORIGINS`

## Start

```bash
cp .env.prod.example .env
docker compose --env-file .env -f docker-compose.prod.yml up --build -d
```

The frontend will be exposed on port `8080` and backend on `8000`.

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
- The backend accepts either `QDRANT_URL` or `QDRANT_CLOUD_URL`.
- If you want a local Qdrant container instead of Qdrant Cloud, start it with:

```bash
docker compose --env-file .env -f docker-compose.prod.yml --profile local-qdrant up --build -d
```
