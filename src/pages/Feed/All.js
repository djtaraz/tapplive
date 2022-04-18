import React, { memo, useMemo, useCallback } from 'react'
import { getAuth } from 'requests/axiosConfig'
import { useTranslation } from 'react-i18next'

import MajorCardStripe from 'components/Card/MajorCardStripe'
import CardStripe from 'components/Card/CardStripe'
import PageStripe from 'components/Layout/PageStripe'
import RecentStreams from 'containers/RecentStreams'

import { allFields } from './fields'
import CardGridSkeleton from 'components/Skeleton/CardGridSkeleton'
import { useInfiniteQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { setError } from 'slices/rootSlice'

function All() {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const queryFn = useCallback(async () => {
        const { data } = await getAuth(`/content-summary?_fields=${allFields}&limit=10`)
        return data.result
    }, [])

    const { data } = useInfiniteQuery({
        queryKey: 'feed_all',
        queryFn,
        refetchOnWindowFocus: false,
        onError(error) {
            dispatch(setError({ message: 'Failed to fetch', error }))
        },
    })

    const feedData = data?.pages[0]

    const userSubscriptionData = useMemo(() => {
        return feedData?.subscriptionUserItems
            ? feedData.subscriptionUserItems
                  .map((data) => {
                      if (!data.stream && !data.streamOrder) return null

                      return data.type === 'stream'
                          ? { ...(data.stream || []), type: 'stream' }
                          : { ...(data.streamOrder || []), type: 'streamOrder' }
                  })
                  .filter((data) => data)
            : null
    }, [feedData?.subscriptionUserItems])

    const boughtStreamsData = useMemo(() => {
        return feedData?.boughtStreams ? feedData.boughtStreams.map((data) => ({ ...data, type: 'stream' })) : null
    }, [feedData?.boughtStreams])

    const followedTagsData = useMemo(() => {
        return feedData?.favoriteTagItems
            ? feedData.favoriteTagItems
                  .map((data) => {
                      if (!data.stream && !data.streamOrder) return null

                      return data.type === 'stream'
                          ? { ...(data.stream || []), type: 'stream' }
                          : { ...(data.streamOrder || []), type: 'streamOrder' }
                  })
                  .filter((data) => data)
            : null
    }, [feedData?.favoriteTagItems])

    return feedData ? (
        <div style={{ gridTemplateRows: 'repeat(4, auto)' }} className="grid grid-cols-1 gap-9">
            {feedData.subscriptionUserItems && feedData.subscriptionUserItems.length > 0 && (
                <MajorCardStripe
                    title={t('followedChannels')}
                    watchAll="/followed-channels"
                    cardData={userSubscriptionData}
                />
            )}
            {feedData.boughtStreams && feedData.boughtStreams.length > 0 && (
                <CardStripe title={t('subscriptions')} watchAll="/subscriptions" cardData={boughtStreamsData} />
            )}
            {feedData.favoriteTagItems && feedData.favoriteTagItems.length > 0 && (
                <CardStripe title={t('followedTags')} watchAll="/followed-tags" cardData={followedTagsData} />
            )}
            {feedData.recentStreams && feedData.recentStreams.length > 0 && (
                <PageStripe title={t('recent')} watchAll="/recent-streams">
                    <RecentStreams streams={feedData.recentStreams} />
                </PageStripe>
            )}
        </div>
    ) : (
        <CardGridSkeleton count={20} />
    )
}

All.defaultProps = {}
All.propTypes = {}

export default memo(All)
