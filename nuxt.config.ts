// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
    },
  },
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt"],
  css: [
    "@fontsource-variable/roboto-flex/index.css",
    "@fontsource-variable/montserrat/index.css",
    "@fontsource-variable/fira-code/index.css",
    "notyf/notyf.min.css",
    "~/scss/main.scss",
  ],
  components: {
    dirs: [
      "~/components/base",
      "~/components/layouts/auth",
      "~/components/layouts/minimal",
      "~/components/layouts/landing",
      "~/components/layouts/navbar",
      "~/components/layouts/navsearch",
      "~/components/layouts/shared",
      "~/components/layouts/sidebar",
      "~/components/layouts/sideblock",
    ],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["iconify-icon"].includes(tag),
    },
  },
});

