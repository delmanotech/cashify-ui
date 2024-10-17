interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export async function useApi<T>(
  url: string,
  options = {}
): Promise<ApiResponse<T>> {
  const { $api } = useNuxtApp();

  try {
    const data: T = await $api<T>(url, options);
    return { data, error: null };
  } catch (error: any) {
    let errorMessage = "Unknown error occurred";

    if (error.response) {
      errorMessage =
        error.response._data?.message ||
        error.response.statusText ||
        errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { data: null, error: errorMessage };
  }
}
