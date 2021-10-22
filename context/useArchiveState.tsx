import { useEffect, useState, createContext, useContext } from 'react'
import { limitSkipNum } from '@/hook/contentful-queries';

export const ArchiveStateContext = createContext(null);

export const ArchiveStateProvider = (props) => {

  // State
  const [{ isAutoplay }, setIsAutoplay] = useState<{ isAutoplay: boolean }>({ isAutoplay: false })
  const [{ searchKeyword }, setSearchKeyword] = useState<{ searchKeyword: string }>({ searchKeyword: '' })
  const [{ isSeaching }, setIsSeaching] = useState<{ isSeaching: boolean }>({ isSeaching: false })
  const [{ isWaitingSearchResult }, setIsWaitingSearchResult] = useState<{ isWaitingSearchResult: boolean }>({ isWaitingSearchResult: false })
  const [{ isShowingSearchResult }, setIsShowingSearchResult] = useState<{ isShowingSearchResult: boolean }>({ isShowingSearchResult: false })
  const [{ searchedArchiveResult }, setSearchedArchiveResult] = useState<{ searchedArchiveResult: SearchedArchiveResultInterface[] }>({ searchedArchiveResult: [] })
  const [{ isVideoMode }, setIsVideoMode] = useState<{ isVideoMode: boolean }>({ isVideoMode: false })
  const [{ isArchiveDesc }, setIsArchiveDesc] = useState<{ isArchiveDesc: boolean }>({ isArchiveDesc: true })
  const [{ currentDisplayArchive }, setCurrentDisplayArchive] = useState<{ currentDisplayArchive: AllArchivesInterface | null }>({ currentDisplayArchive: null })
  const [{ isFetchingMoreContent }, setIsFetchingMoreContent] = useState<{ isFetchingMoreContent: boolean }>({ isFetchingMoreContent: false })
  const [{ scrollY }, setScrollY] = useState<{ scrollY: number }>({ scrollY: 0 })
  const [{ isShowingTierArchiveOnly }, setIsShowingTierArchiveOnly] = useState<{ isShowingTierArchiveOnly: boolean }>({ isShowingTierArchiveOnly: true })

  // Effect
  // useEffect(() => { }, []);

  const value = {
    isAutoplay,
    setIsAutoplay,
    searchKeyword,
    setSearchKeyword,
    isSeaching,
    setIsSeaching,
    isWaitingSearchResult,
    setIsWaitingSearchResult,
    isShowingSearchResult,
    setIsShowingSearchResult,
    searchedArchiveResult,
    setSearchedArchiveResult,
    isVideoMode,
    setIsVideoMode,
    isArchiveDesc,
    setIsArchiveDesc,
    currentDisplayArchive,
    setCurrentDisplayArchive,
    isFetchingMoreContent,
    setIsFetchingMoreContent,
    scrollY,
    setScrollY,
    isShowingTierArchiveOnly,
    setIsShowingTierArchiveOnly,
  }
  return <ArchiveStateContext.Provider value={value} {...props} />;
};

export const useArchiveState = () => {
  const context = useContext(ArchiveStateContext);
  if (context === undefined) {
    throw new Error(`useArchiveState must be used within a ArchiveStateProvider.`);
  }
  return context;
};