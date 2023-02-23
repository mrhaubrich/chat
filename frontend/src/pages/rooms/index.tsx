import {
  Button, Center, List,
  ListItem
} from "@chakra-ui/react";
import { useRouter } from "next/router";
  
  // get data from server
  export async function getServerSideProps(context: any) {
    if (!context.req.cookies.sessionid) {
      return {
          redirect: {
              destination: `http://127.0.0.1:3000/api/auth/signin?callbackUrl=${context.req.url}`,
              permanent: false,
          },
      };
  }
  
    var myHeaders = new Headers();
    myHeaders.append('Cookie', `sessionid=${context.req.cookies.sessionid}`);
  
    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
  
    const res = await fetch("http://localhost:8000/rooms/", requestOptions)
    const data = await res.json();
  
    // console.table(data);
    return {
      props: {
        title: 'Chat',
        rooms: data.results,
      },
    }
  }
  
  type RoomsProps = {
    title: string;
    rooms: any;
  }
  
  export default function Rooms({ title, rooms }: RoomsProps) {
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
  