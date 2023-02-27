import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const authOptions: AuthOptions = {
        providers: [
            {
                id: "backend",
                name: "Backend",
                type: "oauth",
                authorization: "http://172.18.100.129:8000/o/authorize",
                token: "http://172.18.100.129:8000/o/token",
                userinfo: "http://172.18.100.129:8000/o/userinfo",
                // accessTokenUrl: "http://172.18.100.129:8000/o/token",
                clientId: "Ni2SKOdWMLoL3rYDbqlUW3rphQsstZxD06nbzxdd",
                clientSecret: "UDH4eZOpikLYflzAxrZAY0xDetiyPTyVQWGIeDeNrq7m0VJwC2C5QiT642D0aTN1sB2HbPJREfkWjLsArJC0WKbgb0kgPeC6OfzHSUy9oGc6yVNAjHyqI5OOijhNbvbP",
                jwks_endpoint: 'http://172.18.100.129:8000/o/.well-known/jwks.json',
                profile(profile) {
                    console.table(profile);
                    return {
                        id: profile.id,
                    }
                },
            }
        ],
        callbacks: {
            async redirect({ url, baseUrl }) {
              // Allows relative callback URLs
              console.log("redirect", url, baseUrl);
              return baseUrl
            }
          },
        theme: {
            colorScheme: "dark",
        },
    };
    return await NextAuth(req, res, authOptions)
}