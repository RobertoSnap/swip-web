import { SignClient } from "@walletconnect/sign-client/dist/types/client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useWalletConnect } from "../utils/useWalletConnect";
import WalletConnectButton from "../components/WalletConnectButton";
import { SessionTypes } from "@walletconnect/types";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
	const { client, init, session, getAccounts, request } = useWalletConnect();
	// const [currentClient, setCurrentClient] = useState<SignClient>();
	// const [currentSession, setCurrentSession] = useState<SessionTypes.Struct>();

	useEffect(() => {
		if (!client) {
			init({ reConnect: true });
		}
	}, [client, init]);
	// useEffect(() => {
	// 	// Next js fix
	// 	setCurrentClient(client);
	// }, [client]);
	// useEffect(() => {
	// 	// Next js fix
	// 	console.log("Session: ", session);
	// 	setCurrentSession(session);
	// }, [session]);

	const handlePresentEmploymentOffer = async () => {
		// get vc from server
		const getFromWallet = await toast.promise(request<{ result: string }>("present_credential", ["employment_offer"]), {
			error: "Error getting credential to wallet",
			success: "Credential received!",
			pending: "Getting credential from wallet...",
		});
		if (getFromWallet.result) {
			console.log("Got result from wallet");
			const res = await toast.promise(verify(getFromWallet.result), {
				error: "Error verifying credential",
				success: "Credential verified!",
				pending: "Verifying credential...",
			});
			console.log("Got result from server");
			console.log(res);
		}
		// const jwt = await fetchVC();
		// send vc to wallet
	};

	const verify = async (jwt: string) => {
		const accounts = getAccounts();
		if (!getAccounts) {
			throw new Error("No accounts found");
		}
		const res = await fetch("/api/verify-udi", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ jwt: jwt }),
		});

		// Check if the POST was successful
		if (res.ok) {
			return await res.json();
		} else {
			throw new Error(`Request failed with status ${res.status}`);
		}
	};
	return (
		<>
			<Head>
				<title>Swip</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
					<p>UDI</p>
					<p>Connection: {client ? "Yes" : "No"} </p>
					<p>Session: {client ? "Yes" : "No"} </p>
					{client && <WalletConnectButton></WalletConnectButton>}
					<button
						type="button"
						className="bg-sky-500 px-10 py-5 rouded text-l"
						title="Get VC"
						onClick={() => handlePresentEmploymentOffer()}
					>
						Present employment offer
					</button>
				</div>
				<ToastContainer position="bottom-right"></ToastContainer>
			</main>
		</>
	);
}
