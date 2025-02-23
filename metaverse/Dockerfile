# Use Node.js 18 (ARM64 support for Mac M1/M2)
FROM node:18-bullseye AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# ✅ Set pnpm store location inside the container (avoids conflicts with macOS)
RUN pnpm config set store-dir /app/.pnpm-store

# ✅ Clean up any previous installations (prevents store mismatch)
RUN rm -rf node_modules /app/.pnpm-store /root/.pnpm-store

# Copy package manager files
COPY package.json turbo.json pnpm-lock.yaml pnpm-workspace.yaml ./

# ✅ Install dependencies in the correct store
RUN pnpm install --frozen-lockfile

# Copy the full project
COPY . .

# ✅ Ensure workspace dependencies are installed properly
RUN rm -rf node_modules apps/frontend/node_modules packages/ui/node_modules
RUN pnpm install --frozen-lockfile

# ✅ Build only the UI package before frontend (Fixes missing dependencies)
RUN pnpm turbo run build --filter=@repo/ui

# ✅ Build only the frontend workspace
RUN pnpm turbo run build --filter=frontend

# ✅ Serve the built frontend using Vite preview
WORKDIR /app/apps/frontend

# Expose the correct port
EXPOSE 3000

# ✅ Start the frontend app on port 3000
CMD ["pnpm", "run", "preview", "--", "--port", "3000", "--host"]
