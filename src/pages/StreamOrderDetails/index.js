import React, { createContext, memo, useEffect, useState, useMemo } from 'react'

import { getStreamOrderById } from 'requests/streamOrder-requests'
import { useSelector } from 'react-redux'
import OrderMenu from './components/OrderMenu'
import OrderDetails from './components/OrderDetails'
import { useTranslation } from 'react-i18next'
import OrderContentHeader from './components/OrderContentHeader'
import OrderContent from './components/OrderContent'
import Loader from 'components/Loader'
import { routes } from 'routes'
import { useLocation } from 'wouter'

export const StreamOrderDetailsContext = createContext({})

const StreamOrderDetails = ({ params }) => {
    const { me } = useSelector((state) => state.root)
    const [streamOrder, setStreamOrder] = useState()
    const [isClosed, setIsClosed] = useState()
    const { t } = useTranslation()
    const [activeMenuItem, setActiveMenuItem] = useState()
    const [, setLocation] = useLocation()

    useEffect(() => {
        getStreamOrderById({ id: params.id })
            .then((order) => {
                setStreamOrder(order)
                setIsClosed(order.status === 'closed')
            })
            .catch(() => {
                setLocation(routes.feed.path)
            })
    }, [params.id, setLocation])

    const menuItems = useMemo(
        () => [
            { name: t('streamOrderDetails.receivedAnswers'), value: 'received' },
            { name: t('streamOrderDetails.acceptedAnswers'), value: 'accepted' },
        ],
        [t],
    )

    if (!streamOrder) {
        return (
            <div className="h-full flex justify-center items-center">
                <Loader theme="violet" />
            </div>
        )
    }

    return (
        <StreamOrderDetailsContext.Provider
            value={{
                streamOrderId: params.id,
                streamOrder,
                amIAuthor: streamOrder?.user?._id === me?._id,
                isClosed,
                setIsClosed,
                menuItems,
                activeMenuItem,
                setActiveMenuItem,
            }}>
            <div className="h-full order-details-grid py-10">
                <div className="contents">
                    <div className="order-menu">
                        <OrderMenu />
                    </div>
                    <div className="order-details">
                        <OrderDetails />
                    </div>
                </div>
                {streamOrder && (
                    <div className="contents">
                        <div className="order-content-menu">
                            <OrderContentHeader />
                        </div>
                        <div className="order-content">
                            <OrderContent />
                        </div>
                    </div>
                )}
            </div>
        </StreamOrderDetailsContext.Provider>
    )
}

export default memo(StreamOrderDetails)
