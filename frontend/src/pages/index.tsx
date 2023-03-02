import AuthenticationRequired from "@/components/auth/authRequired";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter()
    return (
        <AuthenticationRequired>
            <>
                <h1>Home</h1>
                {/* main screen */}
                {/* button to go to rooms */}
                <Button onClick={() => {
                    router.push('/rooms');
                }}>Rooms</Button>
            </>
        </AuthenticationRequired>
    );
}
