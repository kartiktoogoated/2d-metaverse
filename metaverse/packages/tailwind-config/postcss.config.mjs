import tailwindcss from "tailwindcss"; // ✅ Correct Import
import autoprefixer from "autoprefixer"; // ✅ Ensure autoprefixer is installed

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};
