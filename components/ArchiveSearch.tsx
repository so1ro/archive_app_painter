import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useArchiveState } from "@/context/useArchiveState"
import { Box, Input, InputGroup, InputLeftElement, InputRightElement, useColorModeValue, useToast } from "@chakra-ui/react"
import { CloseIcon, SearchIcon } from "@chakra-ui/icons"
import { card_background_color, highlight_color, text_color } from '@/styles/colorModeValue'
import { ToastError } from '@/components/Toast'

import { postData } from '@/utils/helpers'

export default function ArchiveSearch({ filter }) {
    // Hook
    const {
        searchKeyword,
        setSearchKeyword,
        setIsShowingSearchResult,
        isSeaching,
        setIsSeaching,
        isWaitingSearchResult,
        setIsWaitingSearchResult,
        setSearchedArchiveResult,
        isShowingSearchResult } = useArchiveState()
    const toast = useToast()

    // Ref
    const searchInput = useRef<HTMLInputElement>(null)

    // Effect
    // useEffect(() => {
    //     setSearchedArchiveResult({ searchedArchiveResult: [] })
    //     setSearchKeyword({ searchKeyword: '' })
    // }, [])

    useEffect(() => { if (!searchKeyword) clear() }, [searchKeyword])

    // Fuctions - graphql-search
    const handleSearchState = ({ currentTarget: { value: input } }) => {
        setIsShowingSearchResult({ isShowingSearchResult: false })
        setSearchedArchiveResult({ searchedArchiveResult: [] })
        input ?
            setIsSeaching({ isSeaching: true }) : () => {
                setIsSeaching({ isSeaching: false })
                setIsShowingSearchResult({ isShowingSearchResult: false })
            }
        setSearchKeyword({ searchKeyword: input })
    }

    const handleExecuteSearch = async () => {
        setIsWaitingSearchResult({ isWaitingSearchResult: true })

        const res = await postData({ url: '/api/graphqlSearch', data: { keyword: searchKeyword, filter } })
        setSearchedArchiveResult({ searchedArchiveResult: res.searchedArchive })
        if (res.error) toast({ duration: 9000, render: () => (<ToastError text={"検索が実行できませんでした。ネット回線をご確認ください。"} />) })

        setIsWaitingSearchResult({ isWaitingSearchResult: false })
        setIsShowingSearchResult({ isShowingSearchResult: true })
    }

    const clear = () => {
        // Could Ref be in Context???
        searchInput.current.value = ""
        // setHits({ hits: {} })
        setIsSeaching({ isSeaching: false })
        setIsShowingSearchResult({ isShowingSearchResult: false })
        setSearchedArchiveResult({ searchedArchiveResult: [] })
        setSearchKeyword({ searchKeyword: '' })
    }

    return (
        <InputGroup ml={6} pos='relative'>
            <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color={useColorModeValue(text_color.l, text_color.d)} />} />
            <Input
                variant="filled"
                placeholder="このカテゴリーから検索"
                borderRadius='full'
                w={{ base: '220px', sm: '240px', md: '280px' }} fontSize={{ base: 'xs', md: 'sm' }}
                borderWidth='1px'
                bg={useColorModeValue(card_background_color.l, card_background_color.d)}
                borderColor={isSeaching ? useColorModeValue(highlight_color.l, highlight_color.d) : useColorModeValue('gray.200', '#172128')}
                focusBorderColor={useColorModeValue(highlight_color.l, highlight_color.d)}
                // Fuction
                onChange={handleSearchState}
                ref={searchInput}
                value={searchKeyword}
                // isComposing
                onKeyPress={e => { if (e.key === 'Enter') handleExecuteSearch() }}
            />
            {isSeaching && !isShowingSearchResult && !isWaitingSearchResult &&
                <Box
                    color={useColorModeValue(highlight_color.l, highlight_color.d)}
                    mt="4"
                    pos='absolute'
                    bottom={-6}
                    left={0}
                    zIndex={2}
                    fontSize='xs'>
                    入力確定後、Enter を押してください。
                </Box>}
            <InputRightElement
                cursor='pointer'
                children={<CloseIcon color={useColorModeValue(text_color.l, text_color.d)}
                    onClick={clear}
                    w={3} h={3}
                />} />
        </InputGroup>
    )
}