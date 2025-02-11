import tailwindConfig from "../../packages/tailwind-config/tailwind.config.mts";

const config = {
  ...tailwindConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;