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
COPY package.json turbo.json pnpm-lock.yaml ./

# ✅ Install dependencies in the correct store
RUN pnpm install --frozen-lockfile

# Copy the full project
COPY . .

# Ensure workspaces are recognized
RUN pnpm install

# ✅ Remove mismatched dependencies and prune the store
RUN rm -rf node_modules
RUN pnpm store prune
RUN pnpm install

# ✅ Build only the frontend workspace
RUN pnpm run build --filter=frontend

# ✅ Serve the built frontend using Vite preview
WORKDIR /app/apps/frontend

# Expose the correct port
EXPOSE 3000

# ✅ Start the frontend app on port 3000
CMD ["pnpm", "run", "preview", "--", "--port", "3000", "--host"]
