import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const authOptions: AuthOptions = {
        providers: [
            CredentialProvider({
                name: "Credentials",
                credentials: {
                    username: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" },
                },
                authorize: async (credentials) => {
                    if (!credentials?.username || !credentials?.password) {
                        return null;
                    }
                    if (credentials.username === "jsmith" && credentials.password === "password") {
                        return { id: 1, name: "John Smith", email: "jsmith@js.com" };
                    }
                    const response = await axios.post("http://localhost:8000/auth/login/", {
                        username: credentials.username,
                        password: credentials.password,
                    });
                    response.headers["set-cookie"]?.forEach((cookie: string) => {
                        res.setHeader("set-cookie", cookie);
                    });
                    if (response.status === 200) {
                        return {
                            id: response.data.user.username,
                            email: response.data.user.email,
                            name: `${response.data.user.first_name} ${response.data.user.last_name}`
                        }
                    }
                    return null;
                },
            }),
        ],
        events: {
            signOut(message) {
                // remove sessionid cookie
                res.setHeader("set-cookie", "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax");
            },
            signIn(message) {
                // enable withCredentials
                res.setHeader("Access-Control-Allow-Credentials", "true");
            }
        },
        theme: {
            colorScheme: "dark",
        },
        session: {
            strategy: "jwt",
            generateSessionToken: async () => {
                return "1234";
            }
        },
        callbacks: {
            jwt(params) {
                if (params?.token) {
                    params.token.accessToken = params?.account?.access_token;
                }
                return params;
            },
        },
    };
    return await NextAuth(req, res, authOptions)
}