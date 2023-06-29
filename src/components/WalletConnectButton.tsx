import { SignClient } from "@walletconnect/sign-client/dist/types/client";
import { useEffect, useState } from "react";
import { env } from "../env.mjs";
import { useWalletConnect } from "../utils/useWalletConnect";
import { SessionTypes } from "@walletconnect/types";

export default function WalletConnectButton() {
	const { connect, session, disconnect, client } = useWalletConnect();
	const [currentSession, setCurrentSession] = useState<SessionTypes.Struct>();

	useEffect(() => {
		// Next js fix
		setCurrentSession(session);
	}, [session]);

	useEffect(() => {
		if (!client) return;
		client.on("session_proposal", (event) => {
			console.log("TEST_EVENT received!", event);
			// approveSession(event);
		});

		return () => {
			client.removeAllListeners("session_proposal");
		};
	}, [client]);

	return (
		<>
			{!currentSession && (
				<button className="bg-sky-500 px-10 py-5 rouded text-l" type="button" onClick={() => connect()}>
					Connect
				</button>
			)}
			{currentSession && (
				<button className="bg-sky-200 px-10 py-5 rouded text-l" type="button" onClick={() => disconnect()}>
					Disconnect
				</button>
			)}
		</>
	);
}
