import React, { memo, useState } from 'react'

import { getSubscriptions } from 'requests/stream-requests'
import FeedList from 'pages/Feed/FeedList'
import EmptyState from 'pages/Subscriptions/EmptySubscriptionsState'
import { useProfile } from '../ProfileContext'
import StreamCard from 'components/Card/StreamCard'
import OpenSelectedStreams from '../modals/OpenSelectedStreams'

const ProfileSubscriptions = () => {
    const { userId } = useProfile()
    const [selected, setSelected] = useState([])
    const handleCheckboxClick = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }
    const handleCancel = () => {
        setSelected([])
    }
    return (
        <>
            <FeedList
                fetchFn={getSubscriptions}
                containerClassName="mt-11"
                queryKey={`profile-subscriptions-${userId}`}
                errorMsg="Failed to fetch"
                useInfiniteScroll={true}
                forceGridTemplate="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                EmptyComponent={<EmptyState />}
                renderItem={({ item }) => (
                    <StreamCard
                        key={item._id}
                        stream={item}
                        selected={selected.includes(item._id)}
                        handleCheckboxClick={() => handleCheckboxClick(item._id)}
                    />
                )}
                skeletonCount={4}
            />
            <OpenSelectedStreams selected={selected} handleCancel={handleCancel} />
        </>
    )
}

export default memo(ProfileSubscriptions)
