import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { array } from 'utils/arrayUtils'
import CardSkeleton from './CardSkeleton'
import {useSelector} from "react-redux";

function CardRowSkeleton({
    count,
}) {
    const { isAuthenticated } = useSelector(state => state.root)
    const gridTemplate = `grid-cols-2 md:grid-cols-3 ${isAuthenticated ? 'xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'} 2xl:grid-cols-296`

    return (
        <div className={`grid gap-x-5 ${gridTemplate} w-full`}>
            {array(count).map((_, i) => (
                <CardSkeleton key={`skeleton-card-${i}`} />
            ))}
        </div>
    )
}

CardRowSkeleton.defaultProps = {
    count: 10,
}
CardRowSkeleton.propTypes = {
    count: PropTypes.number,
}

export default memo(CardRowSkeleton)
