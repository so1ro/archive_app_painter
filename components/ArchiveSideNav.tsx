import { useState } from 'react';
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useArchiveState } from "@/context/useArchiveState"
import ArchiveActiveLink from '@/components/ArchiveActiveLink';
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Link,
    useColorModeValue
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import { highlight_color, text_color } from '@/styles/colorModeValue';

export default function ArchiveSideNav({ pathObj, onCloseDrawer }: { pathObj: ArchivePath[], onCloseDrawer: () => void | null }) {

    const router = useRouter()
    const { locale } = useRouter()
    const route = router.pathname.split('/')[1]
    const { setSearchKeyword } = useArchiveState()

    // For routes which need Accordion to be opened.
    let defaultIndex: number | null = null
    if (router.query.path.length === 2) {
        const indexOfRouteMatchPath = _.findIndex(pathObj, (o) => router.query.path[0] === o.id)
        const indexOfFisrtAccordion = _.findIndex(pathObj, (o) => !!o.paths)
        defaultIndex = indexOfRouteMatchPath - indexOfFisrtAccordion
    }

    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

    const [{ isExpanding }, setIsExpanding] = useState<{ isExpanding: boolean }>({ isExpanding: false })

    const accordionCss = css`
        .chakra-accordion__item:last-of-type {
            border-bottom-width: 0;
        }
    `
    // button[aria-expanded=true] div {
    //     color : ${highLightColor};
    // }

    return (
        <Accordion allowToggle css={accordionCss} defaultIndex={defaultIndex} top={8} fontSize={{ base: 'sm', xl: 'md' }} py={10}>
            {pathObj.map((obj, i) => {
                // ex: archive/名人
                if (!obj.paths) return (
                    <Box px={8} key={i} d={(obj.id === 'favorite' && route === 'youtube') ? 'none' : 'block'}>
                        <ArchiveActiveLink href={`/${route}/${obj.link}`} >
                            <Link onClick={() => {
                                if (onCloseDrawer !== null) onCloseDrawer()
                                setSearchKeyword({ searchKeyword: '' })
                                setIsExpanding({ isExpanding: false })
                            }}>
                                <Box pb={5}>{obj.categoryName[locale]}</Box>
                            </Link>
                        </ArchiveActiveLink>
                    </Box>)

                // ex: archive/season/春
                else return (
                    <AccordionItem borderTopWidth={0} borderBottomWidth={0} key={i}>
                        {({ isExpanded }) => (
                            <Box borderLeft={isExpanded ? `4px solid ${highLightColor}` : ''} px={8}>
                                <h2>
                                    <AccordionButton px={0} pt={0} pb={5} _expanded={{ color: highLightColor }} fontSize={{ base: 'sm', xl: 'md' }}>
                                        <Box
                                            flex="1"
                                            textAlign="left"
                                            color={useColorModeValue(text_color.l, text_color.d)}>
                                            {obj.categoryName[locale]}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                {obj.paths.map(p => (
                                    <ArchiveActiveLink href={`/${route}/${obj.id}/${p.link}`} key={`${obj.id}/${p.link}`}>
                                        <Link onClick={() => {
                                            setIsExpanding({ isExpanding: true })
                                            if (onCloseDrawer !== null) onCloseDrawer()
                                            setSearchKeyword({ searchKeyword: '' })
                                        }}>
                                            <AccordionPanel pt={0} pb={5} isTruncated>{p.name[locale]}</AccordionPanel>
                                        </Link>
                                    </ArchiveActiveLink>))}
                            </Box>
                        )}

                    </AccordionItem>)
            })}
        </Accordion>
    );
}
