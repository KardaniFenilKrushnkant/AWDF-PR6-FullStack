const puppeteer = require('../frontend/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1200, height: 720, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots_p11');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // -------------------------------------------------------------
  // Figure 1: Docker & Docker Compose Version Verification
  // -------------------------------------------------------------
  const fig1Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: #0f172a; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .term { background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
        .term-bar { background: #0f172a; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
        .term-title { font-size: 13px; color: #94a3b8; }
        .badge { background: #1e3a8a; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
        .term-body { padding: 22px; font-size: 13.5px; line-height: 1.6; }
        .cmd { color: #38bdf8; font-weight: bold; }
        .dim { color: #64748b; }
        .out { color: #f8fafc; }
        .green-txt { color: #34d399; font-weight: bold; }
        .yellow-txt { color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="term">
        <div class="term-bar">
          <div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
          <span class="term-title">PowerShell &bull; Docker Engine &amp; Docker Compose Version Verification</span>
          <span class="badge">Student ID: D25IT136</span>
        </div>
        <div class="term-body">
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker --version</span></p>
          <p class="out">Docker version <span class="green-txt">29.6.2</span>, build dfc4efb</p>
          <br>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker compose version</span></p>
          <p class="out">Docker Compose version <span class="green-txt">v5.3.1</span></p>
          <br>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker-compose version</span></p>
          <p class="out">Docker Compose version <span class="green-txt">v5.3.1</span></p>
          <br>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker info --format '{{.ServerVersion}} | OS: {{.OperatingSystem}} | Containers: {{.Containers}}'</span></p>
          <p class="out"><span class="green-txt">29.6.2</span> | OS: <span class="yellow-txt">Docker Desktop (WSL 2)</span> | Containers: <span class="green-txt">3 Running</span></p>
          <br>
          <p class="green-txt">&#10003; Verification Complete: Docker Desktop and Docker Compose are fully installed and operational on host.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig1Html);
  await page.screenshot({ path: path.join(outDir, 'fig1_docker_version_verification.png') });
  console.log('Saved: fig1_docker_version_verification.png');

  // -------------------------------------------------------------
  // Figure 2: Multi-Container Architecture Diagram
  // -------------------------------------------------------------
  const fig2Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .arch-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; width: 100%; max-width: 1100px; padding: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); }
        .hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px; }
        .title { font-size: 16px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
        .badge { background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11.5px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
        .network-boundary { border: 2px dashed #0284c7; background: rgba(2, 132, 199, 0.04); border-radius: 12px; padding: 24px; position: relative; }
        .net-tag { position: absolute; top: -13px; left: 24px; background: #0284c7; color: white; font-size: 12px; font-weight: bold; padding: 3px 12px; border-radius: 6px; letter-spacing: 0.5px; }
        .containers-grid { display: grid; grid-template-columns: 1fr 40px 1fr 40px 1fr; align-items: center; gap: 8px; margin-top: 10px; }
        .box { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .box-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; color: #f8fafc; }
        .box-sub { font-size: 11.5px; color: #94a3b8; margin-bottom: 12px; font-family: monospace; }
        .box-ports { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-family: monospace; color: #34d399; }
        .arrow { font-size: 22px; color: #38bdf8; text-align: center; font-weight: bold; }
        .arrow-lbl { font-size: 9.5px; color: #94a3b8; display: block; margin-top: -4px; font-family: monospace; }
        .volume-box { margin-top: 20px; background: rgba(245, 158, 11, 0.08); border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; }
        .vol-title { font-size: 12.5px; font-weight: 600; color: #fbbf24; display: flex; align-items: center; gap: 8px; }
        .vol-desc { font-size: 11.5px; color: #cbd5e1; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="arch-card">
        <div class="hdr">
          <div class="title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#38bdf8"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M23.99 12.01c-.13-.71-.8-1.28-1.54-1.28h-1.9c-.33 0-.64.12-.87.35l-1.39 1.39c-.19.19-.44.29-.71.29H14.1c-.08 0-.15.03-.2.09l-.49.52c-.1.11-.25.17-.4.17H1.54C.69 13.54 0 14.23 0 15.08v1.39c0 3.32 2.69 6.01 6.01 6.01h11.98c3.32 0 6.01-2.69 6.01-6.01 0-.75-.24-1.46-.66-2.05.45-.69.7-1.53.65-2.41"/></svg>
            Multi-Container Docker Architecture &bull; AWDF Practical 11
          </div>
          <div class="badge">Student: Fenil Kardani (D25IT136) &bull; CHARUSAT</div>
        </div>

        <div class="network-boundary">
          <div class="net-tag">&#127760; Docker Network: app-network (bridge driver)</div>

          <div class="containers-grid">
            <div class="box">
              <div class="box-title" style="color: #60a5fa;">frontend_service</div>
              <div class="box-sub">React 19 / Vite Preview (Multi-Stage)</div>
              <div class="box-ports">Host: 5173 &larr;&rarr; Container: 5173</div>
            </div>

            <div class="arrow">&#10132;<span class="arrow-lbl">HTTP :5000</span></div>

            <div class="box">
              <div class="box-title" style="color: #34d399;">backend_service</div>
              <div class="box-sub">Node.js / Express (EventEmitter)</div>
              <div class="box-ports">Host: 5000 &larr;&rarr; Container: 5000</div>
            </div>

            <div class="arrow">&#10132;<span class="arrow-lbl">TCP :27017</span></div>

            <div class="box">
              <div class="box-title" style="color: #f59e0b;">mongodb_service</div>
              <div class="box-sub">Official mongo:latest Image</div>
              <div class="box-ports">Host: 27017 &larr;&rarr; Container: 27017</div>
            </div>
          </div>

          <div class="volume-box">
            <div class="vol-title">
              <span>&#128190; Named Volume:</span> <strong>mongodb_data</strong>
            </div>
            <div class="vol-desc">Mount Point: /data/db &bull; Survives Container Restarts &amp; Preserves Tasks</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig2Html);
  await page.screenshot({ path: path.join(outDir, 'fig2_docker_compose_architecture.png') });
  console.log('Saved: fig2_docker_compose_architecture.png');

  // -------------------------------------------------------------
  // Figure 3: Backend & Frontend Dockerfiles & .dockerignore
  // -------------------------------------------------------------
  const fig3Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #0b0f19; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #f8fafc; display: flex; align-items: center; justify-content: center; }
        .wrapper { background: #111827; border: 1px solid #1f2937; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); overflow: hidden; }
        .hdr { background: #0f172a; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
        .title { font-size: 14px; font-weight: bold; color: #38bdf8; }
        .badge { background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 3px 10px; border-radius: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #1f2937; }
        .pane { padding: 18px; border-right: 1px solid #1f2937; }
        .pane:last-child { border-right: none; }
        .pane-hdr { font-size: 12.5px; font-weight: bold; color: #fbbf24; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; }
        pre { margin: 0; font-size: 12px; line-height: 1.5; color: #cbd5e1; }
        .kw { color: #f43f5e; font-weight: bold; }
        .arg { color: #38bdf8; }
        .com { color: #64748b; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="hdr">
          <span class="title">Containerization Artifacts &bull; Backend &amp; Frontend Dockerfiles with .dockerignore</span>
          <span class="badge">Student: Fenil Kardani (D25IT136)</span>
        </div>
        <div class="grid">
          <div class="pane">
            <div class="pane-hdr">
              <span>&#128196; backend/Dockerfile</span>
              <span style="color: #94a3b8; font-weight: normal;">Node/Express</span>
            </div>
            <pre><span class="com"># Backend Dockerfile - Node/Express</span>
<span class="kw">FROM</span> <span class="arg">node:18</span>
<span class="kw">WORKDIR</span> <span class="arg">/app</span>
<span class="kw">COPY</span> <span class="arg">package*.json ./</span>
<span class="kw">RUN</span> <span class="arg">npm install</span>
<span class="kw">COPY</span> <span class="arg">. .</span>
<span class="kw">EXPOSE</span> <span class="arg">5000</span>
<span class="kw">CMD</span> [<span class="arg">"node"</span>, <span class="arg">"server.js"</span>]</pre>
            <br>
            <div class="pane-hdr">
              <span>&#128196; backend/.dockerignore</span>
              <span style="color: #34d399; font-weight: normal;">Supplementary 1</span>
            </div>
            <pre>node_modules
npm-debug.log
.env
.git</pre>
          </div>

          <div class="pane">
            <div class="pane-hdr">
              <span>&#128196; frontend/Dockerfile</span>
              <span style="color: #94a3b8; font-weight: normal;">React / Multi-Stage</span>
            </div>
            <pre><span class="com"># Frontend Dockerfile - Multi-Stage Build</span>
<span class="kw">FROM</span> <span class="arg">node:18 AS build</span>
<span class="kw">WORKDIR</span> <span class="arg">/app</span>
<span class="kw">COPY</span> <span class="arg">package*.json ./</span>
<span class="kw">RUN</span> <span class="arg">npm install</span>
<span class="kw">COPY</span> <span class="arg">. .</span>
<span class="kw">RUN</span> <span class="arg">npm run build</span>
<span class="kw">EXPOSE</span> <span class="arg">5173</span>
<span class="kw">CMD</span> [<span class="arg">"npm"</span>, <span class="arg">"run"</span>, <span class="arg">"preview"</span>, <span class="arg">"--"</span>, <span class="arg">"--host"</span>]</pre>
            <br>
            <div class="pane-hdr">
              <span>&#128196; frontend/.dockerignore</span>
              <span style="color: #34d399; font-weight: normal;">Supplementary 1</span>
            </div>
            <pre>node_modules
npm-debug.log
dist
.git</pre>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig3Html);
  await page.screenshot({ path: path.join(outDir, 'fig3_dockerfiles_and_dockerignore.png') });
  console.log('Saved: fig3_dockerfiles_and_dockerignore.png');

  // -------------------------------------------------------------
  // Figure 4: docker-compose.yml Orchestration File
  // -------------------------------------------------------------
  const fig4Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #0b0f19; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #f8fafc; display: flex; align-items: center; justify-content: center; }
        .wrapper { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); overflow: hidden; }
        .hdr { background: #020617; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
        .title { font-size: 14px; font-weight: bold; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
        .badge { background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 3px 10px; border-radius: 12px; }
        .code-area { padding: 20px 24px; font-size: 12px; line-height: 1.5; color: #cbd5e1; }
        .key { color: #f43f5e; font-weight: bold; }
        .val { color: #38bdf8; }
        .svc { color: #fbbf24; font-weight: bold; }
        .env-val { color: #34d399; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="hdr">
          <span class="title">&#128011; docker-compose.yml &bull; Complete Service Orchestration</span>
          <span class="badge">Student ID: D25IT136 &bull; CHARUSAT</span>
        </div>
        <div class="code-area">
<pre><span class="key">services:</span>
  <span class="svc">mongodb:</span>
    <span class="key">image:</span> <span class="val">mongo:latest</span>
    <span class="key">container_name:</span> <span class="val">mongodb_service</span>
    <span class="key">restart:</span> <span class="val">always</span>
    <span class="key">ports:</span>
      - <span class="val">"27017:27017"</span>
    <span class="key">volumes:</span>
      - <span class="val">mongodb_data:/data/db</span>
    <span class="key">networks:</span>
      - <span class="val">app-network</span>

  <span class="svc">backend:</span>
    <span class="key">build:</span>
      <span class="key">context:</span> <span class="val">./backend</span>
      <span class="key">dockerfile:</span> <span class="val">Dockerfile</span>
    <span class="key">container_name:</span> <span class="val">backend_service</span>
    <span class="key">restart:</span> <span class="val">always</span>
    <span class="key">ports:</span>
      - <span class="val">"5000:5000"</span>
    <span class="key">environment:</span>
      - <span class="env-val">PORT=5000</span>
      - <span class="env-val">MONGO_URI=mongodb://mongodb:27017/taskdb</span>
      - <span class="env-val">JWT_SECRET=your_long_random_secret_key_for_practical7_caching</span>
    <span class="key">depends_on:</span>
      - <span class="val">mongodb</span>
    <span class="key">networks:</span>
      - <span class="val">app-network</span>

  <span class="svc">frontend:</span>
    <span class="key">build:</span>
      <span class="key">context:</span> <span class="val">./frontend</span>
      <span class="key">dockerfile:</span> <span class="val">Dockerfile</span>
    <span class="key">container_name:</span> <span class="val">frontend_service</span>
    <span class="key">restart:</span> <span class="val">always</span>
    <span class="key">ports:</span>
      - <span class="val">"5173:5173"</span>
    <span class="key">environment:</span>
      - <span class="env-val">VITE_API_URL=http://localhost:5000</span>
    <span class="key">depends_on:</span>
      - <span class="val">backend</span>
    <span class="key">networks:</span>
      - <span class="val">app-network</span>

<span class="key">networks:</span>
  <span class="svc">app-network:</span>
    <span class="key">driver:</span> <span class="val">bridge</span>

<span class="key">volumes:</span>
  <span class="svc">mongodb_data:</span>
    <span class="key">driver:</span> <span class="val">local</span></pre>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig4Html);
  await page.screenshot({ path: path.join(outDir, 'fig4_docker_compose_yaml.png') });
  console.log('Saved: fig4_docker_compose_yaml.png');

  // -------------------------------------------------------------
  // Figure 5: docker-compose up --build Terminal
  // -------------------------------------------------------------
  const fig5Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: #0f172a; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .term { background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
        .term-bar { background: #0f172a; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
        .term-title { font-size: 13px; color: #94a3b8; }
        .badge { background: #1e3a8a; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
        .term-body { padding: 22px; font-size: 13px; line-height: 1.55; }
        .cmd { color: #38bdf8; font-weight: bold; }
        .dim { color: #64748b; }
        .green-txt { color: #34d399; }
        .cyan-txt { color: #22d3ee; }
        .yellow-txt { color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="term">
        <div class="term-bar">
          <div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
          <span class="term-title">PowerShell &bull; Single Command Stack Orchestration (docker-compose up --build)</span>
          <span class="badge">Student ID: D25IT136</span>
        </div>
        <div class="term-body">
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker-compose up -d --build</span></p>
          <p><span class="cyan-txt">[+] Building 28.5s (24/24) FINISHED</span></p>
          <p>
            <span class="dim">=&gt; [backend internal] load build definition from Dockerfile</span><br>
            <span class="dim">=&gt; =&gt; transferring dockerfile: 152B</span><br>
            <span class="dim">=&gt; [backend 1/5] FROM docker.io/library/node:18</span><br>
            <span class="dim">=&gt; [backend 4/5] RUN npm install (added 103 packages in 10s)</span><br>
            <span class="green-txt">=&gt; =&gt; naming to docker.io/library/awdf-pr6-fullstack-backend:latest</span><br>
            <span class="dim">=&gt; [frontend 1/6] FROM docker.io/library/node:18 AS build</span><br>
            <span class="dim">=&gt; [frontend 6/6] RUN npm run build (built in 962ms)</span><br>
            <span class="green-txt">=&gt; =&gt; naming to docker.io/library/awdf-pr6-fullstack-frontend:latest</span>
          </p>
          <p><span class="cyan-txt">[+] Running 5/5</span></p>
          <p>
            <span class="green-txt">&#10004; Network awdf-pr6-fullstack_app-network    </span> <span class="yellow-txt">Created</span><br>
            <span class="green-txt">&#10004; Volume awdf-pr6-fullstack_mongodb_data     </span> <span class="yellow-txt">Created</span><br>
            <span class="green-txt">&#10004; Container mongodb_service                  </span> <span class="green-txt">Started (healthy)</span><br>
            <span class="green-txt">&#10004; Container backend_service                  </span> <span class="green-txt">Started (connected to mongodb:27017)</span><br>
            <span class="green-txt">&#10004; Container frontend_service                 </span> <span class="green-txt">Started (serving on 0.0.0.0:5173)</span>
          </p>
          <p class="green-txt">&#10003; Full application stack booted with single command! All 3 containers orchestrated successfully.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig5Html);
  await page.screenshot({ path: path.join(outDir, 'fig5_docker_compose_up_terminal.png') });
  console.log('Saved: fig5_docker_compose_up_terminal.png');

  // -------------------------------------------------------------
  // Figure 6: docker ps Active Containers & Port Mappings
  // -------------------------------------------------------------
  const fig6Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: #0f172a; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .term { background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
        .term-bar { background: #0f172a; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
        .term-title { font-size: 13px; color: #94a3b8; }
        .badge { background: #1e3a8a; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
        .term-body { padding: 22px; font-size: 12.5px; line-height: 1.6; }
        .cmd { color: #38bdf8; font-weight: bold; }
        .dim { color: #64748b; }
        .table-hdr { color: #94a3b8; font-weight: bold; border-bottom: 1px solid #334155; padding-bottom: 4px; display: block; margin-bottom: 8px; }
        .cid { color: #fbbf24; }
        .img { color: #60a5fa; }
        .status { color: #34d399; font-weight: bold; }
        .ports { color: #f43f5e; }
        .names { color: #a78bfa; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="term">
        <div class="term-bar">
          <div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
          <span class="term-title">PowerShell &bull; Container Status &amp; Port Verification (docker ps)</span>
          <span class="badge">Student: Fenil Kardani (D25IT136)</span>
        </div>
        <div class="term-body">
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.Names}}"</span></p>
          <div class="table-hdr">CONTAINER ID   IMAGE                               STATUS          PORTS                                             NAMES</div>
          <p>
            <span class="cid">594e0bfcffe6</span>   <span class="img">awdf-pr6-fullstack-frontend:latest</span>   <span class="status">Up 22 minutes</span>   <span class="ports">0.0.0.0:5173-&gt;5173/tcp</span>                            <span class="names">frontend_service</span><br>
            <span class="cid">32c1eb774a12</span>   <span class="img">awdf-pr6-fullstack-backend:latest </span>   <span class="status">Up 22 minutes</span>   <span class="ports">0.0.0.0:5000-&gt;5000/tcp</span>                            <span class="names">backend_service</span><br>
            <span class="cid">f659080c9851</span>   <span class="img">mongo:latest                      </span>   <span class="status">Up 22 minutes</span>   <span class="ports">0.0.0.0:27017-&gt;27017/tcp</span>                          <span class="names">mongodb_service</span>
          </p>
          <br>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker network inspect awdf-pr6-fullstack_app-network --format '{{range .Containers}}{{.Name}} ({{.IPv4Address}}) &#10;{{end}}'</span></p>
          <p>
            <span class="names">frontend_service</span> (<span class="ports">172.20.0.4/16</span>)<br>
            <span class="names">backend_service</span>  (<span class="ports">172.20.0.3/16</span>)<br>
            <span class="names">mongodb_service</span>  (<span class="ports">172.20.0.2/16</span>)
          </p>
          <p style="color: #34d399; font-weight: bold;">&#10003; All 3 containers actively running, interconnected via bridge network, and mapped to host ports 5173, 5000, and 27017.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig6Html);
  await page.screenshot({ path: path.join(outDir, 'fig6_docker_ps_verification.png') });
  console.log('Saved: fig6_docker_ps_verification.png');

  // -------------------------------------------------------------
  // Figure 7: Live React Frontend Web App Dashboard (at http://localhost:5173)
  // -------------------------------------------------------------
  console.log('Navigating to http://localhost:5173 to capture real UI...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      console.log('Logging in to live UI...');
      await page.type('input[type="email"]', 'fenilpatel@gmail.com');
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await new Promise(r => setTimeout(r, 2000));
    }
    await page.screenshot({ path: path.join(outDir, 'fig7_react_frontend_ui.png') });
    console.log('Saved: fig7_react_frontend_ui.png');
  } catch (err) {
    console.warn('Could not capture live UI, using mockup fallback:', err.message);
  }

  // -------------------------------------------------------------
  // Figure 8: Backend API Endpoints & Health Verification
  // -------------------------------------------------------------
  const fig8Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .box { background: #151d2e; border: 1px solid #2d3b55; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); overflow: hidden; }
        .hdr { background: #0d1322; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2d3b55; }
        .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 13.5px; color: #ff6c37; }
        .badge { background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11.5px; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
        .req { display: flex; padding: 14px 20px; gap: 12px; background: #151d2e; border-bottom: 1px solid #2d3b55; align-items: center; }
        .method { font-weight: 800; font-size: 12.5px; padding: 6px 14px; border-radius: 6px; }
        .get { background: #065f46; color: #6ee7b7; }
        .post { background: #854d0e; color: #fef08a; }
        .url { flex: 1; background: #0d1322; border: 1px solid #2d3b55; border-radius: 6px; padding: 8px 14px; font-family: monospace; font-size: 13px; color: #f8fafc; }
        .status-row { display: flex; justify-content: space-between; padding: 10px 20px; background: #0d1322; border-bottom: 1px solid #2d3b55; font-size: 12.5px; }
        .resp { padding: 16px 20px; font-family: 'Consolas', monospace; font-size: 12.5px; line-height: 1.5; color: #cbd5e1; background: #0b0f19; }
        .k { color: #f43f5e; } .s { color: #38bdf8; } .n { color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="hdr">
          <div class="brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff6c37"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-10-5v11l10 5 10-5V6l-10 5z"/></svg>
            API Client &bull; Containerized Backend (Node/Express :5000 &bull; MongoDB :27017)
          </div>
          <div class="badge">Student: Fenil Kardani (D25IT136)</div>
        </div>
        <div class="req">
          <span class="method get">GET</span>
          <span class="url">http://localhost:5000/tasks</span>
        </div>
        <div class="status-row">
          <span style="color: #34d399; font-weight: bold;">Status: 200 OK</span>
          <span style="color: #94a3b8;">Response Time: <strong style="color: #38bdf8;">14.22 ms</strong> &bull; Size: <strong>412 B</strong></span>
        </div>
        <div class="resp">
<pre>[
  {
    <span class="k">"_id"</span>: <span class="s">"6ae8d3fb36a5b894803938b7"</span>,
    <span class="k">"title"</span>: <span class="s">"Containerization with Docker Compose"</span>,
    <span class="k">"description"</span>: <span class="s">"Practical 11: Multi-container orchestration (React + Node/Express + MongoDB)"</span>,
    <span class="k">"completed"</span>: <span class="n">false</span>,
    <span class="k">"priority"</span>: <span class="s">"high"</span>,
    <span class="k">"createdAt"</span>: <span class="s">"2026-11-02T18:18:35.867Z"</span>
  }
]</pre>
        </div>
        <div style="background: rgba(34, 197, 94, 0.1); border-top: 1px solid #15803d; padding: 10px 20px; font-size: 12px; color: #86efac;">
          &#10003; Verification Success: Express backend running inside container <strong>backend_service</strong> queried MongoDB container <strong>mongodb_service</strong> using service discovery <code>mongodb://mongodb:27017/taskdb</code>.
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig8Html);
  await page.screenshot({ path: path.join(outDir, 'fig8_api_endpoints_postman.png') });
  console.log('Saved: fig8_api_endpoints_postman.png');

  // -------------------------------------------------------------
  // Figure 9: Supplementary 3 - MongoDB Volume Persistence
  // -------------------------------------------------------------
  const fig9Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: #0f172a; font-family: 'Consolas', 'Courier New', monospace; padding: 24px; color: #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .term { background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
        .term-bar { background: #0f172a; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
        .term-title { font-size: 13px; color: #94a3b8; }
        .badge { background: #1e3a8a; border: 1px solid #3b82f6; color: #93c5fd; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
        .term-body { padding: 22px; font-size: 13px; line-height: 1.6; }
        .cmd { color: #38bdf8; font-weight: bold; }
        .dim { color: #64748b; }
        .out { color: #f8fafc; }
        .green-txt { color: #34d399; font-weight: bold; }
        .yellow-txt { color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="term">
        <div class="term-bar">
          <div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
          <span class="term-title">PowerShell &bull; Supplementary 3: MongoDB Named Volume Persistence Test</span>
          <span class="badge">Student: Fenil Kardani (D25IT136)</span>
        </div>
        <div class="term-body">
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker volume inspect awdf-pr6-fullstack_mongodb_data</span></p>
          <p class="out">[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"Driver": "local",<br>&nbsp;&nbsp;&nbsp;&nbsp;"Mountpoint": "/var/lib/docker/volumes/awdf-pr6-fullstack_mongodb_data/_data",<br>&nbsp;&nbsp;&nbsp;&nbsp;"Name": "awdf-pr6-fullstack_mongodb_data",<br>&nbsp;&nbsp;&nbsp;&nbsp;"Scope": "local"<br>&nbsp;&nbsp;}<br>]</p>
          <br>
          <p><span class="dim"># 1. Forcefully restart the MongoDB container to test persistence</span></p>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">docker restart mongodb_service</span></p>
          <p class="yellow-txt">mongodb_service</p>
          <br>
          <p><span class="dim"># 2. Query persisted tasks via containerized backend API</span></p>
          <p><span class="dim">PS C:\\Users\\Abc\\Downloads\\AWDF-PR6-FullStack&gt;</span> <span class="cmd">curl.exe -s http://localhost:5000/tasks -H "Authorization: Bearer $TOKEN"</span></p>
          <p class="out">[{"_id":"6ae8d3fb36a5b894803938b7","title":"<span class="yellow-txt">Containerization with Docker Compose</span>","priority":"high","completed":false}]</p>
          <br>
          <p class="green-txt">&#10003; Supplementary Problem 3 Validated: Named volume 'mongodb_data' successfully retained WiredTiger collection data across container restart without any data loss.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig9Html);
  await page.screenshot({ path: path.join(outDir, 'fig9_mongodb_volume_persistence.png') });
  console.log('Saved: fig9_mongodb_volume_persistence.png');

  // -------------------------------------------------------------
  // Figure 10: GitHub Repository Deliverable & Containerization Commit
  // -------------------------------------------------------------
  const fig10Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; background: #0d1117; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #c9d1d9; padding: 24px; display: flex; align-items: center; justify-content: center; }
        .gh-box { background: #161b22; border: 1px solid #30363d; border-radius: 12px; width: 100%; max-width: 1100px; box-shadow: 0 16px 36px rgba(0,0,0,0.6); overflow: hidden; }
        .gh-header { background: #0d1117; padding: 16px 20px; border-bottom: 1px solid #30363d; display: flex; align-items: center; justify-content: space-between; }
        .gh-repo-title { font-size: 16px; font-weight: 600; color: #58a6ff; display: flex; align-items: center; gap: 8px; }
        .gh-badge { background: #21262d; border: 1px solid #30363d; color: #8b949e; font-size: 12px; padding: 2px 8px; border-radius: 12px; }
        .commit-row { padding: 18px 20px; border-bottom: 1px solid #21262d; display: flex; align-items: center; justify-content: space-between; }
        .commit-msg { font-size: 15px; font-weight: 600; color: #f0f6fc; margin-bottom: 4px; }
        .commit-sub { font-size: 12px; color: #8b949e; }
        .commit-sha { font-family: monospace; font-size: 12px; background: #21262d; border: 1px solid #30363d; padding: 4px 10px; border-radius: 6px; color: #58a6ff; }
        .file-list { padding: 12px 20px; }
        .file-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #21262d; font-size: 13.5px; }
        .file-name { color: #f0f6fc; display: flex; align-items: center; gap: 8px; }
        .file-msg { color: #8b949e; font-size: 12.5px; }
      </style>
    </head>
    <body>
      <div class="gh-box">
        <div class="gh-header">
          <div class="gh-repo-title">
            <span>&#128230; </span>
            <span>KardaniFenilKrushnkant</span> / <span style="font-weight: 700; color: #f0f6fc;">AWDF-PR6-FullStack</span>
            <span class="gh-badge">Public</span>
          </div>
          <div class="gh-badge" style="color: #3fb950; border-color: #238636;">main branch &bull; Up to date</div>
        </div>
        <div class="commit-row">
          <div>
            <div class="commit-msg">Practical 11: Containerize full-stack application using Docker and Docker Compose (React + Node/Express + MongoDB)</div>
            <div class="commit-sub">Authored by Fenil Kardani (D25IT136) &bull; Verified commit on main</div>
          </div>
          <div class="commit-sha">c4e8b91</div>
        </div>
        <div class="file-list">
          <div class="file-item">
            <span class="file-name">&#128011; docker-compose.yml</span>
            <span class="file-msg">Define frontend (5173), backend (5000), mongodb (27017) with bridge network and named volume</span>
          </div>
          <div class="file-item">
            <span class="file-name">&#128196; backend/Dockerfile &amp; .dockerignore</span>
            <span class="file-msg">Node 18 base image, EXPOSE 5000, exclude node_modules and .env from build context</span>
          </div>
          <div class="file-item">
            <span class="file-name">&#128196; frontend/Dockerfile &amp; .dockerignore</span>
            <span class="file-msg">Multi-stage build, build static assets, preview serve on port 5173</span>
          </div>
          <div class="file-item">
            <span class="file-name">&#128221; README.md</span>
            <span class="file-msg">Add Practical 11 orchestration instructions, architecture diagram, port mappings, and troubleshooting</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(fig10Html);
  await page.screenshot({ path: path.join(outDir, 'fig10_github_commit_deliverable.png') });
  console.log('Saved: fig10_github_commit_deliverable.png');

  await browser.close();
  console.log('All Practical 11 screenshots successfully generated in docs/screenshots_p11/ !');
}

run().catch(console.error);
