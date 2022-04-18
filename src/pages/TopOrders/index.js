import { memo } from 'react'

import fields from './fields'
import { useTranslation } from 'react-i18next'
import FeedList from 'pages/Feed/FeedList'
import { getOrders } from 'requests/stream-requests'

function TopOrders() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('topRequests')}
            fetchFn={getOrders}
            queryKey={'top-orders'}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            extraFnProp={{ fields }}
            isStreamOrder={true}
        />
    )
}

export default memo(TopOrders)
