import { Chat } from '@/components/chat';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic bWFyaGF1YnJpY2g6MTIzMTIz");
    myHeaders.append("Cookie", "csrftoken=IKJpbrpYXqvphl1POlDYiy0XnMi5xBJg");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    const res = await fetch(`http://localhost:8000/rooms/${id}/messages/`, requestOptions)
    const data = await res.json();
    return {
        props: {
            title: 'Chat',
            messages: data,
        },
    };
}

type RoomProps = {
    title: string;
    messages: any;
}

function Room({ title, messages }: RoomProps) {
    const router = useRouter();
    const { id, name } = router.query;
    return (
        <Container minW={'100%'} padding={0} margin={0}>
            <div>
                <h1>{name}</h1>
            </div>
            <Chat messages={messages}></Chat>
        </Container>
    );
}

export default Room;