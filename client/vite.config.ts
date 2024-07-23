import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		define: {
			"process.env": env,
		},

		plugins: [
			react(),
			sentryVitePlugin({
				org: "gnimoc-noos",
				project: "deer",
			}),
		],

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},

		build: {
			sourcemap: true,
		},
	};
});
