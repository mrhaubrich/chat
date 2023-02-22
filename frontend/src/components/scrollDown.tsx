import {
    Container,
    IconButton
} from "@chakra-ui/react";
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type ScrollDownButtonProps = {
    visible?: boolean;
    onClick?: () => void;
}

export function ScrollDownButton({ visible, onClick }: ScrollDownButtonProps) {
    return (
        <Container
            position='fixed'
            right={0}
            bottom={0}
            padding={0}
            paddingRight={0}
            margin={12}
            marginRight={6}
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            justifyContent='flex-end'
            opacity={visible ? 1 : 0}
            transition="opacity 0.5s ease"
        >
            <IconButton aria-label="Scroll to bottom"
                icon={<MdOutlineKeyboardArrowDown />}
                size='lg'
                colorScheme='whatsapp'
                rounded={"full"}
                maxW={'3rem'}
                maxH={'3rem'}
                onClick={onClick}
            ></IconButton>
        </Container>

    );
}