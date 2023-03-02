/* eslint-disable react/display-name */
import style from '@/styles/chat.module.css';
import {
    Container, Input, List, ListItem
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import MessageComponent from "./message";
import { ScrollDownButton } from "./scrollDown";

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
        }
        setLastScrollTop(element.scrollTop);
    }, [allLoaded, disableScroll, lastScrollTop, load]);

    return (
        <>
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
                        console.log('Enter pressed');
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
        </>
    );
}
