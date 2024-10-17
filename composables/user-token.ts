const tokenKey = "cashify-token";

export function useUserToken() {
  return useCookie(tokenKey);
}

