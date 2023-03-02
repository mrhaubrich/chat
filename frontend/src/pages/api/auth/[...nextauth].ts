import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions, User } from "next-auth";
import { env } from "process";

const CODE_VERIFIER = env.CODE_VERIFIER;
const BACKEND_URL = env.BACKEND_URL;
const CLIENT_ID = "Ni2SKOdWMLoL3rYDbqlUW3rphQsstZxD06nbzxdd";
const CLIENT_SECRET = "UDH4eZOpikLYflzAxrZAY0xDetiyPTyVQWGIeDeNrq7m0VJwC2C5QiT642D0aTN1sB2HbPJREfkWjLsArJC0WKbgb0kgPeC6OfzHSUy9oGc6yVNAjHyqI5OOijhNbvbP";
console.log("CODE_VERIFIER", CODE_VERIFIER);
console.log('port:', env.PORT);
type TokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
    id_token: string;
};

async function postToken(context: any): Promise<TokenResponse> {
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
        url: `${BACKEND_URL}/o/token/`,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    const response = await axios(config).catch(function (error: any) {
        console.error(error);
    });
    return response.data;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const authOptions: AuthOptions = {
        providers: [
            {
                id: "backend",
                name: "Meu Auth",
                type: "oauth",
                // authorization: `${BACKEND_URL}/o/authorize`,
                // token: `${BACKEND_URL}/o/token/`,
                userinfo: `${BACKEND_URL}/o/userinfo/`,
                // accessTokenUrl: `${BACKEND_URL}/o/token/`,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                jwks_endpoint: `${BACKEND_URL}/o/.well-known/jwks.json`,
                token: {
                    // url: `${BACKEND_URL}/o/token/`,
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
                wellKnown: `${BACKEND_URL}/o/.well-known/openid-configuration/`,
                authorization: {
                    // url: `${BACKEND_URL}/o/authorize/`,
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
        events: {
            signIn(message) {
                const accessToken = message.account?.access_token;
                const tokenType = message.account?.token_type;
                console.log("accessToken", accessToken)
                console.log('\n\n\n\n', message, '\n\n\n\n')
                if (!accessToken || !tokenType) {
                    return;
                }
                const authHeader = `${tokenType} ${accessToken}`;

            },
            signOut(message) {
                const authHeader = undefined;
            }
        },
        callbacks: {

            async jwt({ token, user, account, profile, isNewUser }) {
                if (user) {
                    token.id = user.id;
                }
                if (account) {
                    token.accessToken = account.access_token;
                }
                console.log("------------------- JWT -------------------")
                console.log(token);
                console.log("-------------------------------------------")
                return token;
            },
        },

    };
    return await NextAuth(req, res, authOptions)
}