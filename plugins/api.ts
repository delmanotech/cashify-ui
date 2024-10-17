export default defineNuxtPlugin((nuxtApp) => {
  const token = useUserToken();

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : "",
    },
    onRequest({ options }) {
      if (token.value) {
        options.headers = options.headers || {};
        (<Headers & { Authorization: string }>options.headers)[
          "Authorization"
        ] = `Bearer ${token.value}`;
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/auth"));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
