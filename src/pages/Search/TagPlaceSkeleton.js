import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import { array } from 'utils/arrayUtils'

const TagPlaceSkeleton = ({ count }) => {
    return (
        <div className="grid grid-cols-1 gap-5">
            {array(count).map((_, i) => (
                <div key={`skeleton-${i}-key`} className="bg-gray-pale p-3.5 items-center rounded-2.5 flex">
                    <div className="mr-3.5">
                        <CircleSkeleton bg="bg-gray-light" radius={14} />
                    </div>
                    <div className="flex-1">
                        <BarSkeleton width={138} height={10} />
                    </div>
                    <div>
                        <BarSkeleton width={138} height={10} />
                    </div>
                </div>
            ))}
        </div>
    )
}

TagPlaceSkeleton.defaultProps = {
    count: 1,
}
TagPlaceSkeleton.propTypes = {
    count: PropTypes.number,
}

export default memo(TagPlaceSkeleton)
