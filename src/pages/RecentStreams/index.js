import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import FeedList from 'pages/Feed/FeedList'
import { getStreams } from 'requests/stream-requests'

function RecentStreams() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('recent')}
            fetchFn={getStreams}
            queryKey={'recent-streams'}
            errorMsg="Failed to fetch"
            extraFnProp={{
                statuses: ['closed'],
            }}
        />
    )
}

export default memo(RecentStreams)
