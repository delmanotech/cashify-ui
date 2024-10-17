export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createNotyf());
});

