import React, { memo } from 'react'

import BarSkeleton from 'components/Skeleton/BarSkeleton'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'

function Skeleton() {
    return (
        <div  className="flex items-center px-10 py-3 bg-gray-pale rounded-2.5">
            <BarSkeleton width={24} />
            <div className="mx-5">
                <CircleSkeleton radius={60} />
            </div>
            <div className="flex-1">
                <BarSkeleton width={138} />
            </div>
            <BarSkeleton width={88} />
        </div>
    )
}

Skeleton.defaultProps = {}
Skeleton.propTypes = {}

export default memo(Skeleton)