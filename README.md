# Task Management System — Advanced Web Development Frameworks (ITUE301)
## Charotar University of Science and Technology (CHARUSAT)
**Student Name:** Fenil Kardani &bull; **ID:** D25IT136 &bull; **Repository:** [AWDF-PR6-FullStack](https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack)

---

## ⚡ Practical 9: In-Memory Caching and Query Optimization (node-cache)

### Overview
Practical 9 implements server-side in-memory caching in the Node.js/Express backend using `node-cache`. It caches high-frequency read queries (`GET /tasks`, `GET /tasks/:id`), guarantees strict cache consistency with invalidation hooks across all mutations (`POST`, `PUT`, `DELETE`), and provides live cache metrics via `/cache/stats`.

Comprehensive practical report: [`docs/PRACTICAL_9_REPORT.md`](./docs/PRACTICAL_9_REPORT.md).

### Architecture & Caching Flow
```text
GET /tasks request
  │
  ▼
Cache check (node-cache: key 'all_tasks')
  ├── HIT  ──► Return cached data immediately (Response Time: ~3.1ms, Header X-Cache: HIT)
  └── MISS ──► Query MongoDB ──► Store in cache (TTL: 60s) ──► Return data (X-Cache: MISS)

POST/PUT/DELETE /tasks
  │
  ▼
Write to MongoDB ──► Invalidate cache keys ('all_tasks', 'task_:id') ──► Stale data is never served
```

### Empirical Performance Comparison (3 Sample Benchmark)

| Test Condition | Sample 1 | Sample 2 | Sample 3 | Average Response Time | Cache Header (`X-Cache`) | Database Impact |
|---|---|---|---|---|---|---|
| **Uncached (Direct MongoDB Read)** | 12.98 ms | 8.07 ms | 7.97 ms | **9.67 ms** | `MISS` | Reads from MongoDB collection |
| **Cached (`node-cache` In-Memory)** | 5.18 ms | 3.53 ms | 3.10 ms | **3.94 ms** | `HIT` | 0 database queries (Served from RAM) |

**Performance Improvement:**
- **Speedup:** **2.5x Faster** API responses.
- **Latency Reduction:** **59.3% drop** in response latency.
- **Database Load:** Eliminates 100% of repeated read roundtrips during the 60-second TTL window.

### Key Features Implemented in Practical 9:
1. **In-Memory Caching:** Initialized `node-cache` instance with `stdTTL: 60s` in [`backend/cache.js`](./backend/cache.js).
2. **Collection Caching (`GET /tasks`):** Evaluates `cache.get('all_tasks')` before hitting the database.
3. **Single-Item Caching (`GET /tasks/:id`):** Caches individual task records under `task_${id}` (Supplementary Problem 1).
4. **Cache Invalidation on Mutation:** Immediately deletes `all_tasks` and `task_${id}` upon `POST`, `PUT`, or `DELETE`.
5. **Cache Instrumentation & Debug Endpoint:** Real-time metrics at `GET /cache/stats` tracking hits, misses, hit rate, and active keys (Supplementary Problem 2).

---

## ⚡ Practical 8: Performance Optimization & Lazy Loading in React

### Overview
Practical 8 enhances the React frontend of the full-stack Task Management application by implementing **route-based code splitting** and **component-level lazy loading** using `React.lazy()` and `<Suspense>`. This significantly reduces initial bundle size and accelerates First Contentful Paint (FCP) and Time to Interactive (TTI).

Comprehensive report: [`docs/PRACTICAL_8_REPORT.md`](./docs/PRACTICAL_8_REPORT.md).

### Before vs After Performance Comparison (Vite Build Output)

| Metric / Asset | Before Optimization (Single Bundle) | After Optimization (Code-Split) | Difference / Impact |
|---|---|---|---|
| **Main JS Bundle** | `457.34 kB` (`index-DILdhyxu.js`) | `262.50 kB` (`index-DHF2zVcj.js`) | **-194.84 kB (-42.6%)** |
| **Initial JS Download (Route `/`)** | `457.34 kB` | `268.14 kB` (`index` + `Home`) | **-189.20 kB (-41.4%)** |
| **Projects Route Chunk** | Included in main bundle | `3.81 kB` (`Projects-*.js`) | Downloaded only on `/projects` |
| **Contact Route Chunk** | Included in main bundle | `3.67 kB` (`Contact-*.js`) | Downloaded only on `/contact` |
| **Analytics Route Chunk** | Included in main bundle | `3.15 kB` (`Analytics-*.js`) | Downloaded only on `/analytics` |
| **Chart.js Heavy Library** | Included in main bundle (`180.6 kB`) | `180.61 kB` (`chart-vendor-*.js`) | Isolated & loaded on demand |
| **Number of JS Chunks** | 1 Monolithic File | 7 Discrete Chunks | Independent caching & delivery |
| **Simulated Load Time (Slow 3G)** | ~3.42s | ~1.85s | **~46% Faster Initial Paint** |

---

## 🛠️ Project Structure

```text
AWDF-PR6-FullStack/
├── backend/
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── cache.js                 # Practical 9: node-cache wrapper & metrics tracker
│   ├── benchmark_caching.js     # Practical 9: Automated 3-sample response benchmark
│   ├── server.js                # Express API with caching & invalidation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DelayedFallback.jsx
│   │   │   ├── LoadingFallback.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskAnalyticsChart.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Projects.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── screenshots_p9/          # Postman & terminal evidence for Practical 9
│   ├── screenshots/             # UI & DevTools evidence for Practical 8
│   ├── PRACTICAL_8_REPORT.md
│   └── PRACTICAL_9_REPORT.md
├── AWDF_Practical_8_D25IT136.docx
├── AWDF_Practical_9_D25IT136.docx
├── .gitignore
└── README.md
```

---

## 🚀 Running the Project & Testing Caching

### 1. Start MongoDB & Backend Server
```bash
cd backend
npm install
node server.js
```

### 2. Run Automated Caching Benchmark
In a separate terminal:
```bash
cd backend
node benchmark_caching.js
```
This runs 3 uncached requests, 3 cached requests, verifies invalidation on a POST write, and queries `/cache/stats`!

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🎓 Academic Deliverables
- **Author:** Fenil Kardani (`D25IT136`)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Course:** ITUE301 — Advanced Web Development Frameworks
- **GitHub Repository:** [KardaniFenilKrushnkant/AWDF-PR6-FullStack](https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack)
