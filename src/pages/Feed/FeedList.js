import StreamCard from 'components/Card/StreamCard'
import StreamOrderCard from 'components/Card/StreamOrderCard'
import ShowMore from 'components/ShowMore'
import CardSkeleton from 'components/Skeleton/CardSkeleton'
import Heading from 'components/Heading'
import { useSelector } from 'react-redux'
import { useInfiniteQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { setError } from 'slices/rootSlice'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useIntersect } from 'hooks/useIntersect'

const limit = 10

const FeedList = ({
    title,
    fetchFn,
    extraFnProp,
    isStreamOrder = false,
    isFeedItem = false,
    containerClassName,
    queryKey,
    errorMsg,
    EmptyComponent,
    useInfiniteScroll,
    disableCache,
    forceGridTemplate,
    renderItem,
    Skeleton = CardSkeleton,
    skeletonCount = limit,
    enabled,
    onError,
    emptyCallback,
}) => {
    const { isAuthenticated } = useSelector((state) => state.root)
    const dispatch = useDispatch()

    const gridTemplate =
        forceGridTemplate ||
        `grid-cols-2 md:grid-cols-3 ${
            isAuthenticated ? 'xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'
        } 2xl:grid-cols-296`

    const queryFn = useCallback(
        async ({ pageParam = 0 }) => {
            const data = await fetchFn({ ...extraFnProp, skip: pageParam, limit })
            return data
        },
        [extraFnProp, fetchFn],
    )

    const { data, fetchNextPage, isFetching, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: [queryKey, localStorage.getItem('sessionId')],
        queryFn,
        refetchOnWindowFocus: false,
        getNextPageParam: (_lastPage, data) => {
            const hasMore = data.reduce((result, page) => result + page.items.length, 0) < _lastPage.totalCount

            return hasMore && data.length * limit
        },
        cacheTime: disableCache ? 0 : undefined,
        enabled,
        onError(error) {
            onError ? onError(error) : dispatch(setError({ message: errorMsg, error }))
        },
    })
    const { setNode } = useIntersect(() => fetchNextPage(true))

    const flatData = useMemo(() => {
        return (data && data?.pages?.flatMap((page) => page.items)) || []
    }, [data])
    const LoadDetector = useMemo(() => {
        if (hasNextPage) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
    }, [hasNextPage, setNode])

    useEffect(() => {
        emptyCallback && emptyCallback(queryKey, flatData.length)
    }, [data, emptyCallback, flatData.length, queryKey])

    if (!EmptyComponent && data && flatData.length === 0) {
        return null
    }

    return (
        <div className={containerClassName}>
            {title && (
                <div className="mb-5">
                    <Heading title={title} />
                </div>
            )}
            <div className={`grid ${gridTemplate} gap-x-5 gap-y-8.5`}>
                {flatData &&
                    flatData.map((item) => {
                        if (renderItem) {
                            return renderItem({ item })
                        } else {
                            if (isStreamOrder) {
                                return <StreamOrderCard key={item._id} order={item} />
                            }
                            if (isFeedItem) {
                                if (item.type === 'stream') {
                                    return <StreamCard key={item._id} stream={item.stream} />
                                }
                                if (item.type === 'streamOrder') {
                                    return <StreamOrderCard key={item._id} order={item.streamOrder} />
                                }
                                return null
                            }
                            return <StreamCard key={item._id} stream={item} />
                        }
                    })}
                {(isFetching || !data) &&
                    Array(skeletonCount)
                        .fill(1)
                        .map((_, i) => <Skeleton key={`skeleton-card-${i}`} />)}
                {!useInfiniteScroll && hasNextPage && (
                    <div className="col-span-full">
                        <ShowMore loading={isFetching} onClick={fetchNextPage} />
                    </div>
                )}
                {useInfiniteScroll && LoadDetector}
            </div>
            {flatData && flatData.length === 0 && !isLoading && !isFetching && EmptyComponent}
        </div>
    )
}

export default memo(FeedList)
