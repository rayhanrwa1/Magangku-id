import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
<<<<<<< HEAD
=======


>>>>>>> d923fa6457d065d4b274aaf9846aeec68233d6f7
