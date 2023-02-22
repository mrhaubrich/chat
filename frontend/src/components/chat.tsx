/* eslint-disable react/display-name */
import {
    Container, Input, List, ListItem, Tag, Tooltip
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { ScrollDownButton } from "./scrollDown";
import UserIcon from "./userIcon";

export type Message = {
    id: number;
    message: string;
    timestamp: string;
    edited_timestamp: string;
    user: string;
}

type ChatProps = {
    messages: Message[];
    loadMoreMessages: () => Promise<Message[] | null>;
}

export function Chat({ messages, loadMoreMessages }: ChatProps) {
    const [msgs, setMessages] = useState<any[]>(messages);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [disableScroll, setDisableScroll] = useState<boolean>(false);
    const [lastScrollTop, setLastScrollTop] = useState<number>(0);
    const [allLoaded, setAllLoaded] = useState<boolean>(false);

    const bottomListRef = useRef<HTMLUListElement>(null);

    const load = useCallback(async () => {
        // simulate API call to load more messages
        const newMessages = await loadMoreMessages();
        if (!newMessages) {
            // console.warn('No more messages to load');
            setAllLoaded(true);
            return;
        }
        // console.table(newMessages)
        setMessages(newMessages.concat(msgs));
    }, [loadMoreMessages, msgs]);

    const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.target as HTMLDivElement;
        if (element.scrollTop !== 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
        if (allLoaded) {
            return;
        }
        if (disableScroll) {
            // console.log('disableScroll')
            element.scrollTo(0, lastScrollTop);
            return;
        }
        if (lastScrollTop > element.scrollTop) {
            // upscroll code
            const isScrolledToTop = element.scrollTop === (element.clientHeight - element.scrollHeight + 1);
            const isScrolledTo10Percent = element.scrollTop < (element.clientHeight - element.scrollHeight + 1) * 0.90;
            if (isScrolledToTop) {
                load();
            }
            else if (isScrolledTo10Percent) {
                setDisableScroll(true);
                element.scrollTo(0, lastScrollTop);
                load();
                setTimeout(() => {
                    setDisableScroll(false);
                }, 1000);
            }
        } else {
            // downscroll code
            // console.log('downscroll');
        }
        setLastScrollTop(element.scrollTop);
    }, [allLoaded, disableScroll, lastScrollTop, load]);

    return (
        <>
            <Container
                position={'relative'}
                overflowY='scroll'
                overflowX='hidden'
                border='1px'
                borderColor='gray.200'
                borderRadius='md'
                padding={0}
                margin={0}
                minW={'100%'}
                height={'calc(100vh - 4rem)'}
                // start from the bottom
                display='flex'
                flexDirection='column-reverse'
                onScroll={handleScroll}
            >
                <List padding={0} margin={0}>
                    {msgs.map((message, index) => {
                        return (
                            <ListItem key={index}
                                id={msgs[msgs.length - 1].id === message.id ? 'lastMsg' : ''}
                                // if the last message is the current message, scroll to it
                                ref={msgs[msgs.length - 1].id === message.id ? (bottomListRef as any) : null}
                            >
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
                            </ListItem>
                        );
                    })}
                </List>
            </Container>
            <Container
                position={'relative'}
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                padding={0}
                margin={0}
                minW={'100%'}
                height={'2rem'}
            >
                <Input
                    placeholder="Type a message"
                    size="lg"
                    width={'100%'}
                    height={'100%'}
                    padding={0}
                    margin={0}
                />
            </Container>
            <ScrollDownButton
                visible={scrolled}
                onClick={() => {
                    bottomListRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
        </>
    );
}
