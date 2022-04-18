import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import EmptyStateImage from 'assets/svg/illustrations/bag.svg'
import { getStreams } from 'requests/stream-requests'
import { useProfile } from '../ProfileContext'
import FeedList from 'pages/Feed/FeedList'

const ProfileStreams = () => {
    const { userId, isMe } = useProfile()
    const { t } = useTranslation()

    const EmptyState = useCallback(
        () => (
            <div className="text-center py-90p">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div className="mt-3 text-s">
                    {isMe ? (
                        <>
                            <div>{t('empty')}</div>
                            <div>{t('planABroadcast')}</div>
                        </>
                    ) : (
                        t('profilePage.streamsEmptyMsgOther')
                    )}
                </div>
            </div>
        ),
        [isMe, t],
    )

    return (
        <FeedList
            fetchFn={getStreams}
            extraFnProp={{
                streamerId: userId,
                sort: 'statusSortOrder,-endDate,startDate',
                ignoreBlockedTags: true,
                statuses: ['live', 'suspended', 'closed', 'announcement', 'archived'],
            }}
            containerClassName="mt-11"
            errorMsg="Failed to fetch"
            queryKey={`profile-streams-${userId}`}
            useInfiniteScroll={true}
            forceGridTemplate="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            EmptyComponent={<EmptyState />}
            skeletonCount={3}
        />
    )
}

export default memo(ProfileStreams)
