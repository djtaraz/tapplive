import React, { memo, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import StreamCard from 'components/Card/StreamCard'
import EmptyImg from 'assets/svg/illustrations/search-empty-state.svg'
import { useIntersect } from 'hooks/useIntersect'
import { array } from 'utils/arrayUtils'
import CardSkeleton from 'components/Skeleton/CardSkeleton'
import { getReceivedOrders } from 'requests/streamOrder-requests'

const limit = 20
const ReceivedOrders = ({ streamOrderId }) => {
    const [orders, setOrders] = useState()
    const { t } = useTranslation()
    const [more, setMore] = useState(false)
    const { setNode } = useIntersect(() => setMore(true))
    const [itemsToSkip, setToSkip] = useState(20)

    useEffect(() => {
        getReceivedOrders({
            streamOrderId,
            limit,
        }).then((result) => {
            setOrders(result)
        })
    }, [streamOrderId])

    useEffect(() => {
        if (more) {
            getReceivedOrders({
                limit,
                skip: itemsToSkip,
                streamOrderId,
            }).then((result) => {
                setMore(false)
                setToSkip(itemsToSkip + limit)
                setOrders((prev) => ({
                    items: [...prev.items, ...result.items],
                    totalCount: result.totalCount,
                }))
            })
        }
    }, [more, itemsToSkip, streamOrderId])

    const LoadDetector = useMemo(() => {
        if (orders?.items && orders.items.length > 0 && orders.items.length < orders.totalCount) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [orders])

    const EmptyState = useMemo(
        () => (
            <div style={{ marginTop: '110px' }} className="inline-block">
                <img className="mx-auto" src={EmptyImg} alt="" />
                <div className="text-s mt-3">{t('streamOrderDetails.noAnswersYetMsg')}</div>
            </div>
        ),
        [t],
    )

    return (
        <div>
            <div className="grid gap-x-5 gap-y-8.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-264">
                {orders && orders.items.map((order) => <StreamCard stream={order} key={order._id} />)}
                {(!orders || more) && array(3).map((_, i) => <CardSkeleton key={`loading-card-more-${i}`} />)}
            </div>
            {LoadDetector}
            {orders?.items?.length === 0 && <div className="flex justify-center">{EmptyState}</div>}
        </div>
    )
}

ReceivedOrders.propTypes = {
    streamOrderId: PropTypes.string.isRequired,
}

export default memo(ReceivedOrders)
