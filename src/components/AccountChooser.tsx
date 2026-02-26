import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import type { Account } from "@/db/schema.ts";

type AccountChooserProps = {
	accounts: Account[];
	onSelectAccount: (account: Account) => void;
};

export default function AccountChooser({
	accounts,
	onSelectAccount,
}: AccountChooserProps) {
	const [canSelect, setCanSelect] = useState(true);

	const handleSelectAccount = (account: Account) => {
		setCanSelect(false);
		onSelectAccount(account);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center">
			{accounts.map((account) => (
				<AccountCard
					account={account}
					key={account.id}
					canSelect={canSelect}
					onSelectAccount={() => handleSelectAccount(account)}
				/>
			))}
		</div>
	);
}

type AccountCardProps = {
	account: Account;
	onSelectAccount: () => void;
	canSelect?: boolean;
};

function AccountCard({
	account,
	onSelectAccount,
	canSelect = true,
}: AccountCardProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSelectAccount = () => {
		setIsLoading(true);
		onSelectAccount();
	};

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-lg">{account.name}</CardTitle>
				<CardDescription className="text-base">
					@{account.username}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					className="w-full text-sm font-semibold"
					onClick={() => handleSelectAccount()}
					disabled={!canSelect}
				>
					{isLoading ? <Spinner /> : "Select"}
				</Button>
			</CardContent>
		</Card>
	);
}
