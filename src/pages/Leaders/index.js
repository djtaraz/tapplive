import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'

import Heading from 'components/Heading'
import { get } from 'requests/axiosConfig'
import fields from './fields'

import { array } from 'utils/arrayUtils'
import SliderFilter from 'components/SliderFilter'
import Skeleton from './Skeleton'
import Dropdown from 'components/Dropdown'
import Card from './Card'
import { useTranslation } from 'react-i18next'
import { omit } from 'utils/omit'
import { useSelector } from 'react-redux'
import { ReactComponent as EmptyState } from 'assets/svg/illustrations/search-empty-state.svg'

const fetchData = async ({ filter = 'all', period = 'all' }) => {
    return get(`/leaders?_fields=${fields}&filter=${filter}&period=${period}`)
}
const transformLeaders = (leaders) =>
    leaders.map(({ user, totalSpentAndEarned }) => {
        return { ...user, totalSpentAndEarned }
    })

function Leaders() {
    const { me } = useSelector((state) => state.root)
    const [leaders, setLeaders] = useState()
    const [filter, setFilter] = useState('all')
    const { t } = useTranslation()
    const [activePeriod, setActivePeriod] = useState({ name: t('periods.all'), value: 'all' })

    const meMemo = useMemo(() => {
        if (leaders && me) {
            const myLeaderData = leaders.find(({ _id }) => _id === me._id)
            if (myLeaderData) {
                return {
                    ...omit(myLeaderData, ['_id']),
                    id: myLeaderData._id,
                    position: leaders.indexOf(myLeaderData) + 1,
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }, [leaders, me])

    const filterItems = useMemo(
        () => [
            {
                name: t('expenses.all'),
                value: 'all',
            },
            {
                name: t('expenses.earned'),
                value: 'earned',
            },
            {
                name: t('expenses.spent'),
                value: 'spent',
            },
        ],
        [t],
    )
    const periodFilterItems = useMemo(
        () => [
            { name: t('periods.all'), value: 'all' },
            { name: t('periods.day'), value: 'day' },
            { name: t('periods.month'), value: 'month' },
            { name: t('periods.year'), value: 'year' },
        ],
        [t],
    )

    const period = useMemo(() => activePeriod, [activePeriod])
    const SkeletonLoading = useMemo(() => array(10).map((_, i) => <Skeleton key={`loading-skeleton-${i}`} />), [])

    useEffect(() => {
        setLeaders(null)
        fetchData({ filter, period: activePeriod.value }).then(({ data }) => {
            setLeaders(transformLeaders(data.result.items))
        })
    }, [filter, activePeriod.value])

    const handleFilterChange = useCallback((value) => {
        setFilter(value)
    }, [])

    const handlePeriodChange = useCallback(
        (newPeriod) => {
            if (newPeriod.value !== activePeriod.value) {
                setActivePeriod(newPeriod)
            }
        },
        [activePeriod.value],
    )

    const Empty = useMemo(
        () => (
            <div className="w-full flex flex-col items-center justify-center mt-32">
                <EmptyState />
                <p className="mt-4 text-s">{t('notFoundMsg')}</p>
            </div>
        ),
        [t],
    )

    return (
        <div className="py-10 h-full">
            <div className="mb-6">
                <Heading title={t('leaders')} />
            </div>
            <div className="mb-8 flex items-center justify-between">
                <SliderFilter active={filter} onClick={handleFilterChange} items={filterItems} />
                <Dropdown active={period} onClick={handlePeriodChange} items={periodFilterItems} />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
                {meMemo && <Card {...meMemo} isMe={true} />}
                {leaders &&
                    leaders.map((leader, i) => <Card key={leader._id} id={leader._id} {...leader} position={i + 1} />)}
                {!leaders && SkeletonLoading}
                {leaders?.length === 0 && Empty}
            </div>
        </div>
    )
}

export default memo(Leaders)
