

---

# Me-API Playground (Track A — Backend Assessment)

Minimal “**Me-API**” that stores **my profile** and **projects**, exposes a small REST API with **query endpoints**, and serves a **very basic UI** to view the data and search by skill.

* **Live URL:** [https://predusk-1.onrender.com](https://predusk-1.onrender.com)
* **Resume:** [https://drive.google.com/file/d/1gikfrtSiqEBoxq-JSSXTyztDpuJ8R8c1/view?usp=sharing](https://drive.google.com/file/d/1gikfrtSiqEBoxq-JSSXTyztDpuJ8R8c1/view?usp=sharing)
* **Stack:** Node.js · Express · MongoDB Atlas · Plain HTML/JS (CSP-safe, no inline scripts)

---

## Features

* **Profile** + **Projects** stored in MongoDB
* **Query endpoints**:

  * `GET /api/projects?skill=…` (fuzzy skill match — e.g., `node js` → `Node.js/NodeJS`, `socket` → `Socket.IO`)
  * `GET /api/skills/top` (aggregate from profile + projects)
  * `GET /api/search?q=…` (text search across projects + profile)
* **Minimal UI** at `/` to call all endpoints
* **Production-minded touches:** optional admin key for write routes, optional rate-limit

---

## Architecture

```
Browser (Minimal UI at /public)
     |
     |  fetch()
     v
Express (Node.js)
  ├─ Routes: /health, /api/profile, /api/projects, /api/skills/top, /api/search
  ├─ Middleware: JSON body, CORS, (optional) rate-limit, ADMIN key for writes
  └─ Mongoose Models: Profile, Project  →  MongoDB Atlas (me_api DB)
```

---

## Quick Start (Local)

```bash
# 1) Install
npm i

# 2) Configure environment
cp .env.example .env   # then edit .env (see below)

# 3) (Optional) Seed with my real profile & projects
npm run seed

# 4) Run dev server
npm run dev            # http://localhost:8080
```

**.env**

```env
MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.<id>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_DB=me_api

# Optional but recommended for write protection:
ADMIN_KEY=supersecret123

# If UI and API are on one service (as deployed), same-origin is fine.
# If you host the UI elsewhere, list that origin here (comma-separated).
CORS_ORIGIN=https://predusk-1.onrender.com
```

---

## API Endpoints

### Health

`GET /health` → `200 {"status":"ok"}`

### Profile

* `GET /api/profile` → returns single profile (or `{}` if none)
* `POST /api/profile` → create once (**protected**)
* `PUT /api/profile` → upsert/update (**protected**)

> **Protected routes header:** `x-admin-key: <ADMIN_KEY>`

### Projects

* `GET /api/projects?skill=<string>&page=&limit=`
  Fuzzy match: `"node js"` → `Node.js`/`NodeJS`, `"socket"` → `Socket.IO`, `"mongo"` → `MongoDB`
* `POST /api/projects` (**protected**) → add a project

### Top Skills

* `GET /api/skills/top` → aggregated skills (projects + profile)

### Search

* `GET /api/search?q=<text>` → `{"projects":[...], "profile":{...}|null}`
  (Mongo text index on project fields + regex across profile)

---

## Minimal UI (Very Basic)

* Served at `/`
* Buttons for: **Health**, **Profile**, **Projects by Skill**, **Top Skills**, **Search**
* Plain HTML + external JS (`public/index.html`, `public/app.js`) to satisfy CSP (no inline scripts)

---

## cURL Examples

```bash
# Health
curl https://predusk-1.onrender.com/health

# Profile (GET)
curl https://predusk-1.onrender.com/api/profile

# Projects by fuzzy skill
curl "https://predusk-1.onrender.com/api/projects?skill=node js"

# Top skills
curl https://predusk-1.onrender.com/api/skills/top

# Search across projects + profile
curl "https://predusk-1.onrender.com/api/search?q=socket"
```

**Protected write (PowerShell example):**

```powershell
$headers = @{ "x-admin-key" = "supersecret123" }   # match your .env
$body = '{"summary":"Updated summary from hosted test"}'
irm https://predusk-1.onrender.com/api/profile -Method Put -Headers $headers -ContentType "application/json" -Body $body
```

---

## Schema & Index

### Profile

```ts
{
  name: string,
  email: string,
  summary: string,
  links: {
    github?: string,
    linkedin?: string,
    portfolio?: string,
    other?: [{ label: string, url: string }]
  },
  education: [{ school, degree, start, end }],
  work: [{ company, role, start, end, description }],
  skills: string[]
}
```

### Project

```ts
{
  title: string,
  description: string,
  skills: string[],   // fuzzy filter uses this
  links: [{ label: string, url: string }]
}
```

**Indexes**

* Project: text index on `{ title, description, skills }` for `/api/search`.

---

## Deployment (Render)

1. **MongoDB Atlas → Network Access:** allow the service IP (for demo, `0.0.0.0/0`).
2. **Render → New Web Service → GitHub repo**

   * Runtime: Node 20+
   * Build: `npm i`
   * Start: `npm start`
3. **Env Vars on Render**

   ```
   MONGO_URI=...
   MONGO_DB=me_api
   ADMIN_KEY=supersecret123
   CORS_ORIGIN=https://predusk-1.onrender.com
   ```
4. Verify:

   * `GET https://predusk-1.onrender.com/health`
   * Open `https://predusk-1.onrender.com/` and click the buttons.

---

## Acceptance Criteria Mapping

* **/health 200** → `GET /health` ✅
* **Queries return correct filtered results** → `/api/projects?skill=…` (fuzzy), `/api/skills/top`, `/api/search?q=…` ✅
* **Seed data visible via UI** → page at `/` shows profile, projects by skill, skills, search ✅
* **README complete & reproducible** → setup, env, schema, cURL, live URL, resume ✅
* **URLs load without errors** → hosted `/` + API routes ✅

---

## Remarks / Trade-offs

* Scope intentionally small & **production-minded**: JSON errors, CSP-safe UI, optional `x-admin-key` guard on writes.
* No JWT/RBAC or CI to keep within timebox.
* Search is simple text index + regex for the profile; good enough for the brief.

### Next Steps (if extending)

* Tests with Jest + supertest
* Docker (compose for local Mongo + app)
* CI on push (lint/test/deploy)
* More UI polish (cards/tables), pagination controls

---

## License

MIT — use freely with attribution.

---

> *Reviewer tip*: To run locally, copy `.env.example` → `.env`, fill `MONGO_URI` & `MONGO_DB`, then `npm i && npm run seed && npm run dev`, and open `http://localhost:8080/` .
