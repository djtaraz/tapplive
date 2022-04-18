import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import EmptyStateImage from 'assets/svg/illustrations/bag.svg'
import { getOrders } from 'requests/stream-requests'
import { useProfile } from '../ProfileContext'
import FeedList from 'pages/Feed/FeedList'

const ProfileSubscriptions = () => {
    const { userId, isMe } = useProfile()
    const { t } = useTranslation()

    const EmptyState = useCallback(
        () => (
            <div className="text-center py-90p">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div className="text-s mt-3">
                    {isMe ? t('profilePage.ordersEmptyMsg.me') : t('profilePage.ordersEmptyMsg.other')}
                </div>
            </div>
        ),
        [isMe, t],
    )

    return (
        <FeedList
            fetchFn={getOrders}
            extraFnProp={{
                userId,
                sort: '-createDate',
                ignoreBlockedTags: true,
            }}
            containerClassName="mt-11"
            queryKey={`profile-orders-${userId}`}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            isStreamOrder={true}
            forceGridTemplate="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            EmptyComponent={<EmptyState />}
            skeletonCount={3}
        />
    )
}

export default memo(ProfileSubscriptions)
