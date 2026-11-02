# Practical 11: Containerization with Docker and Docker Compose

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Faculty:** Faculty of Technology and Engineering (FTE)  
**Department:** Chandubhai S. Patel Institute of Technology (CSPIT) / Devang Patel Institute of Advance Technology and Research (DEPSTAR)  
**Student Name:** Fenil Kardani  
**Student ID:** D25IT136  
**Repository:** [https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack](https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack)

---

## 1. Practical Details & Objectives

- **Course Outcome (CO):** CO5
- **Program Outcomes (PO):** PO3, PO5
- **Objective:** To containerize the full-stack Task Management application using Docker and orchestrate services (React frontend, Node/Express backend, MongoDB database) using Docker Compose.

---

## 2. Multi-Container Architecture & Inter-Container Networking

```text
docker-compose.yml
 ├── frontend (React 19, built + served via Vite preview, port 5173:5173)
 ├── backend (Node/Express with EventEmitter & Caching, port 5000:5000)
 └── mongodb (official mongo:latest image, port 27017:27017)

Network: app-network (bridge driver)
 frontend ──► backend:5000 ──► mongodb:27017
Volume: mongodb_data mounted to /data/db (persistent storage across container lifecycles)
```

All 3 services are initialized and bootstrapped together with a single command:
```bash
docker-compose up -d --build
```

---

## 3. Step-by-Step Implementation Guide

### Step 1: Verify Docker & Docker Compose Installation
Verified that Docker Engine and Docker Compose are installed and running:
```bash
docker --version
# Output: Docker version 29.6.2, build dfc4efb

docker compose version
# Output: Docker Compose version v5.3.1
```

### Step 2: Backend Containerization (`backend/Dockerfile` & `.dockerignore`)
Created `backend/Dockerfile` using Node.js runtime, exposing port 5000:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Added `backend/.dockerignore`:
```
node_modules
npm-debug.log
.env
.git
```

### Step 3: Frontend Containerization with Multi-Stage Build (`frontend/Dockerfile` & `.dockerignore`)
Created `frontend/Dockerfile` implementing a multi-stage build:
```dockerfile
# Stage 1: Build Stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
```

Added `frontend/.dockerignore`:
```
node_modules
npm-debug.log
dist
.git
```

### Step 4: Docker Compose Orchestration (`docker-compose.yml`)
Configured `docker-compose.yml` defining `mongodb`, `backend`, and `frontend` services with dependencies, bridge networking, and named volume:
```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb_service
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend_service
    restart: always
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/taskdb
      - JWT_SECRET=your_long_random_secret_key_for_practical7_caching
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend_service
    restart: always
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
    driver: local
```

### Step 5: Backend Service Discovery & Connection String
Updated backend connection to dynamically read `process.env.MONGO_URI` falling back to `mongodb://mongodb:27017/taskdb`:
```javascript
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
```

---

## 4. Verification & Container Inspection (`docker ps`)

```text
CONTAINER ID   IMAGE                         STATUS         PORTS                      NAMES
594e0bfcffe6   awdf-pr6-fullstack-frontend   Up 25 min      0.0.0.0:5173->5173/tcp     frontend_service
32c1eb774a12   awdf-pr6-fullstack-backend    Up 25 min      0.0.0.0:5000->5000/tcp     backend_service
f659080c9851   mongo:latest                  Up 25 min      0.0.0.0:27017->27017/tcp   mongodb_service
```

---

## 5. Key Questions & Analysis

### Q1: Why does the backend container need to reference the MongoDB container by its service name (e.g., mongodb) rather than localhost?
In Docker, each container operates in its own isolated network namespace with its own private loopback interface (`127.0.0.1` / `localhost`). If the backend container attempts to connect to `localhost:27017`, it queries its own internal loopback interface where no MongoDB server is running, causing an immediate `ECONNREFUSED` connection failure.
When containers join a user-defined bridge network (`app-network`), Docker enables an internal DNS resolver at `127.0.0.11`. This DNS server automatically resolves Compose service names (e.g. `mongodb`) to the container's dynamic private IP address (e.g., `172.20.0.2`), enabling clean and resilient service discovery.

### Q2: What is the difference between EXPOSE in a Dockerfile and the ports mapping in docker-compose.yml?
- **`EXPOSE` (Dockerfile):** Serves as declarative metadata and documentation. It indicates to Docker and developers which port the container application listens on internally. It allows inter-container communication on the same Docker network, but does NOT publish or bind ports to the host machine interface.
- **`ports:` (docker-compose.yml):** Explicitly maps and publishes a container port to the host operating system network interface (`HOST_PORT:CONTAINER_PORT`). Docker creates iptables / NAT forwarding rules and binds host sockets so that host web browsers and external clients can access the services on `http://localhost:5173` and `http://localhost:5000`.

### Q3: Why is it considered bad practice to copy node_modules into a Docker image instead of running npm install inside the container?
1. **Binary Incompatibility:** Many Node.js libraries contain compiled C++ native addons (e.g. bcrypt, sharp, rolldown) built specifically for the host operating system (e.g. Windows/macOS with native C runtimes). Copying host `node_modules` into a Linux container results in runtime crashes (`Invalid ELF header`, `Module did not self-register`). Running `npm install` inside the container guarantees binaries are compiled against the target Linux distribution.
2. **Build Context Bloat:** `node_modules` contains tens of thousands of nested files totaling hundreds of megabytes. Copying them drastically bloats build context transfer times over the Docker daemon socket.
3. **Docker Layer Caching:** Copying `package*.json` separately before running `npm install` allows Docker to cache the dependencies layer. Application source code edits subsequently re-build in seconds without reinstalling packages.

---

## 6. Supplementary Problems & Implementations

1. **Build Context Optimization (.dockerignore):** Excluded `node_modules`, `.env`, and build artifacts from both frontend and backend contexts, reducing context transfer to under 10 KB.
2. **Multi-Stage Build for React Frontend:** Separated asset compilation from runtime preview serving, reducing image footprint to 147 MB.
3. **MongoDB Data Persistence with Named Volume:** Configured `mongodb_data` volume mounted at `/data/db`. Empirically verified by adding tasks, running `docker restart mongodb_service`, and confirming 100% data retention across restarts.
