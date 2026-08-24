# Kerala Ayurveda Expressive Neural TTS Serverless Proxy

Free, high-performance Microsoft Edge Neural TTS API proxy engineered for Shopify Liquid blogs. Features dynamic SSML prosody modulation and millisecond-accurate word boundary extraction for synchronized text-to-speech highlighting.

---

## Project Structure

```
tts-serverless-service/
├── api/
│   └── tts.js          # Serverless Edge TTS handler & prosody engine
├── package.json        # Dependencies (msedge-tts, ws)
├── vercel.json         # Vercel routing & CORS headers configuration
├── .gitignore
└── README.md
```

---

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI
1. Open your terminal in this directory:
   ```bash
   cd tts-serverless-service
   ```
2. Run Vercel deploy:
   ```bash
   npx vercel
   ```
3. Follow the prompts (Select "Yes", keep defaults).
4. For production deployment:
   ```bash
   npx vercel --prod
   ```

### Option 2: Deploy via GitHub / Vercel Web Dashboard
1. Push this folder (`tts-serverless-service`) as its own standalone GitHub repository.
2. Open vercel.com -> Click "Add New Project".
3. Import your GitHub repository.
4. Click Deploy.

---

## Connecting to Shopify Theme

Once deployed, Vercel will provide your production URL (e.g. `https://your-tts-api.vercel.app`).

Your live endpoint is:
```
https://your-tts-api.vercel.app/api/tts
```

In your Shopify theme (`assets/ka-read-aloud.js`), configure:

```javascript
const TTS_ENDPOINT = window.KA_TTS_ENDPOINT || (
  (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
    ? `${window.location.protocol}//${window.location.hostname}:3456/api/tts`
    : 'https://your-tts-api.vercel.app/api/tts'
);
```

---

## Local Testing

To test this serverless function locally:
```bash
npm install
npm start
```
The server will run at: `http://localhost:3456/api/tts`
