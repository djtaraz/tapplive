import React, { memo } from 'react'
import PropTypes from 'prop-types'
import SkeletonWrapper from 'components/Skeleton/SkeletonWrapper'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import { array } from 'utils/arrayUtils'

const PeoplesGridSkeleton = ({ count }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {array(count).map((_, i) => (
                <SkeletonWrapper key={`skeleton-${i}-key`} bg="bg-gray-pale">
                    <div className="flex items-center">
                        <div className="mr-3.5">
                            <CircleSkeleton bg="bg-gray-light" radius={60} />
                        </div>
                        <div className="flex-1">
                            <div className="mb-2">
                                <BarSkeleton bg="bg-gray-light" width={'70%'} />
                            </div>
                            <BarSkeleton bg="bg-gray-light" width={'30%'} />
                        </div>
                        <div>
                            <BarSkeleton width={138} height={32} />
                        </div>
                    </div>
                </SkeletonWrapper>
            ))}
        </div>
    )
}

PeoplesGridSkeleton.defaultProps = {
    count: 1,
}
PeoplesGridSkeleton.propTypes = {
    count: PropTypes.number,
}

export default memo(PeoplesGridSkeleton)
