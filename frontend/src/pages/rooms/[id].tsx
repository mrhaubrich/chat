import { Chat } from '@/components/chat';
import { Container } from '@chakra-ui/react';
import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { env } from "process";
import { useState } from 'react';

const BACKEND_URL = env.BACKEND_URL;

async function getMessages(url: string, headers: any) {
    console.log(url);
    const res = await axios.get(url, { headers });
    return res.data;
}

export async function getServerSideProps(context: any) {

    const token = await getToken({ req: context.req, secret: env.SECRET });

    if (!token) {
        return {};
    }

    const headers = {
        Authorization: `Bearer ${token.accessToken}`,
    };
    const data = await getMessages(`${BACKEND_URL}/rooms/${context.query.id}/messages/?limit=20&offset=0`, headers);

    console.log(data.next);

    return {
        props: {
            messages: data.results,
            next: data.next,
            headers: headers,
        },
    };
}

type RoomProps = {
    title: string;
    messages: any;
    next: string | null;
    headers: any;
}

function Room({ messages, next, headers }: RoomProps) {
    const router = useRouter();
    const [nextPage, setNextPage] = useState(next);
    const { name } = router.query;
    const { data, status } = useSession();
    return (
        <>
            {status === "loading" && <h2>Loading...</h2>}
            {status === "authenticated" &&
                <Container minW={'100%'} padding={0} margin={0}>
                    <div>
                        <h1>{name}</h1>
                    </div>
                    <Chat messages={messages} loadMoreMessages={async () => {
                        if (nextPage === null) {
                            return null;
                        }
                        const dat = await getMessages(nextPage, headers);
                        console.log(dat.next);
                        setNextPage(dat.next);
                        return dat.results;
                    }}></Chat>
                </Container>
            }
        </>
    );
}

export default Room;