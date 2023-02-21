import {
  Button, Center, List,
  ListItem
} from "@chakra-ui/react";
import { useRouter } from "next/router";

// get data from server
export async function getServerSideProps() {
  // get from http://localhost:8000/rooms/
  // auth: 
  // - user: marhaubrich
  // - pass: 123123

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic bWFyaGF1YnJpY2g6MTIzMTIz");
  myHeaders.append("Cookie", "csrftoken=IKJpbrpYXqvphl1POlDYiy0XnMi5xBJg");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders
  };

  const res = await fetch("http://localhost:8000/rooms/", requestOptions)
  const data = await res.json();

  console.table(data);
  return {
    props: {
      title: 'Chat',
      rooms: data,
    },
  }
}

type HomeProps = {
  title: string;
  rooms: any;
}

export default function Home({ title, rooms }: HomeProps) {
  const router = useRouter();
  return (
    <>
      <Center>
        <List>
          {rooms.map((room: any) => (
            <ListItem key={room.id}>
              <Button key={room.id} colorScheme="whatsapp" variant="outline" margin={1} onClick={
                () => {
                  router.push({
                    pathname: `/rooms/${room.id}`,
                    query: { name: room.name },
                  });
                }
              }>
                {room.name}
              </Button>
            </ListItem>
          ))}
        </List>
      </Center>
    </>
  );
}
