# Production Deployment Guide: CodifyPro by Aimtech Solutions

This project is built on **Next.js 14 App Router** with full-stack capabilities (React frontend + server-side Node.js API routes, JWT authentication, Mongoose MongoDB, Upstash Redis, and Groq AI).

You can deploy it in three ways depending on your preferred infrastructure:
1. **Option 1 (Fastest & Recommended)**: Full-Stack on **Vercel**
2. **Option 2**: Full-Stack on **Render** (as a Web Service or Docker container)
3. **Option 3**: **Hybrid** (Frontend on Vercel + Backend on Render)

---

## Required Environment Variables Checklist

Before deploying, ensure you have the following environment variables configured on your deployment platform:

| Variable Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/codifypro?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | 32+ character secret for session tokens | `generate a secure random 32+ char string` |
| `NEXTAUTH_SECRET` | **Yes** | 32+ character secret | `generate a secure random 32+ char string` |
| `NEXT_PUBLIC_APP_URL`| **Yes** | Your deployed production domain | `https://your-app.vercel.app` or `https://your-app.onrender.com` |
| `GROQ_API_KEY` | Optional | For AI resume extraction and job parsing | `gsk_...` |
| `UPSTASH_REDIS_REST_URL` | Optional | For serverless rate limiting & caching | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`| Optional | Upstash Redis token | `...` |
| `CLOUDINARY_CLOUD_NAME` | Optional | For candidate resume and image storage | `...` |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API Key | `...` |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API Secret | `...` |

> [!IMPORTANT]
> **MongoDB Atlas Network Access**: In your MongoDB Atlas dashboard, ensure **Network Access** has IP `0.0.0.0/0` (Allow access from anywhere) enabled so Vercel serverless functions and Render web servers can reach your database.

---

## Option 1: Deploy on Vercel (Recommended for Next.js)

Vercel provides native edge hosting for Next.js 14 frontend pages and serverless API endpoints under one unified domain with zero CORS setup.

### Steps:
1. Push your repository to **GitHub**.
2. Go to [vercel.com/new](https://vercel.com/new) and log in.
3. Import your GitHub repository (`Jdai` / `codifypro`).
4. Framework Preset will automatically detect **Next.js**.
5. Expand **Environment Variables** and paste your production values:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL once generated)
   - `GROQ_API_KEY` (if using AI features)
6. Click **Deploy**.
7. Your application will be live at `https://your-project.vercel.app`.

---

## Option 2: Deploy on Render

Render can run the application as a persistent Node.js web service or Docker container using the included [`render.yaml`](./render.yaml).

### Method A: Blueprint (1-Click via `render.yaml`)
1. Push your code to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** $\rightarrow$ **Blueprint**.
3. Connect your repository. Render will automatically detect [`render.yaml`](./render.yaml).
4. Fill in `MONGODB_URI` and any missing API keys when prompted.
5. Click **Apply**.

### Method B: Manual Web Service Setup
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `codifypro-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to your database (e.g., Oregon or Frankfurt)
   - **Branch**: `version1` (or `main`)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/auth/me`
4. Under **Environment Variables**, add the keys from the checklist above.
5. Click **Create Web Service**.

---

## Option 3: Hybrid Deployment (Frontend on Vercel + Backend on Render)

If you prefer hosting the backend persistent service on Render and the frontend CDN on Vercel:

1. **Deploy Backend on Render**:
   - Follow Option 2 above to deploy the service on Render.
   - Note your Render URL (e.g., `https://codifypro-backend.onrender.com`).

2. **Deploy Frontend on Vercel**:
   - In your Vercel Project Dashboard $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
   - Add:
     ```env
     RENDER_BACKEND_URL=https://codifypro-backend.onrender.com
     ```
   - Because [`next.config.mjs`](./next.config.mjs) is pre-configured with dynamic rewrites, Vercel will automatically proxy all incoming `/api/:path*` requests directly to your Render backend:
     ```javascript
     async rewrites() {
       if (process.env.RENDER_BACKEND_URL) {
         return [
           {
             source: '/api/:path*',
             destination: `${process.env.RENDER_BACKEND_URL}/api/:path*`,
           },
         ];
       }
       return [];
     }
     ```
   - **Benefit**: Browser cookies (`codifypro_token`) and requests remain on the same origin (no third-party cookie blocking, no CORS configuration issues).

---

## Docker Deployment (Optional)

A multi-stage production [`Dockerfile`](./Dockerfile) and [`.dockerignore`](./.dockerignore) are included in the root directory. To run with Docker:

```bash
# Build the Docker image
docker build -t codifypro:latest .

# Run the container locally
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  codifypro:latest
```

