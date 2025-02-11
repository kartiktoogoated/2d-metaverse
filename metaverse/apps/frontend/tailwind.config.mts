import sharedConfig from "@repo/tailwind-config/tailwindConfig";

const config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx}"
  ],
};

export default config;

