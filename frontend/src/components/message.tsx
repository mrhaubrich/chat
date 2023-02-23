import { Container, Tag, Tooltip } from "@chakra-ui/react";
import { Message } from "./chat";
import UserIcon from "./userIcon";

type MessageComponentProps = {
    message: Message
}

function MessageComponent({ message }: MessageComponentProps) {
    return (
        <Tag variant={"subtle"} colorScheme={"whatsapp"} style={{
            margin: '0.5rem',
            marginTop: 0,
            padding: '0.5rem',
        }}>
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    placeItems: 'center',
                    marginBottom: '0.5rem',
                }}>
                    <Tooltip hasArrow label={message.user} placement="top">
                        <UserIcon
                            name={message.user}
                            src={message.user_image}
                            size={'sm'}
                        />
                    </Tooltip>
                    <p style={{
                        marginLeft: 10,
                        fontSize: 12,
                        color: 'GrayText',
                        // center text in line
                        alignSelf: 'center',
                        // center text in line
                        justifySelf: 'center',
                        // center text in line
                        placeSelf: 'center',
                    }}> {message.user}</p>
                </div>
                <div style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: 'lightgray',
                    marginBottom: '0.5rem',
                }} />
                
                <span>{message.message}</span>
            </Container>
        </Tag>
    );
}

export default MessageComponent;