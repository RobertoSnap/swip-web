import type { NextApiRequest, NextApiResponse } from "next";
import * as didJWT from "did-jwt";

import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";

const resolver = new Resolver({ ...getResolver({ infuraProjectId: "217473ce815c4fb1821b52667fbfbcca" }) });

interface Data {
	verfied: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === "POST") {
		// Extract your data from the request body
		const { title, content, jwt } = req.body;
		const SOME_RECEIVER = "0xf3beac30c498d9e26865f34fcaa57dbb935b0d74";
		const audience = `did:ethr:${SOME_RECEIVER}}`; // TODO
		if (!jwt) {
			return res.status(400).end("No jwt provided");
		}
		const issuer = `did:ethr:${"0xdddD62cA4f31F34d9beE49B07717a920DCCEa949"}`;
		try {
			const verfied = await didJWT.verifyJWT(jwt, {
				resolver,
				audience,
			});
			console.log(verfied);
			// Once the post is added, respond with a success message.
			return res.status(200).json({ verfied: verfied.verified });
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				res.status(400).end(error.message);
			}
			return res.status(400).end("Internal error message");
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
