import { defineConfig } from "@lovable.dev/vite-tanstack-config";


export default defineConfig({
  vite: {
    server: {
      host: true,
      allowedHosts: true,
    },


    ssr: {
      noExternal: [
        "@tanstack/start",
        "@tanstack/start-server-core",
        "@tanstack/start-client-core",
      ],
    },
  },


  tanstackStart: {
    server: {
      entry: "server",
    },
  },


  nitro: true,
});