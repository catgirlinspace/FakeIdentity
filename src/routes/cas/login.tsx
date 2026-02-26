import { useSuspenseQuery } from "@tanstack/react-query"
import { createRoute } from "@tanstack/react-router"
import { type } from "arktype"
import { useState } from "react"
import { accountsDataOptions, api } from "@/client.ts"
import AccountChooser from "@/components/AccountChooser.tsx"
import type { Account } from "@/db/schema.ts"
import { queryClient } from "@/queryClient.tsx"
import { rootRoute } from "@/routes/__root.tsx"

const casLoginSearchSchema = type({
	service: "string",
})

export const casLoginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/cas/login",
	component: CasLogin,
	validateSearch: casLoginSearchSchema,
	loader: () => queryClient.ensureQueryData(accountsDataOptions),
})

function CasLogin() {
	const { service } = casLoginRoute.useSearch()
	const { data: accounts } = useSuspenseQuery(accountsDataOptions)
	const [err, setErr] = useState<string | null>(null)

	const onSelectedAccount = (account: Account) => {
		console.log("Selected account:", account)
		api.cas.authenticate
			.post({
				service,
				userId: account.id!,
			})
			.then(({ error, data: ticket }) => {
				if (error) {
					setErr(error.value.message!)
					return
				}
				window.location.href = `${service}?ticket=${ticket.ticket}`
			})
	}

	return (
		<div className="container mx-auto p-8">
			{err ? <p className="text-red-500 text-center">{err}</p> : null}

			<h1 className="text-2xl font-bold text-center">CAS Authentication</h1>
			<p className="text-lg text-center">
				Authenticating to CAS service{" "}
				<a
					href={service}
					className="underline text-blue-500"
					target="_blank"
					rel="noopener noreferrer"
				>
					{service}
				</a>
			</p>

			<p className="text-gray-500 text-center">
				Select a user to authenticate as...
			</p>

			<AccountChooser accounts={accounts} onSelectAccount={onSelectedAccount} />
		</div>
	)
}
