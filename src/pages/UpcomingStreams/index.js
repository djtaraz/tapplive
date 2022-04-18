import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import FeedList from 'pages/Feed/FeedList'
import { getUpcomingStreams } from 'requests/stream-requests'

function UpcomingStreams() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('upcoming')}
            fetchFn={getUpcomingStreams}
            queryKey={'upcoming-streams'}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            disableCache={true}
        />
    )
}

export default memo(UpcomingStreams)
