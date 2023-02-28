import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const authOptions: AuthOptions = {
        providers: [
            {
                id: "backend",
                name: "Backend",
                type: "oauth",
                // authorization: "http://172.18.100.129:8000/o/authorize",
                // token: "http://172.18.100.129:8000/o/token/",
                // userinfo: "http://172.18.100.129:8000/o/userinfo/",
                // accessTokenUrl: "http://172.18.100.129:8000/o/token/",
                clientId: "Ni2SKOdWMLoL3rYDbqlUW3rphQsstZxD06nbzxdd",
                clientSecret: "UDH4eZOpikLYflzAxrZAY0xDetiyPTyVQWGIeDeNrq7m0VJwC2C5QiT642D0aTN1sB2HbPJREfkWjLsArJC0WKbgb0kgPeC6OfzHSUy9oGc6yVNAjHyqI5OOijhNbvbP",
                jwks_endpoint: 'http://172.18.100.129:8000/o/.well-known/jwks.json',
                token: {
                    url: "http://172.18.100.129:8000/o/token/",
                    params: {
                        code_verifier: process.env.CODE_VERIFIER,
                    },
                    // request: async (context) => {
                        
                    //     return {tokens: {
                    //         access_token: 'mocked',
                    //         id_token: 'mocked',
                    //         refresh_token: 'mocked',
                    //         token_type: 'mocked',
                    //         expires_in: '3600',
                    //         expires_at: 3600,
                    //         scope: 'openid read write groups',
                    //         session_state: 'mocked',
                    //     }};
                    // },
                },
                profile(profile) {
                    console.table(profile);
                    return {
                        id: profile.id,
                    }
                },
                wellKnown: 'http://172.18.100.129:8000/o/.well-known/openid-configuration/',
                authorization: {
                    // url: 'http://172.18.100.129:8000/o/authorize/',
                    request(context) {
                        console.log("context", context);
                        return context;
                    },
                    params: {
                        code_challenge_method: 'S256',
                        code_challenge: 'eYDEkG8Y3wVeylfBwjZp1qWGMou40TmbVE4GwPOyvJ8',
                        response_type: 'code',
                        scope: 'openid read write groups',
                    },
                },
                
            },
        ],
        theme: {
            colorScheme: "dark",
        },
        debug: true,
        cookies: {
            pkceCodeVerifier: {
                name: 'pkce_code_verifier',
                options: {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/',
                    secure: false,
                },
            },
        },
    };
    return await NextAuth(req, res, authOptions)
}