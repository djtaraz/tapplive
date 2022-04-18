import React, { forwardRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { isExpired, dateFromString } from 'utils/dateUtils'
import EndedStatus from '../Status/EndedStatus'
import Status from '../Status'
import PrivateLabel from './PrivateLabel'
import ClosedStatus from '../Status/ClosedStatus'
import CardPrice from './CardPrice'
import Avatar from '../Avatar'
import TagList from '../TagList'
import { orderProp } from 'common/propTypes'
import { useTranslation } from 'react-i18next'
import { getRandomPlaceholder } from './getPlaceholder'
import AuthLink from 'components/AuthLink'

const StreamOrderCard = forwardRef(({ order, onClick }, ref) => {
    const { t } = useTranslation()
    const confirmedPerformers = useMemo(() => order.confirmedPerformers?.length, [order])
    const [forcePlaceholder, setForcePlaceholder] = useState(false)
    const placeholder = getRandomPlaceholder(order._id)
    return (
        <div
            onClick={onClick}
            ref={(el) => {
                if (ref?.current) {
                    ref.current[order._id] = el
                }
            }}
            className="flex flex-col">
            <div className="relative bg-gray-pale rounded-2 overflow-hidden">
                <div className="pb-2/3"></div>
                <AuthLink href={`/stream-orders/${order._id}`}>
                    <a className="absolute inset-0 inline-block w-full h-full">
                        {!forcePlaceholder && order.cover?.url ? (
                            <img
                                className="absolute-center h-full w-full object-cover"
                                src={order.cover.url}
                                alt=""
                                onError={(event) => {
                                    setForcePlaceholder(true)
                                }}
                            />
                        ) : (
                            <div
                                style={{ background: `${placeholder.color}` }}
                                className="absolute inset-0 flex items-center justify-center rounded-2.5">
                                <img src={placeholder.img} alt="" className="w-1/2" />
                            </div>
                        )}
                    </a>
                </AuthLink>
                <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
                    <div className="flex justify-between">
                        {isExpired(dateFromString(order.startDate)) ? (
                            <EndedStatus />
                        ) : (
                            <Status status={order.status} startDate={dateFromString(order.startDate)} />
                        )}
                        {order.isPrivate && <PrivateLabel />}
                    </div>
                    <div className="flex items-end w-full">
                        <div className="ml-auto">
                            {order.status === 'closed' ? (
                                <ClosedStatus />
                            ) : (
                                <CardPrice price={order.price} type="streamOrder" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex mt-4">
                <Avatar photoUrl={order.user?.photo?.url} crop="40x40" to={`/user/${order.user._id}`} />
                <div className="max-w-3/4 flex-1 ml-2.5">
                    <AuthLink href={`/stream-orders/${order._id}`} className="block truncate text-base font-bold">
                        {order.name}
                    </AuthLink>
                    <AuthLink
                        className="block truncate text-s text-violet-saturated mt-1"
                        href={`/user/${order.user._id}`}>
                        {order.user.name || 'Unknown'}
                    </AuthLink>
                    <div className="text-black-theme">
                        <TagList tags={order.tags} />
                    </div>
                    <div className="truncate pr-4 mt-2">
                        {confirmedPerformers ? (
                            <div className="text-xs">{t('performer', { count: confirmedPerformers })}</div>
                        ) : (
                            <div className="text-xs">{t('noPerformers')}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

StreamOrderCard.defaultProps = {
    order: {
        isPrivate: false,
        confirmedPerformers: null,
        subscriberCount: null,
    },
}
StreamOrderCard.propTypes = {
    order: PropTypes.shape(orderProp),
    onClick: PropTypes.func,
}

export default StreamOrderCard
