/* eslint-disable react/display-name */
import style from '@/styles/chat.module.css';
import {
    Container, Flex, Input, List, ListItem
} from "@chakra-ui/react";
import { useCallback, useReducer, useRef } from "react";
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

type ReduxState = {
    messages?: Message[];
    scrolled?: boolean;
    disableScroll?: boolean;
    lastScrollTop?: number;
    allLoaded?: boolean;
}

export function Chat({ messages, loadMoreMessages, chatId }: ChatProps) {

    const [states, setStates] = useReducer((oldStates: ReduxState, newStates: ReduxState) => {
        return { ...oldStates, ...newStates };
    }, {
        messages,
        scrolled: false,
        disableScroll: false,
        lastScrollTop: 0,
        allLoaded: false,
    });

    const setMessages = (messages: Message[]) => setStates({ messages });
    const setScrolled = (scrolled: boolean) => setStates({ scrolled });
    const setDisableScroll = (disableScroll: boolean) => setStates({ disableScroll });
    const setLastScrollTop = (lastScrollTop: number) => setStates({ lastScrollTop });
    const setAllLoaded = (allLoaded: boolean) => setStates({ allLoaded });

    const { messages: msgs, scrolled, disableScroll, lastScrollTop, allLoaded } = states;
    const wsRef = useRef<WebSocket | null>(null);
    const ws = wsRef.current ?? new WebSocket(BASE_WS_URL + chatId + '/');
    // set wsRef.current to ws
    wsRef.current = ws;



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
        if (msgs) {
            setMessages(newMessages.concat(msgs));
        }
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
            if (lastScrollTop) {
                element.scrollTo(0, lastScrollTop);
            }
            return;
        }
        if (lastScrollTop && lastScrollTop > element.scrollTop) {
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

    const handleNewMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        if (msgs) {
            setMessages(msgs.concat(data));
        }
    };

    ws.onmessage = handleNewMessage;

    ws.onclose = (e) => {
        console.error('Chat socket closed unexpectedly');
    };

    ws.onopen = () => {
        console.log('Chat socket opened');
    };

    return (
        <Flex flexDirection={'column'}>
            <Container className={style.chatContainer} onScroll={handleScroll}>
                <List padding={0} margin={0}>
                    {msgs && msgs.map((message, index) => {
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
