# GameOps AI — Data Pipelines Platform

> **Turn game telemetry into reliable data.**  
> Build, operate, orchestrate, profile, and monitor game studio data pipelines locally with zero external credentials.

---

## 🎮 Overview

**GameOps AI Data Pipelines** is an enterprise-grade data engineering, pipeline orchestration, game telemetry processing, and analytics platform designed for game studios.

The platform provides an interconnected local-first environment to ingest, clean, transform, validate, enrich, analyze, schedule, monitor, and query game data from 16+ game telemetry event sources (player movement, combat deaths, microtransactions, match stats, server performance, AI NPC interactions, quest activities, and experiment data).

---

## 🚀 Key Features & Modules

1. **Dashboard & Analytics**:
   - Real-time pipeline health indicators, success rates, throughput latency, data quality scores, freshness scores, and dark-first SVG activity sparklines.
2. **Interactive Visual DAG Pipeline Builder**:
   - Canvas-based drag-and-drop DAG builder supporting 17 node types:
     - `Source`, `Ingest`, `Parse`, `Filter`, `Validate`, `Transform`, `Join`, `Aggregate`, `Deduplicate`, `Sort`, `Window`, `Enrich`, `Sample`, `Split`, `Feature Engineer`, `Quality Check`, `Output`.
3. **Local Pipeline Orchestration Engine**:
   - Topological sorting planner, cycle detection, node step hashing & caching (Cache Hit/Miss), and real data batch record transformation runner.
4. **Synthetic Game Telemetry Generator**:
   - Deterministic event generation for 16 game event payloads (`session_started`, `player_death`, `purchase`, `match_completed`, `quest_completed`, `server_metrics`, etc.) with customizable population size and error injection.
5. **Data Quality, Schemas & Contracts**:
   - Dataset profiling (null %, duplicate %, range limits), Data Quality Scorecard, Dead Letter Store for rejected records, Schema Evolution Diffs (Compatible/Warning/Breaking), and Data Contracts SLA monitoring.
6. **Data Lineage & Column Lineage**:
   - Visual dataset-level lineage graph and column-level field transformation tracer (`session.duration -> session_duration_minutes -> engagement_score`).
7. **Safe Local SQL Workspace & Visual Query Builder**:
   - In-memory SQL engine supporting `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `ORDER BY`, `LIMIT`, aggregate functions, and visual query generator.
8. **ML Feature Store & Feature Engineering**:
   - Feature engineering engine calculating rolling session counts (`player_sessions_7d`), match activity (`matches_30d`), churn risk labels, encodings, and train/val/test splitters.
9. **Observability, Governance & Command Palette**:
   - Real-time stream simulator, log explorer with severity filtering, alert rule manager, synthetic cloud cost estimator, team role access, Kanban task board, audit logs, backup/restore, 20+ guide articles, and `Cmd+K` global search palette.

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 recommended)
- **npm**: v9.0.0 or higher

### 1. Installation
Clone or unpack the repository and install npm dependencies:

```bash
npm install
```

### 2. Running Development Server
Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build & Verification
Validate TypeScript types and build optimized production bundle:

```bash
npm run build
npm start
```

### 4. Automated Tests
Run unit tests for pipeline engine, DAG planner, quality profiling, and SQL parser:

```bash
npm test
```

---

## 🔒 Security & Ownership

- **Zero `.env` Files**: Built without environment variable dependencies.
- **Zero API Keys**: Operates locally without requiring OpenAI, AWS, Snowflake, Databricks, or cloud database secrets.
- **Local Storage Architecture**: All dataset states, schemas, and execution runs persist locally in browser IndexedDB.
- **Proprietary & Internal**: Confidential enterprise software built for game studio telemetry operations.
