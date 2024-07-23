import { createAxiosClient } from "./createAxiosClient";
import { useAuthStore } from "../stores/auth.store";

const BASE_URL = "http://localhost:8800/api/v1/";
const REFRESH_TOKEN_URL = `${BASE_URL}auth/refreshToken`;

const getCurrentAccessToken = () => {
	// access zustand store outside of React
	return useAuthStore.getState().accessToken;
};

const getCurrentRefreshToken = () => {
	return useAuthStore.getState().refreshToken;
};

const setRefreshedTokens = (tokens: any) => {
	const login = useAuthStore.getState().login;
	login(tokens);
};

const logout = async () => {
	const logout = useAuthStore.getState().logout;
	logout();
};

export const client = createAxiosClient({
	options: {
		baseURL: BASE_URL,
		timeout: 300000,
		headers: {
			"Content-Type": "application/json",
		},
	},
	getCurrentAccessToken,
	getCurrentRefreshToken,
	refreshTokenUrl: REFRESH_TOKEN_URL,
	logout,
	setRefreshedTokens,
});
