/* eslint-disable react/display-name */
import style from '@/styles/chat.module.css';
import {
    Container, Flex, Input, List, ListItem
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import MessageComponent from "./message";
import { ScrollDownButton } from "./scrollDown";

const BASE_WS_URL = 'ws://172.18.100.129:8000/ws/chat/'

export type Message = {
    id: number;
    message: string;
    timestamp: string;
    edited_timestamp: string;
    user: string;
    user_image: string;
}

type ChatProps = {
    messages: Message[];
    loadMoreMessages: () => Promise<Message[] | null>;
    chatId: string;
}

export function Chat({ messages, loadMoreMessages, chatId }: ChatProps) {
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
        if (element.scrollTop < 0) {
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
            const isScrolledToTop = element.scrollTop === (element.clientHeight - element.scrollHeight + 1);
            const isScrolledTo10Percent = element.scrollTop < (element.clientHeight - element.scrollHeight + 1) * 0.90;
            if (isScrolledToTop) {
                setDisableScroll(false);
                return;
            }
            if (isScrolledTo10Percent) {
                setDisableScroll(true);
                element.scrollTo(0, lastScrollTop);
                load().then(() => {
                    setDisableScroll(false);
                }).catch((err) => {
                    console.error(err);
                    setDisableScroll(false);
                });
            }
        }
        setLastScrollTop(element.scrollTop);
    }, [allLoaded, disableScroll, lastScrollTop, load]);

    const ws = new WebSocket(`${BASE_WS_URL}${chatId}/`);

    const handleNewMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        setMessages(msgs.concat(data));
    };
    
    ws.onmessage = handleNewMessage;

    ws.onclose = (e) => {
        console.error('Chat socket closed unexpectedly');
    };

    ws.onopen = () => {
        console.log('Chat socket opened');
    };

    return (
        <Flex flexDirection={'column'} maxH={'90vh'}>
            <Container className={style.chatContainer} onScroll={handleScroll}>
                <List padding={0} margin={0}>
                    {msgs.map((message, index) => {
                        return (
                            <ListItem key={index}
                                id={msgs[msgs.length - 1].id === message.id ? 'lastMsg' : ''}
                                ref={msgs[msgs.length - 1].id === message.id ? (bottomListRef as any) : null}
                            >
                                <MessageComponent message={message}></MessageComponent>
                            </ListItem>
                        );
                    })}
                </List>
            </Container>
            <Container className={style.messageBoxContainer}>
                <Input placeholder="Type a message" className={style.messageBox}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            ws.send(JSON.stringify({
                                'message': e.currentTarget.value
                            }));
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </Container>
            <ScrollDownButton
                visible={scrolled}
                onClick={() => {
                    bottomListRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
        </Flex>
    );
}
