import { Chat } from '@/components/chat';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

async function getMessages(url: string) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic bWFyaGF1YnJpY2g6MTIzMTIz");
    myHeaders.append("Cookie", "csrftoken=IKJpbrpYXqvphl1POlDYiy0XnMi5xBJg");

    // console.table(url);
    // console.table(myHeaders.values());
    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    const res = await fetch(url, requestOptions)
    return res.json();
}

export async function getServerSideProps(context: any) {

    const data = await getMessages(`http://localhost:8000/rooms/${context.query.id}/messages/?limit=20&offset=0`);

    const allPages = [];
    const count = data.count;

    for (let i = 0; i < count / 20; i++) {
        allPages.push(data.next.replace('offset=20', `offset=${i * 20}`));
    }

    // console.table(allPages);

    return {
        props: {
            title: 'Chat',
            messages: data.results,
            pages: allPages,
            next: data.next,
        },
    };
}

type RoomProps = {
    title: string;
    messages: any;
    pages: string[];
    next: string | null;
}

function Room({ title, messages, pages, next }: RoomProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [nextPage, setNextPage] = useState(next);
    const { id, name } = router.query;
    return (
        <Container minW={'100%'} padding={0} margin={0}>
            <div>
                <h1>{name}</h1>
            </div>
            <Chat messages={messages} loadMoreMessages={async () => {
                if (nextPage === null) {
                    return null;
                }
                const data = await getMessages(nextPage);
                setNextPage(data.next);
                return data.results;
            }}></Chat>
        </Container>
    );
}

export default Room;