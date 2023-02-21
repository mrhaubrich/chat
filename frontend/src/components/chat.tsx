/* eslint-disable react/display-name */
import {
    Container,
    Input, List, ListItem, Tag, Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import UserIcon from "./userIcon";

export function Chat({ messages }: any) {
    // connect to websocket
    const [msgs, setMessages] = useState<any[]>(messages);
    return (
        < Container
            overflowY='scroll'
            overflowX='hidden'
            border='1px'
            borderColor='gray.200'
            borderRadius='md'
            padding={0}
            margin={0}
            minW={'100%'}
            // height must be 100% - height of the input field
            height={'calc(100vh - 4rem)'}
            
        >
            <List
            padding={0}
            margin={0}
            >
                {msgs.map((message) => {
                    return (
                        <ListItem key={message.id}>
                            <Tag variant={"subtle"} colorScheme={"whatsapp"} style={{
                                margin: '0.5rem',
                                marginTop: 0,
                                padding: '0.5rem',
                            }}>
                                {/* message.user small on top of the message.message */}
                                <Container>
                                    <Tooltip hasArrow label={message.user} closeDelay={500} placement='right'>
                                        <UserIcon name={message.user} size='xs' src={message.user_image}></UserIcon>
                                    </Tooltip>
                                    <p style={{ marginTop: 10 }}> {message.message}</p>
                                </Container>
                            </Tag>
                        </ListItem>
                    );
                })}
            </List>
            {/* fixed on bottom (not scroll needed)*/}

            <Container position='fixed' left={0} bottom={0} minW="100%" padding={0}>
                <Input placeholder='Type your message here...' minW="100%"/>
            </Container>
        </Container>

    );
}