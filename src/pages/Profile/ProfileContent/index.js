import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'

import ProfileSubscriptions from './ProfileSubscriptions'
import Button from 'components/Button'
import ProfileStreams from './ProfileStreams'
import ProfileOrders from './ProfileOrders'
import ProfileResponses from './ProfileResponses'
import ProfileProducts from './ProfileProducts'
import NavMenu from 'components/NavMenu'

import { deleteLocationParam, getLocationParam, setLocationParam } from 'utils/browserUtils'
import { useProfile } from '../ProfileContext'
import { routes } from 'routes'

const ProfileContent = () => {
    const { isMe } = useProfile()

    const { t } = useTranslation()
    const filters = useMemo(
        () =>
            [
                { name: `${t('subscriptions')}`, value: 'subscriptions', isHidden: !isMe },
                { name: `${t('streams')}`, value: 'streams' },
                { name: `${t('orders')}`, value: 'orders' },
                { name: `${t('responses')}`, value: 'responses', isHidden: !isMe },
                { name: `${t('products')}`, value: 'products' },
            ].filter(({ isHidden }) => !isHidden),
        [t, isMe],
    )
    const [filter, setFilter] = useState(filters[0])
    const [, setLocation] = useLocation()

    const [Content, Action] = useMemo(() => {
        if (filter) {
            if (filter.value === 'subscriptions') {
                return [<ProfileSubscriptions />]
            } else if (filter.value === 'streams') {
                return [
                    <ProfileStreams />,
                    <Button
                        text={t('createStream')}
                        type="primary"
                        onClick={() => setLocation(routes.createStream.path)}
                    />,
                ]
            } else if (filter.value === 'orders') {
                return [
                    <ProfileOrders />,
                    <Button
                        text={t('createOrder')}
                        type="primary"
                        onClick={() => setLocation(routes.createStreamOrder.path)}
                    />,
                ]
            } else if (filter.value === 'responses') {
                return [
                    <ProfileResponses />,
                    <Button
                        onClick={() => setLocation(routes.feed.path + '?tab=requests')}
                        text={t('findOrder')}
                        type="primary"
                    />,
                ]
            } else {
                return [
                    <ProfileProducts />,
                    <Button
                        onClick={() => setLocation(routes.createProduct.path)}
                        text={t('addProduct')}
                        type="primary"
                    />,
                ]
            }
        } else {
            return []
        }
    }, [filter, setLocation, t])

    useEffect(() => {
        let tab = getLocationParam('tab')
        if (tab) {
            let tabIndexFromParams = filters.findIndex((f) => f.value === tab)
            setFilter(filters[tabIndexFromParams])
        } else {
            setLocationParam(`tab`, filters[0].value)
            setFilter(filters[0])
        }
    }, [filters, isMe])

    const handleFilterChange = (newFilter) => {
        setLocationParam(`tab`, newFilter.value)
        setFilter(newFilter)

        if (getLocationParam('limit')) {
            deleteLocationParam('limit')
        }
    }

    return (
        <div>
            <div className="relative">
                <NavMenu
                    onChange={(newFilter) => {
                        handleFilterChange(newFilter)
                    }}
                    active={filter}
                    items={filters}
                />
                {isMe && <div className="absolute top-0 right-0">{Action}</div>}
            </div>

            {Content}
        </div>
    )
}

export default ProfileContent
