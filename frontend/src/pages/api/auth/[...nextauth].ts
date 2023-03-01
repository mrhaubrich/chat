import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions, User } from "next-auth";

const CODE_VERIFIER = process.env.CODE_VERIFIER;
const CLIENT_ID = "Ni2SKOdWMLoL3rYDbqlUW3rphQsstZxD06nbzxdd";
const CLIENT_SECRET = "UDH4eZOpikLYflzAxrZAY0xDetiyPTyVQWGIeDeNrq7m0VJwC2C5QiT642D0aTN1sB2HbPJREfkWjLsArJC0WKbgb0kgPeC6OfzHSUy9oGc6yVNAjHyqI5OOijhNbvbP";
console.log("CODE_VERIFIER", CODE_VERIFIER);
type TokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
    id_token: string;
};

async function postToken(context): Promise<TokenResponse> {
    const code = context.params.code;

    const redirect_uri = context.provider.callbackUrl;
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'code_verifier': CODE_VERIFIER,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    });
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/o/token/',
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    const response = await axios(config).catch(function (error) {
        console.error(error);
    });
    return response.data;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const authOptions: AuthOptions = {
        providers: [
            {
                id: "backend",
                name: "Backend",
                type: "oauth",
                // authorization: "http://172.18.100.129:8000/o/authorize",
                // token: "http://172.18.100.129:8000/o/token/",
                userinfo: "http://172.18.100.129:8000/o/userinfo/",
                // accessTokenUrl: "http://172.18.100.129:8000/o/token/",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                jwks_endpoint: 'http://172.18.100.129:8000/o/.well-known/jwks.json',
                token: {
                    // url: "http://172.18.100.129:8000/o/token/",
                    params: {
                        code_verifier: CODE_VERIFIER,
                    },
                    request: async (context) => {
                        const tokens = await postToken(context);
                        return { tokens };
                    },
                },
                profile(profile) {
                    // profile['profile_id'] = profile['sub'];
                    console.table(profile);
                    const user: User = {
                        id: profile['sub'],
                        name: profile['name'],
                        email: profile['email'],
                    };
                    return user;
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
                        scope: 'openid read write groups email profile account',
                        nonce: 'nonce',
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
                name: 'next-auth.pkce.code_verifier',
                options: {
                    httpOnly: true,
                    sameSite: 'none',
                    path: '/',
                    secure: true
                }
            }
        },
    };
    return await NextAuth(req, res, authOptions)
}