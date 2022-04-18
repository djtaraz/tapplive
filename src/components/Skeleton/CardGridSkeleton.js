import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { array } from 'utils/arrayUtils'
import CardSkeleton from './CardSkeleton'
import BarSkeleton from './BarSkeleton'
import { useSelector } from 'react-redux'

function CardGridSkeleton({ count, showTitle }) {
    const { isAuthenticated } = useSelector((state) => state.root)
    const gridTemplate = `grid-cols-2 md:grid-cols-3 ${
        isAuthenticated ? 'xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'
    } 2xl:grid-cols-296`

    return (
        <div>
            {showTitle && (
                <div className="mb-5">
                    <BarSkeleton bg='bg-gray-pale' height={28} />
                </div>
            )}
            <div style={{ gridTemplateRows: 'repeat(4, auto)' }} className={`grid ${gridTemplate} gap-x-5 gap-y-8.5`}>
                {array(count).map((_, i) => (
                    <CardSkeleton key={`card-skeleton-${i}`} />
                ))}
            </div>
        </div>
    )
}

CardGridSkeleton.defaultProps = {
    count: 10,
    showTitle: true,
}
CardGridSkeleton.propTypes = {
    count: PropTypes.number,
    showTitle: PropTypes.bool,
}

export default memo(CardGridSkeleton)
