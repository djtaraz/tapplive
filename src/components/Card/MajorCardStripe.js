import React, { useMemo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { array } from 'utils/arrayUtils'
import { orderProp, streamProp } from 'common/propTypes'
import PageStripe from '../Layout/PageStripe'
import StreamMajorCard from './StreamMajorCard'
import MajorCardSkeleton from '../Skeleton/MajorCardSkeleton'
import { screens } from 'common/screenResolutions'
import { useSelector } from 'react-redux'

const minCardWidth = 296

function useMajorCardCount() {
    const { screen, isAuthenticated } = useSelector((state) => state.root)
    const memoCount = useMemo(() => {
        if (screen >= screens['2xl']) {
            /* ...-1... - wide card occupies twice as much space as default card, thus we reduce by 1 */
            const value = Math.floor(document.body.clientWidth / minCardWidth) - 1
            /* ...-1... - space for auth sidebar */
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
    }, [isAuthenticated, screen])
    const [count, setCount] = useState(memoCount)

    useEffect(() => {
        setCount(memoCount)
    }, [memoCount])

    return [count, setCount]
}

function MajorCardStripe({ title, watchAll, cardData }) {
    const [count, setCount] = useMajorCardCount()
    const { screen } = useSelector((state) => state.root)
    const containerRef = useRef()

    useEffect(() => {
        const node = containerRef.current

        function onResize() {
            const { width } = containerRef.current.getBoundingClientRect()

            if (screen >= screens['2xl']) {
                /* ...-1... - wide card occupies twice as much space as default card, thus we reduce by 1 */
                setCount(Math.floor(width / minCardWidth) - 1)
            }
        }

        onResize()
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

    const RestCardsSkeleton = useMemo(() => {
        return array(count).map((_, i) =>
            i === 0 ? (
                <div key={`card-skeleton-${i}`} className="col-span-2">
                    <MajorCardSkeleton wide={true} key={`skeleton-${i}`} />
                </div>
            ) : (
                <MajorCardSkeleton key={`card-skeleton-${i}`} />
            ),
        )
    }, [count])

    const data = useMemo(() => {
        if (!cardData || count === 0) {
            return null
        } else {
            return count < cardData.length ? cardData.slice(0, count) : cardData
        }
    }, [count, cardData])

    return (
        <PageStripe title={title} watchAll={watchAll}>
            <div
                ref={containerRef}
                style={{
                    /*
                        ...concat('1fr')... - since we reduce 1 from count we add
                        1 fraction to grid to compensate space
                    */
                    gridTemplateColumns: Array(count)
                        .fill(1)
                        .map(() => 'minmax(0,1fr)')
                        .concat('1fr')
                        .join(' '),
                }}
                className="grid gap-5 grid-flow-col">
                {data
                    ? data.map((stream, i) =>
                          i === 0 ? (
                              <div key={stream._id} className="col-span-2">
                                  <StreamMajorCard stream={stream} type={stream.type} wide={true} />
                              </div>
                          ) : (
                              <StreamMajorCard type={stream.type} key={stream._id} stream={stream} />
                          ),
                      )
                    : RestCardsSkeleton}
            </div>
        </PageStripe>
    )
}

MajorCardStripe.propTypes = {
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

export default MajorCardStripe
