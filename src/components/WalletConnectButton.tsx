import { SignClient } from "@walletconnect/sign-client/dist/types/client";
import { useEffect, useState } from "react";
import { env } from "../env.mjs";
import { useWalletConnect } from "../utils/useWalletConnect";
import { SessionTypes } from "@walletconnect/types";

interface Props {
	signClient: SignClient;
}

export default function WalletConnectButton({ signClient }: Props) {
	const { connect, session, disconnect } = useWalletConnect();
	const [currentSession, setCurrentSession] = useState<SessionTypes.Struct>();

	useEffect(() => {
		// Next js fix
		setCurrentSession(session);
	}, [session]);

	useEffect(() => {
		signClient.on("session_proposal", (event) => {
			console.log("TEST_EVENT received!", event);
			// approveSession(event);
		});

		return () => {
			signClient.removeAllListeners("session_proposal");
		};
	}, [signClient]);

	return (
		<>
			{!currentSession && (
				<button className="bg-sky-500 px-10 py-5 rouded text-l" type="button" onClick={() => connect()}>
					Connect
				</button>
			)}
			{currentSession && (
				<button className="bg-red px-10 py-5 rouded text-l" type="button" onClick={() => disconnect()}>
					Disconnect
				</button>
			)}
		</>
	);
}
