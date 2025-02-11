import type { Config } from "tailwindcss";

const tailwindConfig: Config = {
  content: [
    "../../apps/**/src/**/*.{ts,tsx,js,jsx}",  // Ensure all apps use Tailwind
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx}", // UI components using Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default tailwindConfig;
