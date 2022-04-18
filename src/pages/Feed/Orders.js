import { memo } from 'react'

import { ordersFields } from './fields'

import FeedList from './FeedList'
import { getOrders } from '../../requests/stream-requests'
import Empty from './EmptyState'
import { useTranslation } from 'react-i18next'

function Orders() {
    const { t } = useTranslation()

    return (
        <FeedList
            fetchFn={getOrders}
            extraFnProp={{ fields: ordersFields }}
            queryKey={'feed-orders'}
            errorMsg="Failed to fetch"
            isStreamOrder={true}
            EmptyComponent={<Empty text={t('thereIsNothing')} />}
        />
    )
}

Orders.defaultProps = {}
Orders.propTypes = {}

export default memo(Orders)
