import { signIn, signOut, useSession } from 'next-auth/react';

type AuthenticationRequiredProps = {
    children: React.ReactNode;
}

export default function AuthenticationRequired(props: AuthenticationRequiredProps) {
    const { data, status } = useSession();
    return (
        <>
            {
                status === "loading" && <h2>Loading...</h2>
            }
            {
                status === "unauthenticated" && (
                    <>
                        <h2>You are not signed in</h2>
                        <button onClick={() => signIn()}>Sign in</button>
                        <pre>{!data && "User not logged in."}</pre>
                    </>
                )
            }
            {
                status === "authenticated" && (
                    <>
                        <h2>You are signed in as {data?.user?.email}</h2>
                        <button onClick={() => signOut()}>Sign out</button>
                        {props.children}
                    </>
                )
            }
        </>
    );
}