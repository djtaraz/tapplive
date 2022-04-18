import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { getSubscriptions } from 'requests/stream-requests'
import FeedList from 'pages/Feed/FeedList'
import EmptyState from 'pages/Subscriptions/EmptySubscriptionsState'

function Subscriptions() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('subscriptions')}
            fetchFn={getSubscriptions}
            queryKey={'feed-subscriptions'}
            errorMsg="Failed to fetch"
            EmptyComponent={<EmptyState className="mt-28" />}
            useInfiniteScroll={true}
        />
    )
}

Subscriptions.defaultProps = {}
Subscriptions.propTypes = {}

export default memo(Subscriptions)
