# uiux_check

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Docker

The Docker image uses Node 22 and Next.js standalone output. The app stores local
history and leads in `/app/.data`, which is mounted as a named Docker volume.

```bash
cp .env.example .env
docker compose up --build
```

Open http://localhost:3000.

`OPENAI_API_KEY` is optional for local checks. If it is empty, the diagnosis API
returns a dummy result so the UI can still be exercised. SMTP, Redis, and Zoho
settings are also optional.
