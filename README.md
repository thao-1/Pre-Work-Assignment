# Dog Breed Search App

Deployed with Vercel: https://pre-work-assignment-ls3t.vercel.app/

A simple web app to search dog breeds and view details (image, temperament, lifespan, weight, height). It also includes an AI-powered Q&A using OpenAI.

## Features
- Search dog breeds powered by TheDogAPI
- Display breed image and key stats
- Ask natural-language questions via an OpenAI-backed endpoint
- Responsive, clean UI (fixed-size images, header box, cards)

## Tech Stack
- Frontend: Vite + Vanilla JS, HTML, CSS
- APIs: TheDogAPI (public), OpenAI Chat Completions (server-side)
- Hosting: Vercel (Serverless function at `api/ask.js`)

## Getting Started (Local)
1. Requirements
   - Node.js >= 18 (for built-in fetch)

2. Install dependencies
```bash
npm install
```

3. Environment variables
Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=sk-...
```
Note: In local dev, the Vite dev server uses a middleware defined in `vite.config.js` to proxy `/api/ask` and read `OPENAI_API_KEY`. Variables are not exposed to the browser.

4. Run the dev server
```bash
npm run dev
```
Then open http://localhost:3000

## Deploying to Vercel
1. Push the repo to GitHub (done).
2. In Vercel dashboard: Project → Settings → Environment Variables → add:
   - Name: `OPENAI_API_KEY`
   - Value: your key
   - Environments: Production and Preview
3. Redeploy. The serverless function `api/ask.js` reads `process.env.OPENAI_API_KEY`.

CLI alternative:
```bash
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_API_KEY preview
vercel --prod
```

## API Endpoints
- `GET https://api.thedogapi.com/v1/breeds` (public; rate-limited)
- `GET https://api.thedogapi.com/v1/images/search?breed_id=...` (public)
- `POST /api/ask` (serverless)
  - Body: `{ "question": string }`
  - Response: `{ "answer": string }`

## Project Structure
```
.
├── api/
│   └── ask.js            # Vercel serverless function for OpenAI
├── src/
│   ├── main.js           # UI logic + fetches
│   └── style.css         # Styles
├── index.html            # App shell
├── vite.config.js        # Vite config + local /api/ask dev middleware
├── package.json
└── .env                  # Local only (not committed)
```

## Troubleshooting
- OpenAI key not found
  - Ensure `OPENAI_API_KEY` is set in Vercel project settings for Production/Preview
  - Locally, ensure `.env` exists and restart `npm run dev` after changes
- 401/403/429 from TheDogAPI
  - The public endpoints work without a key but have stricter rate limits. Add a Dog API key if needed (and pass via `x-api-key`)
- Dev server errors after editing `vite.config.js`
  - Restart `npm run dev`

## License
MIT
