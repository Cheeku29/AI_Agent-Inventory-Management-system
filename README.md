# DarkStore.AI — AI Inventory Decision Engine

An industry-level AI Inventory Intelligence and Decision Engine for quick-commerce dark stores and warehouses.
Built with Next.js, FastAPI, DuckDB, LightGBM, Supabase, and Google Gemini.

---

## Key Highlights

- **Universal Data Ingestion**: Dataset-agnostic parser supporting arbitrary CSV, XLSX, and Parquet column schemas.
- **Canonical Schema Mapping**: Automated column understanding with interactive confidence-ranked confirmation.
- **Data Quality & Capability Engine**: Dynamically detects available modules based on mapped fields (Demand Forecasting, Expiry Risk, Phantom Inventory, etc.).
- **High-Performance In-Process Analytics**: Out-of-core aggregations and transformations powered by DuckDB & PyArrow.
- **Predictive ML Models**: 24h, 48h, and 7-day LightGBM demand forecasting + Isolation Forest anomaly detection.
- **Deterministic Replenishment Engine**: Mathematical LTD + Safety Stock buffer calculation with supplier MOQ and pack size constraints.
- **Action Priority Queue**: Urgency-ranked action list (Critical, High, Medium, Low).
- **AI Inventory Copilot**: Natural-language interface powered by Google Gemini reasoning strictly over validated analytical tool outputs without hallucinating numbers.
- **Human-in-the-Loop Audit History**: Operator approvals, rejections, and quantity overrides recorded in persistent audit logs.

---

## Project Overview & Core Workflow

This project is an **AI Inventory Intelligence & Decision Engine** built for quick-commerce dark stores, warehouses, and retail managers.

- **Data Ingestion & Analysis**: The system ingests CSV files (and other tabular data formats), automatically profiles columns, maps fields to canonical schemas, and runs fast analytics to determine exact stockout risks, safety buffers, and **what items need to be stocked up / replenished**.
- **AI Inventory Copilot**: We have implemented an intelligent AI Copilot powered by Google Gemini and live store tools. You can ask anything in natural language regarding:
  - Product stock levels (e.g., *"Is Pepsi in stock or not?"*, *"Is Coke available?"*)
  - Inventory status & counts (e.g., *"How many items are out of stock?"*)
  - Supply, lead times, and replenishment orders (e.g., *"What products should I order today?"*)
  - Stockout risks, hourly depletion estimates, and phantom inventory anomalies.

---

## ⚠️ Development Status & Known Notes

> [!IMPORTANT]
> **Active Development Status**: This project is currently in active development. Several modules and enhancements are underway:
> 
> 1. **Authentication in Progress**: The authentication module (Supabase Auth / Google Login) is currently being worked on and needs further fixing/stabilization. A local demo authentication bypass is enabled for seamless development and testing.
> 2. **UI Enhancements Needed**: The frontend UI is undergoing active redesign to provide a more refined, premium dark-store operational dashboard.
> 3. **Upcoming Features to Add**:
>    - Direct Purchase Order (PO) PDF/Excel export and automated supplier emailing
>    - Multi-warehouse / multi-store comparative analytics
>    - Real-time ERP/WMS webhooks and live inventory sync
>    - Advanced expiry-date risk tracking and markdown optimization
>    - Enhanced automated model retraining pipelines

---

## Quick Start

### 1. Backend
```bash
conda activate inventory-ai
cd backend
uvicorn app.main:app --reload --port 8000
```
- Health Check: `http://localhost:8000/health`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend
```bash
cd frontend
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## Security & Architecture Checklist
- [x] No credentials or secrets hardcoded in source code.
- [x] `.env` files ignored by Git.
- [x] Supabase Secret Key and Gemini API Key are strictly server-side.
- [x] Row Level Security (RLS) policies configured in Supabase migrations.
- [x] End-to-end dataset isolation and server-side authorization enforcement.
- [x] Tested production build with 100% type validation.
