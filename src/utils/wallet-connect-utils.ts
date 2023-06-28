import { SignClient } from "@walletconnect/sign-client";
import { env } from "../env.mjs";

export async function createWalletConnectClient() {
	try {
		const client = await SignClient.init({
			projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
			// optional parameters
			// relayUrl: env.NEXT_PUBLIC_WALLET_CONNECT_RELAY_URL,
			metadata: {
				name: "SWIP web",
				description: "SWIP web desc",
				url: "https://swip.dev",
				icons: ["https://walletconnect.com/walletconnect-logo.png"],
			},
		});
		return client;
	} catch (e) {
		console.log(e);
		throw e;
	}
}
