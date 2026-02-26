import { createRouter } from "@tanstack/react-router";
import { casLoginRoute } from "@/routes/cas/login.tsx";
import { indexRoute } from "./routes";
import { rootRoute } from "./routes/__root";
import { aboutRoute } from "./routes/about";

const routeTree = rootRoute.addChildren([
	indexRoute,
	aboutRoute,
	casLoginRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
