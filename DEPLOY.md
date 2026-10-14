# Deploying FitTrack with the real backend

Frontend → Netlify (already done). Backend → Render. Database → MongoDB Atlas.

The app picks its mode automatically:
- `VITE_API_URL` **not set** → browser-only demo mode (localStorage). 
- `VITE_API_URL` **set**     → real accounts + workouts stored in MongoDB.

## 1. MongoDB Atlas (free database)
1. Create a free cluster at https://www.mongodb.com/atlas.
2. **Database Access** → add a user (username + password).
3. **Network Access** → allow access from anywhere (`0.0.0.0/0`). Render's free tier has no fixed IP.
4. **Connect → Drivers** → copy the connection string and put your password in it.
   Add the database name before the `?`, e.g. `...mongodb.net/fittrack?retryWrites=true...`

## 2. Try it locally first
```bash
cd server
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm test                  # backend tests (no database needed)
npm run dev               # API on http://localhost:5000
```
In another terminal, from the project root:
```bash
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm install && npm run dev
```
Register an account — it should appear in Atlas under `fittrack → users`.

## 3. Deploy the API on Render
1. Push this repo to GitHub.
2. Render → **New → Web Service** → pick the repo.
3. Settings: **Root Directory** `server` · **Build** `npm install` · **Start** `npm start`
   (or use **New → Blueprint** to read `render.yaml`).
4. Environment variables:
   - `MONGODB_URI` = your Atlas string
   - `JWT_SECRET`  = long random string
   - `CLIENT_URL`  = `https://fitnessracker.netlify.app` (your Netlify URL, no trailing slash)
5. Deploy, then open `https://<your-service>.onrender.com/health` → should show `{"ok":true}`.

Free instances sleep when idle, so the first request after a break can take up to a minute.
The app shows a message for this.

## 4. Point Netlify at the API
Netlify → Site settings → **Environment variables** → add
`VITE_API_URL` = `https://<your-service>.onrender.com` (no trailing slash and no `/api`),
then **Deploys → Trigger deploy → Clear cache and deploy**.
(Vite bakes the variable in at build time, so a redeploy is required.)

## Notes
- Passwords are hashed with bcrypt; sessions use 7-day JWTs stored in the browser.
- Water intake and the daily goal checkbox still live in the browser (per account, per day).
- Not yet included: rate limiting on login, email verification, password reset.

## Troubleshooting: "workouts are not saving in MongoDB"
1. **Look at the badge on the Workouts page.**
   - `💾 Saving in this browser only` → `VITE_API_URL` is not set (or you didn't restart / redeploy after setting it). Locally: create `.env.local` in the project root with `VITE_API_URL=http://localhost:5000`, then **stop and restart `npm run dev`**. On Netlify: set the variable, then Clear cache and deploy.
   - `☁️ Saving to database` → requests go to the API; continue below.
2. **Open `<API URL>/health`.** It should show `"dbConnected": true` and the database name. If not, fix `MONGODB_URI` (password special characters must be URL-encoded; Atlas Network Access must allow your IP / 0.0.0.0/0).
3. **Check the right database.** If your URI has no database name, data goes to a database called `test`. Look for collections `users` and `workouts` in the database named in `/health`.
4. **Register a NEW account after switching on the API.** Accounts created earlier in browser-only mode do not exist in MongoDB, so log out and register again.
5. **Make sure you run the new server** (`cd server && npm run dev`, entry `server.js`), not the old `app.js` / practical files, and that port 5000 isn't taken by an old process.
6. Open the browser DevTools → Network tab, add a workout, and look at the `POST .../api/workouts` request: 401 = not logged in via the API, CORS error = `CLIENT_URL` doesn't match your site's URL.
