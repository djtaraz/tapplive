import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { get, deleteAuth, postAuth } from 'requests/axiosConfig'
import { getFeed } from 'requests/feed-request'

import Button from 'components/Button'
import FormatAmount from 'components/FormatAmount'
import Empty from 'components/Empty'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setMe } from 'slices/rootSlice'
import { tagFields } from './fields'
import FeedList from 'pages/Feed/FeedList'
import { routes } from 'routes'
import { useLocation } from 'wouter'

function TagDetails({ params }) {
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const { t } = useTranslation()
    const [tagData, setTagData] = useState()
    const [, setLocation] = useLocation()

    const fetchTagData = useCallback(async () => {
        const { data } = await get(`/tags/${params.id}?_fields=${tagFields}`).catch(() => {
            setLocation(routes.feed.path)
        })
        setTagData(data.result)
    }, [params.id, setLocation])
    useEffect(() => {
        params && params.id && fetchTagData()
    }, [fetchTagData, params])

    const isTagFollowed = useMemo(() => {
        return me?.favoriteTags.map((t) => t._id).includes(params.id)
    }, [me, params.id])

    const handleTagSubscribe = async () => {
        if (isTagFollowed) {
            await deleteAuth(`/tags/${params.id}`)
            dispatch(setMe({ ...me, favoriteTags: me.favoriteTags.filter((t) => t._id !== params.id) }))
        } else {
            await postAuth(`/tags/${params.id}`, null)
            dispatch(setMe({ ...me, favoriteTags: me.favoriteTags.concat({ name: tagData.name, _id: tagData._id }) }))
        }
    }
    return (
        <div className="grid gap-7.5 py-10">
            {tagData ? (
                <div className="flex justify-center">
                    <div
                        style={{ gridTemplateColumns: 'repeat(3, auto)' }}
                        className="w-auto grid grid-flow-col gap-3.5 items-center">
                        <div className="text-xxs py-1 px-2 bg-gray-pale rounded-5">
                            <FormatAmount amount={tagData.postCount} /> {t('publication', { count: tagData.postCount })}
                        </div>
                        <div className="text-lg2 font-semibold truncate">{tagData.name}</div>
                        <Button
                            onClick={handleTagSubscribe}
                            text={isTagFollowed ? t('unsubscribe') : t('subscribe')}
                            type={isTagFollowed ? 'secondary' : 'primary'}
                            isBig={false}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div
                        style={{ gridTemplateColumns: 'repeat(3, auto)' }}
                        className="w-auto grid grid-flow-col gap-3.5 items-center">
                        <BarSkeleton width={40} height={20} />
                        <BarSkeleton width="10vw" />
                        <BarSkeleton height={32} />
                    </div>
                </div>
            )}

            <FeedList
                fetchFn={getFeed}
                queryKey={`tag-details-${params.id}`}
                errorMsg="Failed to fetch"
                isFeedItem={true}
                extraFnProp={{ tagIds: [params.id] }}
                EmptyComponent={<Empty />}
                enabled={!!tagData}
            />
        </div>
    )
}

export default memo(TagDetails)
