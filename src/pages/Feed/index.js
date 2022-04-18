import React, { useState, memo, useMemo, useEffect } from 'react'
import NavMenu from 'components/NavMenu'

import All from './All'
import { useTranslation } from 'react-i18next'
import Live from './Live'
import Announce from './Announce'
import Orders from './Orders'
import Subscriptions from './Subscriptions'

import { deleteLocationParam, getLocationParam, setLocationParam } from 'utils/browserUtils'

function Feed() {
    const { t } = useTranslation()

    const filters = useMemo(
        () => [
            { name: t('all'), value: 'all' },
            { name: 'Live', value: 'live' },
            { name: t('announces'), value: 'announce' },
            { name: t('orders'), value: 'requests' },
            { name: t('subscriptions'), value: 'subscriptions' },
        ],
        [t],
    )
    const [filter, setFilter] = useState(filters[0])

    useEffect(() => {
        let tab = getLocationParam('tab')
        if (tab) {
            let tabIndexFromParams = filters.findIndex((f) => f.value === tab)
            setFilter(filters[tabIndexFromParams])
        } else {
            setLocationParam(`tab`, filters[0].value)
        }
    }, [filters])

    const handleFilterChange = (newFilter) => {
        setLocationParam(`tab`, newFilter.value)
        setFilter(newFilter)

        if (getLocationParam('limit')) {
            deleteLocationParam('limit')
        }
    }

    return (
        <div className="py-10">
            <div className="mb-7.5">
                <NavMenu onChange={(newFilter) => handleFilterChange(newFilter)} active={filter} items={filters} />
            </div>
            {filter.value === 'all' && <All />}
            {filter.value === 'live' && <Live />}
            {filter.value === 'announce' && <Announce />}
            {filter.value === 'requests' && <Orders />}
            {filter.value === 'subscriptions' && <Subscriptions />}
        </div>
    )
}

export default memo(Feed)
