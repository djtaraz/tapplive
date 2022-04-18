import React, { memo, useMemo, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'

import Leaders from '../Leaders'
import { idProp, imageProp, priceProp, statusProp } from 'common/propTypes'
import CardSkeleton from 'components/Skeleton/CardSkeleton'
import { array } from 'utils/arrayUtils'
import StreamOrderCard from 'components/Card/StreamOrderCard'
import { useSelector } from 'react-redux'
import { screens } from 'common/screenResolutions'

const minCardWidth = 296
const useTopOrdersCount = () => {
    const { screen, isAuthenticated } = useSelector((state) => state.root)
    const memoCount = useMemo(() => {
        if (screen >= screens['2xl']) {
            /* ...value - 1... = space for <Leaders /> component */
            const value = Math.floor(document.body.clientWidth / minCardWidth) - 1
            /* ...value - 1... = space for auth sidebar */
            return isAuthenticated ? value - 1 : value
        } else if (screen === screens.xl) {
            return isAuthenticated ? 3 : 4
        } else if (screen === screens.lg) {
            return isAuthenticated ? 2 : 3
        } else if (screen === screens.md) {
            return 2
        } else {
            return 1
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [screen, isAuthenticated])
    const [count, setCount] = useState(memoCount)

    useEffect(() => {
        setCount(memoCount)
    }, [memoCount])

    return [count, setCount]
}

function LeadersAndTopOrders({ topStreamOrders }) {
    const { screen } = useSelector((state) => state.root)
    const [count, setCount] = useTopOrdersCount()
    const containerRef = useRef()
    const LoadingSkeleton = useMemo(() => array(count).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />), [count])
    const { t } = useTranslation()

    useEffect(() => {
        const node = containerRef.current

        function onResize() {
            const { width } = containerRef.current.getBoundingClientRect()

            if (screen >= screens['2xl']) {
                // ...-1... - space for <Leaders /> component
                setCount(Math.floor(width / minCardWidth) - 1)
            }
        }

        onResize()
        const ro = new ResizeObserver(() => {
            containerRef.current !== null && onResize()
        })
        ro.observe(node)

        window.addEventListener('resize', onResize)
        return () => {
            ro.unobserve(node)

            window.removeEventListener('resize', onResize)
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [screen])

    const data = useMemo(() => {
        if (!topStreamOrders || count === 0) {
            return null
        } else {
            return count < topStreamOrders.length ? topStreamOrders.slice(0, count) : topStreamOrders
        }
    }, [count, topStreamOrders])

    return (
        <div>
            <div
                ref={containerRef}
                style={{
                    /* +1 - for the <Leaders /> component grid cell */
                    gridTemplateColumns: count
                        ? Array(count + 1)
                              .fill(1)
                              .map(() => 'minmax(0, 1fr)')
                              .join(' ')
                        : null,
                    gridTemplateRows: 'auto auto',
                }}
                className="grid gap-5 grid-flow-col">
                <div className="contents">
                    <div className="text-ml font-bold">{t('leaders')}</div>
                    <div className="col-start-2 col-end-last flex justify-between items-center">
                        <div className="text-ml font-bold">{t('topRequests')}</div>
                        <Link to="/top-orders" className="text-s font-semibold text-violet-saturated">
                            {t('seeAll')} >
                        </Link>
                    </div>
                </div>
                <div className="col-span-1">
                    <Leaders />
                </div>
                {data ? data.map((order) => <StreamOrderCard order={order} key={order._id} />) : LoadingSkeleton}
            </div>
        </div>
    )
}

LeadersAndTopOrders.defaultTypes = {}
LeadersAndTopOrders.propTypes = {
    topStreamOrders: PropTypes.arrayOf(
        PropTypes.exact({
            _id: idProp,
            name: PropTypes.string.isRequired,
            cover: imageProp.isRequired,
            price: priceProp.isRequired,
            user: PropTypes.exact({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                photo: imageProp.isRequired,
            }),
            tags: PropTypes.arrayOf(
                PropTypes.exact({
                    _id: idProp,
                    name: PropTypes.string.isRequired,
                }),
            ),
            status: statusProp,
            startDate: PropTypes.string.isRequired,
            isPrivate: PropTypes.bool.isRequired,
            confirmedPerformers: PropTypes.arrayOf(PropTypes.shape({ _id: idProp })),
        }),
    ),
}

export default memo(LeadersAndTopOrders)
