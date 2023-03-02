import AuthenticationRequired from "@/components/auth/authRequired";
import {
  Button, Center, List,
  ListItem
} from "@chakra-ui/react";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { env } from "process";

const BACKEND_URL = env.BACKEND_URL;

// get data from server
export async function getServerSideProps(context: any) {
  const token = await getToken({ req: context.req, secret: env.SECRET });
  
  if (!token) {
    return {};
  }

  const headers = {
    Authorization: `Bearer ${token.accessToken}`,
  };
  const res = await axios.get(`${BACKEND_URL}/rooms/`, { headers });

  return {
    props: {
      title: 'Chat',
      rooms: res.data.results,
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
    <AuthenticationRequired>
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
    </AuthenticationRequired>
  );
}
