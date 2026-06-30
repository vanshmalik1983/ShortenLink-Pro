# ⚡ ShortLink Pro

A production-quality, full-stack URL shortening platform with real-time analytics, custom aliases, QR codes, password-protected links, and a polished SaaS dashboard — built to demonstrate professional full-stack engineering practices.

![Status](https://img.shields.io/badge/status-production--ready-10B981)
![License](https://img.shields.io/badge/license-MIT-6366F1)

---

## 📖 Overview

ShortLink Pro turns long URLs into short, shareable links and gives you deep insight into who's clicking them. It's built the way a real SaaS product would be: clean architecture, caching, background jobs, security hardening, and a UI that doesn't feel like a tutorial project.

**Live demo:** _(deploy and link here)_

---

## ✨ Features

### Link Management
- Custom aliases & auto-generated short codes
- Password-protected links
- Expiration dates with automatic deactivation
- QR code generation for every link
- Favorites, tags, and bulk actions
- Search, filter, and sort

### Analytics
- Real-time click tracking (total + unique visitors)
- Browser, OS, and device breakdowns
- Click timelines and hourly/daily distribution
- Top referrers and countries
- Per-link and account-wide dashboards

### Authentication & Security
- JWT access + refresh token rotation
- Email verification & password reset flows
- Helmet, rate limiting, Mongo sanitization, CORS
- Bcrypt password hashing

### Infrastructure
- Redis caching for fast redirects and dashboard stats
- BullMQ background workers (QR generation, email, cleanup)
- Dockerized for one-command local or production deployment

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (JavaScript), Vite, React Router, Tailwind CSS, React Hook Form, Recharts, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Cache / Queue** | Redis, BullMQ |
| **Auth** | JWT (access + refresh tokens), Bcrypt |
| **Security** | Helmet, express-rate-limit, express-mongo-sanitize, CORS |
| **Logging** | Winston, Morgan |
| **Email** | Nodemailer |
| **Containerization** | Docker, Docker Compose |

---

## 🏗 Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │ ───▶ │   Express    │ ───▶ │   MongoDB   │
│  (Vite SPA) │      │     API      │      │  (Mongoose) │
└─────────────┘      └──────┬───────┘      └─────────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
            ┌───────────┐        ┌─────────────┐
            │   Redis    │        │   BullMQ    │
            │  (cache)   │        │  (workers)  │
            └───────────┘        └─────────────┘
```

The backend follows a layered architecture: **routes → controllers → services → repositories/models**, with cross-cutting concerns (auth, validation, rate limiting, error handling) isolated in middleware.

---

## 📁 Folder Structure

```
shortlink-pro/
├── backend/
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── routes/         # Route definitions
│       ├── middlewares/    # Auth, validation, rate limiting, error handling
│       ├── models/         # Mongoose schemas
│       ├── services/       # Business logic
│       ├── cache/          # Redis cache layer
│       ├── jobs/           # BullMQ queue + worker
│       ├── config/         # DB, Redis, logger, email config
│       ├── utils/          # Helpers (JWT, URL generation, responses)
│       └── database/       # MongoDB connection
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI, layout, dashboard, analytics, url components
│       ├── pages/          # Route-level pages
│       ├── layouts/        # Marketing & dashboard shells
│       ├── context/        # Auth & UI context providers
│       ├── hooks/          # useUrls, useAnalytics, useDashboard, useDebounce
│       ├── services/       # Axios API clients
│       └── utils/          # Frontend helpers
└── docker-compose.yml
```

---

## 🚀 Installation

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or hosted)
- Docker & Docker Compose (optional, recommended)

### Option 1 — Docker (recommended)

```bash
git clone <repo-url>
cd shortlink-pro
cp backend/.env.example backend/.env   # fill in your values
docker compose up --build
```

The app will be available at `http://localhost` (frontend) and `http://localhost:5000` (API).

### Option 2 — Manual setup

**Backend:**
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev             # starts API on :5000
npm run worker          # in a separate terminal — starts BullMQ workers
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # starts Vite dev server on :5173
```

---

## 🔐 Environment Variables

See `backend/.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing tokens (use long random strings) |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Email provider credentials (e.g. Gmail App Password) |
| `CLIENT_URL` | Frontend URL (used in email links) |
| `BASE_URL` | Public URL used to build short links |

---

## 📡 API Documentation

All endpoints are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <accessToken>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Log in, returns access + refresh tokens |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/refresh` | Exchange refresh token for new access token |
| GET | `/auth/verify-email?token=` | Verify email address |
| POST | `/auth/forgot-password` | Request password reset email |
| POST | `/auth/reset-password` | Reset password with token |
| GET | `/auth/me` | Get current user |

### URLs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/urls` | Create a short URL |
| GET | `/urls` | List URLs (search, filter, sort, paginate) |
| GET | `/urls/:id` | Get a single URL |
| PATCH | `/urls/:id` | Update a URL |
| DELETE | `/urls/:id` | Delete a URL |
| DELETE | `/urls/bulk` | Bulk delete URLs |
| PATCH | `/urls/:id/favorite` | Toggle favorite |
| GET | `/urls/:id/qrcode` | Generate/fetch QR code |
| GET | `/urls/stats/dashboard` | Dashboard stats |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/overview?period=` | Account-wide analytics |
| GET | `/analytics/:urlId?period=` | Per-link analytics |

### Redirect
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:code` | Resolve short code and redirect (handles password/expiry) |

All responses follow the shape:
```json
{ "success": true, "message": "...", "data": { ... } }
```

---

## 🚢 Deployment Guide

1. Provision MongoDB (Atlas) and Redis (Upstash/Redis Cloud) instances.
2. Set production environment variables in `backend/.env`.
3. Build and push Docker images, or deploy via your platform of choice (Render, Railway, Fly.io, AWS ECS).
4. Point your domain's DNS to the frontend service; configure the frontend's nginx proxy (or your reverse proxy) to forward `/api` and short-code paths to the backend.
5. Run the BullMQ worker as a separate long-running process/service.

---

## 🔭 Future Improvements

- Geolocation lookup for click analytics (IP-to-country service)
- Team workspaces and link sharing/collaboration
- Public API with API key authentication
- Custom domains for branded short links
- Webhooks for click events
- Browser extension for quick link creation

---

## 📄 License

MIT
