import { create } from "zustand";
import SignClient from "@walletconnect/sign-client";

import { SessionTypes } from "@walletconnect/types";
import { WalletConnectModal } from "@walletconnect/modal";
import { env } from "../env.mjs";
import { createWalletConnectClient } from "./wallet-connect-utils";

export type InitArgs = {
	reConnect?: boolean;
};

export interface WalletConnectState {
	initialized: boolean;
	client: SignClient | undefined;
	session: SessionTypes.Struct | undefined;
	init: (initArgs?: InitArgs) => void;
	connect: () => void;
	disconnect: () => void;
	request: <T>(method: string, params: any[]) => Promise<T>;
}
export const useWalletConnect = create<WalletConnectState>()((set, get) => ({
	initialized: false,
	client: undefined,
	session: undefined,
	init: async (_initArgs) => {
		const initArgs = { reConnect: false, ..._initArgs };
		if (get().initialized) {
			return;
		}
		const client = await createWalletConnectClient();
		if (initArgs.reConnect && client.session.length) {
			const lastKeyIndex = client.session.getAll().length - 1;
			const _session = client.session.getAll()[lastKeyIndex];

			console.log("RESTORED SESSION:", _session);
			return set(() => {
				return { client: client, initialized: true, session: _session };
			});
		}
		return set(() => {
			return { client: client, initialized: true };
		});
	},
	disconnect: async () => {
		const client = get().client;
		if (!client) {
			throw new Error("Client not initialized");
		}
		const session = get().session;
		if (!session) {
			throw new Error("Session not initialized");
		}
		await client.disconnect({
			reason: {
				code: 0,
				message: "Disconnected from client",
			},
			topic: session.topic,
		});
		return set(() => ({ session: undefined }));
	},
	connect: async () => {
		const walletConnectModal = new WalletConnectModal({
			projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
			// `standaloneChains` can also be specified when calling `walletConnectModal.openModal(...)` later on.
			chains: ["eip155:5"],
		});
		let session: SessionTypes.Struct | undefined = undefined;
		try {
			const client = get().client;
			if (!client) {
				throw new Error("Client not initialized");
			}

			const { uri, approval } = await client.connect({
				// Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
				requiredNamespaces: {
					eip155: {
						methods: ["request_credential"],
						chains: ["eip155:5"],
						events: [],
					},
				},
			});

			if (uri) {
				walletConnectModal.openModal({ uri });

				const session = await approval();

				walletConnectModal.closeModal();

				// QRCodeModal.open(uri, () => {
				// 	console.log("EVENT", "QR Code Modal closed");
				// });
			}
			session = await approval();
		} catch (error) {
			console.error(error);
		} finally {
			walletConnectModal.closeModal();
		}
		return set({ session });
	},
	request: async <T>(method: string, params: any[]) => {
		const client = get().client;
		if (!client) {
			throw new Error("Client not initialized");
		}
		const session = get().session;
		if (!session) {
			throw new Error("Session not initialized");
		}
		let result: T | undefined = undefined;
		let valid = false;
		try {
			result = await client.request<T>({
				topic: session!.topic,
				chainId: "eip155:5",
				request: {
					method,
					params,
				},
			});
			valid = true;
		} catch (e) {
			valid = false;
		}
		if (!result) {
			throw Error("No vp returned");
		}
		return result;
	},
}));
