import React, { memo } from 'react'
import { array } from '../../utils/arrayUtils'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import BarSkeleton from 'components/Skeleton/BarSkeleton'

function Skeleton() {
    return (
        <div>
            <div className="bg-gray-pale rounded-3 pl-3 pr-5 py-3.5 lg:py-2.5 lg:pl-2.5 2xl:py-3.5 2xl:pl-3">
                <div className="bg-gray-light rounded-3 w-90 h-90 lg:h-80 lg:w-80 2xl:h-90 2xl:w-90"></div>
            </div>
            {array(3).map((_, i) => (
                <div key={`skeleton-item-${i}`} className="flex items-center py-2.5 pl-2.5 pr-5">
                    <CircleSkeleton radius={40} />
                    <div className="flex-1 ml-5">
                        <BarSkeleton width="80%" height={15} />
                    </div>
                    <BarSkeleton width="45px" />
                </div>
            ))}
        </div>
    )
}

export default memo(Skeleton)