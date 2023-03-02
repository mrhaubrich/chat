import AuthenticationRequired from '@/components/auth/authRequired';
import { Chat } from '@/components/chat';
import { Container } from '@chakra-ui/react';
import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { env } from "process";
import { useState } from 'react';

type RoomProps = {
    title: string;
    messages: any;
    next: string | null;
    headers: any;
    chatId: string;
}

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

function Room({ messages, next, headers, chatId }: RoomProps) {
    const router = useRouter();
    const [nextPage, setNextPage] = useState(next);
    const { name } = router.query;
    const id = router.query.id as string;
    
    return (
        <AuthenticationRequired showBar={false}>
            <Container minW={'100%'} padding={0} margin={0}>
                <div>
                    <h1>{name}</h1>
                </div>
                <Chat messages={messages} chatId={id} loadMoreMessages={async () => {
                    if (nextPage === null) {
                        return null;
                    }
                    const dat = await getMessages(nextPage, headers);
                    console.log(dat.next);
                    setNextPage(dat.next);
                    return dat.results;
                }}></Chat>
            </Container>
        </AuthenticationRequired>
    );
}

export default Room;