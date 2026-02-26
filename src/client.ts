import { treaty } from "@elysiajs/eden";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ApiApp } from "@/api.ts";

const treatyClient = treaty<ApiApp>(location.origin).api;
export const api = treatyClient;

export const accountsDataOptions = queryOptions({
	queryKey: ["accounts"],
	queryFn: () => api.accounts.get().then((res) => res.data!),
});
