import { memo } from 'react'

import { getSubscriptions } from 'requests/stream-requests'
import EmptyState from 'pages/Subscriptions/EmptySubscriptionsState'
import FeedList from './FeedList'

function Subscriptions() {
    return (
        <FeedList
            fetchFn={getSubscriptions}
            queryKey={'feed-subscriptions'}
            errorMsg="Failed to fetch"
            EmptyComponent={<EmptyState className="mt-28" />}
        />
    )
}

Subscriptions.defaultProps = {}
Subscriptions.propTypes = {}

export default memo(Subscriptions)
