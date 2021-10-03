import { useRef } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    useColorModeValue
} from "@chakra-ui/react"
import { menuButton_bg_color } from '@/styles/colorModeValue'
import ArchiveSideNav from '@/components/ArchiveSideNav'
import { ArchiveSideMenuIcon } from '@/styles/icons';

export default function ArchiveDrawer({ pathObj }: { pathObj: ArchivePath[] }) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    const topRightPosition = 4
    const btnBottomPosition = [5, 7]
    const btnLeftPosition = -7

    return (
        <>
            <Button
                ref={btnRef}
                colorScheme="teal"
                onClick={onOpen}
                pos="fixed"
                bottom={btnBottomPosition}
                left={btnLeftPosition}
                w={24}
                h={12}
                borderRadius={10}
                justifyContent='flex-end'
                bg={useColorModeValue(menuButton_bg_color.l, menuButton_bg_color.d)}
                _hover={{ bg: useColorModeValue(menuButton_bg_color.l, menuButton_bg_color.d) }}
                display={{ base: 'inline-flex', lg: 'none' }}
                zIndex='2'>
                <ArchiveSideMenuIcon w={8} h={8} />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton top={topRightPosition} right={topRightPosition} />
                    <DrawerHeader>もくじ</DrawerHeader>
                    <DrawerBody style={{ padding: 0 }}>
                        <ArchiveSideNav pathObj={pathObj} onCloseDrawer={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

