import React, { memo, useContext } from 'react'

import ReceivedOrders from './ReceivedOrders'
import AcceptedOrders from './AcceptedOrders'
import { StreamOrderDetailsContext } from '../index'

const OrderContent = () => {
    const {
        amIAuthor,
        isClosed,
        activeMenuItem,
        streamOrderId,
    } = useContext(StreamOrderDetailsContext)

    return (amIAuthor && !isClosed) ? (
        <>
            {
                activeMenuItem?.value === 'received' && <ReceivedOrders streamOrderId={streamOrderId} />
            }
            {
                activeMenuItem?.value === 'accepted' && <AcceptedOrders streamOrderId={streamOrderId} />
            }
        </>
    ) : (
        <AcceptedOrders streamOrderId={streamOrderId} />
    )
}

export default memo(OrderContent)