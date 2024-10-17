import { defineStore } from "pinia";
import type { User, UserStoreState } from "~/models/user";

export const useUserStore = defineStore("user", {
  state: () =>
    <UserStoreState>{
      user: null,
      token: useCookie("cashify-token").value,
    },
  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    setToken(token: string) {
      this.token = token;
      useCookie("cashify-token").value = token;
    },
    logout() {
      this.user = null;
      this.token = null;
      useCookie("cashify-token").value = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
});
