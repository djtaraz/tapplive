import React, { useEffect, useState, memo, useCallback } from 'react'
import { get } from 'requests/axiosConfig'

import { placeFields } from './fields'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import Empty from 'components/Empty'
import { ReactComponent as PlaceIcon } from 'assets/interface-icons/place-icon.svg'
import { getFeed } from 'requests/feed-request'
import FeedList from 'pages/Feed/FeedList'
import { useLocation } from 'wouter'
import { routes } from 'routes'

function PlaceDetails({ params }) {
    const [place, setPlace] = useState()
    const [, setLocation] = useLocation()

    const fetchPlaceData = useCallback(async () => {
        const { data } = await get(`/places/${params.id}?_fields=${placeFields}`).catch(() => {
            setLocation(routes.feed.path)
        })
        setPlace(data.result)
    }, [params.id, setLocation])
    useEffect(() => {
        params && params.id && fetchPlaceData()
    }, [fetchPlaceData, params])

    return (
        <div className="grid gap-7.5 py-10">
            <div className="flex justify-center items-center">
                <PlaceIcon className="mr-1.5" />
                {place && <span className="font-bold text-m">{place?.location?.name}</span>}
                {!place && <BarSkeleton width={120} height={20} />}
            </div>
            <FeedList
                fetchFn={getFeed}
                queryKey={`place-details-${params.id}`}
                errorMsg="Failed to fetch"
                isFeedItem={true}
                extraFnProp={{ placeId: params.id }}
                EmptyComponent={<Empty />}
                enabled={!!place}
            />
        </div>
    )
}

export default memo(PlaceDetails)
