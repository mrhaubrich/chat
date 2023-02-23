import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const {data, status} = useSession();
    return (
        <>
        {
            status === "loading" && <h2>Loading...</h2>
        }
        {
            status === "unauthenticated" && (
                <>
                    <h2>You are not signed in</h2>
                    <button onClick={()=>signIn()}>Sign in</button>
                    <pre>{!data && "User not logged in."}</pre>
                </>
            )
        }
        {
            status === "authenticated" && (
                <>
                    <h2>You are signed in</h2>
                    <button onClick={()=> signOut()}>Sign out</button>
                    {console.log(data)}
                    {
                        data.user && (
                            <pre>{JSON.stringify(data.user, null, 2)}</pre>
                        )
                    }
                </>
            )
        }
        </>
    );
}
