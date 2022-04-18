import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import fields from './fields'
import Empty from 'components/Empty'
import FeedList from 'pages/Feed/FeedList'
import { getFollowedChannels } from 'requests/stream-requests'

function FollowedChannels() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('followedChannels')}
            fetchFn={getFollowedChannels}
            queryKey={'followed-channels'}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            isFeedItem={true}
            EmptyComponent={<Empty />}
            extraFnProp={{ fields }}
        />
    )
}

FollowedChannels.defaultProps = {}
FollowedChannels.propTypes = {}

export default memo(FollowedChannels)
