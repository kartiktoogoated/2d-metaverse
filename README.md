🧠 2D Metaverse - Real-Time 2D World Built with Turborepo
=========================================================

A modular, real-time virtual world where users can move as avatars, chat with others in real time, and experience spatial interactions --- all rendered in a browser using a scalable monorepo architecture.

* * * * *

📌 Key Highlights
-----------------

-   🧍 Multiplayer avatar movement and real-time sync

-   💬 Spatial talk with peer-to-peer and server-based voice/video

-   ⚙️ Modular monorepo setup using **Turborepo** and **PNPM Workspaces**

-   🧩 Highly reusable component system powered by **@repo/ui**

-   🌐 Scalable backend structure (`http`, `ws`) with LiveKit, Prisma

-   ☁️ Hosting-ready for **AWS S3** (frontend) & **EC2** (backend)

* * * * *

🧱 Monorepo Structure
---------------------

![Screenshot 2025-04-03 at 9 15 55 PM](https://github.com/user-attachments/assets/059ee37b-a562-4204-9597-8a778a48b7cc)



🚀 Tech Stack
-------------

### Frontend

-   React 19 + Vite 6

-   Tailwind CSS, Framer Motion

-   React Router v7

-   PeerJS

-   Reusable UI via `@repo/ui`

-   Hosted on AWS S3

### Backend (HTTP)

-   Node.js + Express

-   REST APIs (Auth, Rooms, Users)

-   Prisma ORM + PostgreSQL

-   JWT Auth, Zod Validation

-   LiveKit Server SDK

### Backend (WS)

-   WebSocket server (`ws`)

-   UUID for user IDs

-   LiveKit Client SDK

### Tooling

-   TypeScript across all packages

-   Turborepo + PNPM Workspaces

-   Esbuild for backend bundling

-   Prettier & ESLint

-   Vite Plugin Compression

* * * * *


🌍 Environment Variables
------------------------

Create a `.env` file in each app (`apps/frontend`, `apps/http`, `apps/ws`):

### apps/http/.env


`PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/metaverse
JWT_SECRET=your-secret-key
LIVEKIT_API_KEY=your-api-key
LIVEKIT_SECRET=your-secret`

### apps/ws/.env


`PORT=4000
LIVEKIT_API_KEY=your-api-key
LIVEKIT_SECRET=your-secret`

### apps/frontend/.env


`VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:4000`

* * * * *

📦 Common Commands
------------------

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in development |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint the entire repo |
| `pnpm format` | Format with Prettier |
| `pnpm start` | Start frontend preview (filtered) |
| `pnpm aws` | Build and deploy frontend to AWS S3 |

* * * * *

🧪 Deployment
-------------

-   **Frontend**: Built with Vite and deployable via `aws s3 sync` to S3.

-   **Backend**: Deploy HTTP and WS servers to AWS EC2 or Vercel Functions.

-   **LiveKit**: Requires self-hosted or cloud LiveKit server.

* * * * *

🧩 Future Enhancements
----------------------

-   In-world object interaction

-   Avatar customization

-   Room creation and admin controls

-   Spatial voice + world state persistence

-   In-game currency / NFTs (Web3 mode)

* * * * *

📝 License
----------

MIT License © 2025 Kartik
