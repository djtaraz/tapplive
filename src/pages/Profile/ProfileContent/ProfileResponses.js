import React, { memo, useCallback } from 'react'

import EmptyStateImage from 'assets/svg/illustrations/bag.svg'
import { useTranslation } from 'react-i18next'
import { getStreams } from 'requests/stream-requests'
import { useProfile } from '../ProfileContext'
import FeedList from 'pages/Feed/FeedList'

const ProfileSubscriptions = () => {
    const { userId } = useProfile()
    const { t } = useTranslation()

    const EmptyState = useCallback(
        () => (
            <div className="text-center py-90p">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div className="text-s mt-3">{t('profilePage.responsesEmptyMsg')}</div>
            </div>
        ),
        [t],
    )

    return (
        <FeedList
            fetchFn={getStreams}
            extraFnProp={{
                streamerId: userId,
                statuses: ['pending'],
                sort: '-createDate',
                ignoreBlockedTags: true,
            }}
            containerClassName="mt-11"
            queryKey={`profile-responses-${userId}`}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            forceGridTemplate="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            EmptyComponent={<EmptyState />}
            enabled={userId !== undefined}
            skeletonCount={3}
        />
    )
}

export default memo(ProfileSubscriptions)
