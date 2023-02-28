import { Chat } from '@/components/chat';
import { Container } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { get } from 'superagent';

async function getMessages(url: string, sessionid?: string, session?: Session) {
    console.log(sessionid);
    var myHeaders = new Headers();
    console.log(session);


    // console.table(url);
    console.table(myHeaders);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };
    const headers = { Cookie: `sessionid=${sessionid}` };

    const res = await (get(url).set(headers).withCredentials());
    return JSON.parse(res.text);
}

export async function getServerSideProps(context: any) {
    if (!context.req.cookies.sessionid) {
        return {
            redirect: {
                destination: `http://172.18.100.129:3000/api/auth/signin?callbackUrl=${context.req.url}`,
                permanent: false,
            },
        };
    }
    const data = await getMessages(`http://localhost:8000/rooms/${context.query.id}/messages/?limit=20&offset=0`, context.req.cookies.sessionid);
    const allPages = [];
    const count = data.count;

    for (let i = 0; i < count / 20; i++) {
        allPages.push(data.next.replace('offset=20', `offset=${i * 20}`));
    }

    // console.table(allPages);

    return {
        props: {
            messages: data.results,
            next: data.next,
            sessionid: context.req.cookies.sessionid,
        },
    };
}

type RoomProps = {
    title: string;
    messages: any;
    next: string | null;
    sessionid: string;
}

function Room({ messages, next, sessionid }: RoomProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [nextPage, setNextPage] = useState(next);
    const { id, name } = router.query;
    const { data, status } = useSession();
    return (
        <>
            {status === "loading" && <h2>Loading...</h2>}
            {status === "authenticated" &&
                <Container minW={'100%'} padding={0} margin={0}>
                    <div>
                        <h1>{name}</h1>
                    </div>
                    <Chat messages={messages} sessionid={sessionid} loadMoreMessages={async (sid) => {
                        if (nextPage === null) {
                            return null;
                        }
                        const dat = await getMessages(nextPage, undefined, data!);
                        setNextPage(dat.next);
                        return dat.results;
                    }}></Chat>
                </Container>
            }
        </>
    );
}

export default Room;