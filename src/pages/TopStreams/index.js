import React, { memo } from 'react'

import { useTranslation } from 'react-i18next'

import FeedList from 'pages/Feed/FeedList'
import { getStreams } from 'requests/stream-requests'

function TopStreams() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('topStreams')}
            fetchFn={getStreams}
            queryKey={'top-streams'}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
        />
    )
}

export default memo(TopStreams)
