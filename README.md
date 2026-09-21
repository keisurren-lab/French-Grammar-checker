# Correcteur — French Grammar Checker

A small web app that checks French text for grammar, agreement, and spelling
errors using the Claude API, and explains each fix.

## How it's built

- `index.html` — the frontend. Plain HTML/CSS/JS, no framework, no build step.
- `api/check.js` — a serverless function. It holds your Anthropic API key and
  calls the Claude API on the frontend's behalf, so the key never reaches
  the browser.

The frontend never talks to Anthropic directly — it POSTs to `/api/check`,
which Vercel runs on a server, not in anyone's browser.

## Get an API key

1. Go to https://console.anthropic.com and sign in (or create an account).
2. Go to **API Keys** and create a new key.
3. Copy it — you'll need it in the next step. Keep it secret; anyone with
   this key can make paid requests on your account.

## Deploy on Vercel (free)

1. Create a free account at https://vercel.com (you can sign up with GitHub).
2. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create french-grammar-checker --public --source=. --push
   ```
   (No `gh` CLI? Just create an empty repo on github.com and follow the
   push instructions it shows you.)
3. In the Vercel dashboard, click **Add New → Project**, and import that
   GitHub repo.
4. Before deploying, expand **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (the key you copied above)
5. Click **Deploy**. In under a minute you'll get a live URL like
   `https://french-grammar-checker.vercel.app` — that's yours to share,
   put on a resume, or link from LinkedIn.

Any time you push a new commit to GitHub, Vercel automatically redeploys.

## Running it locally first (optional but recommended)

```bash
npm install -g vercel
vercel dev
```

This spins up both the frontend and the `/api/check` function on your own
machine at `http://localhost:3000`, so you can test before deploying.
You'll be prompted to log in to Vercel and it'll ask for the same
`ANTHROPIC_API_KEY` — you can create a `.env` file locally with:

```
ANTHROPIC_API_KEY=your-key-here
```

## Cost

Each check costs a fraction of a cent — small personal projects rarely add
up to more than a few dollars a month. You can set a spending limit on
your Anthropic account under **Billing** in the console.
