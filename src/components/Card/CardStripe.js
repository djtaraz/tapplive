import React, { useMemo, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { array } from 'utils/arrayUtils'
import CardSkeleton from '../Skeleton/CardSkeleton'
import { orderProp, streamProp } from 'common/propTypes'
import PageStripe from '../Layout/PageStripe'
import StreamCard from './StreamCard'
import StreamOrderCard from './StreamOrderCard'
import { useSelector } from 'react-redux'
import { screens } from 'common/screenResolutions'

const minCardWidth = 296
const useCardCount = () => {
    const { screen, isAuthenticated } = useSelector((state) => state.root)

    const memoCount = useMemo(() => {
        if (screen >= screens['2xl']) {
            const value = Math.floor(document.body.clientWidth / minCardWidth)
            return isAuthenticated ? value - 1 : value
        } else if (screen === screens.xl) {
            return isAuthenticated ? 4 : 5
        } else if (screen === screens.lg) {
            return isAuthenticated ? 3 : 4
        } else if (screen === screens.md) {
            return 3
        } else {
            return 2
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [screen, isAuthenticated])
    const [count, setCount] = useState(memoCount)

    useEffect(() => {
        setCount(memoCount)
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [memoCount])

    return [count, setCount]
}
const CardContainer = ({ children }) => {
    const containerRef = useRef()
    const [count, setCount] = useCardCount()
    const { screen } = useSelector((state) => state.root)

    useEffect(() => {
        const node = containerRef.current

        function onResize() {
            const { width } = containerRef.current.getBoundingClientRect()

            if (screen >= screens['2xl']) {
                setCount(Math.floor(width / minCardWidth))
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

    return (
        <div
            style={{
                gridTemplateColumns: Array(count)
                    .fill(1)
                    .map(() => 'minmax(0,1fr)')
                    .join(' '),
            }}
            className="grid gap-5 grid-flow-col"
            ref={containerRef}>
            {count < children.length ? children.slice(0, count) : children}
        </div>
    )
}

function CardStripe({ title, watchAll, cardData }) {
    const LoadingSkeleton = useMemo(() => array(20).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />), [])

    return cardData ? (
        cardData.length > 0 ? (
            <PageStripe title={title} watchAll={watchAll}>
                <CardContainer>
                    {cardData.map((data) =>
                        data.type === 'stream' ? (
                            <StreamCard stream={data} key={data._id} />
                        ) : (
                            <StreamOrderCard order={data} key={data._id} />
                        ),
                    )}
                </CardContainer>
            </PageStripe>
        ) : null
    ) : (
        <CardContainer>{LoadingSkeleton}</CardContainer>
    )
}

CardStripe.propTypes = {
    title: PropTypes.string.isRequired,
    cardData: PropTypes.arrayOf(
        PropTypes.oneOfType(
            PropTypes.shape({
                ...streamProp,
                type: 'stream',
            }),
            PropTypes.shape({ ...orderProp, type: 'streamOrder' }),
        ),
    ),
    watchAll: PropTypes.string,
}

export default CardStripe
