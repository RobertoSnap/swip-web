import type { NextApiRequest, NextApiResponse } from "next";
import * as didJWT from "did-jwt";

interface Data {
	jwt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === "POST") {
		// Extract your data from the request body
		const { title, content, address } = req.body;
		const issuer = `did:ethr:${"0xdddD62cA4f31F34d9beE49B07717a920DCCEa949"}`;
		const signer = didJWT.ES256KSigner(
			didJWT.hexToBytes("c3c2ccfc2adec51ca4a441714f01db02095c0ea7450664cd00d3787a0d4e1839"),
		); // 0xdddD62cA4f31F34d9beE49B07717a920DCCEa949
		const payload = {
			employmentoffer: {
				hiringorganization: {
					"@type": "organization",
					name: "university of oslo",
					sameas: "https: //www. Universitetetioslo. No",
				},
				basesalary: { "@type": "monetaryamount", value: 100000, currency: "nok" },
				jobstartdate: "2023-06-01",
				jobenddate: "2025-01-01",
				fte: 1,
				candidate: {
					"@type": "person",
					givenname: "john",
					familyname: "doe",
					email: "john@doe. Com",
					nationality: { "@type": "country", name: "usa" },
					identifier: { "@type": "propertyvalue", propertyid: "passportnumber", value: "123456789" },
					gender: "male",
					birthdate: "1990-01-01",
				},
				countryofresidence: { "@type": "country", name: "usa" },
				passport: { dateofissue: new Date().toISOString().slice(0, 10), dateofexpiry: "2025-01-01", issuer: "usa" },
				candidatehasrequiredqualifications: true,
				infocheckedandcorrect: true,
			},
		};
		const SOME_RECEIVER = "0xf3beac30c498d9e26865f34fcaa57dbb935b0d74";
		const audience = `did:ethr:${SOME_RECEIVER}}`; // TODO
		const jwt = await didJWT.createJWT(
			{ aud: audience, iat: undefined, sub: address, ...payload },
			{ issuer: issuer, signer },
			{ alg: "ES256K" },
		);

		console.log(jwt);
		// Once the post is added, respond with a success message.
		res.status(200).json({ jwt });
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
