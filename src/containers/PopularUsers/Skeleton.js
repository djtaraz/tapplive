import React from 'react'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import BarSkeleton from 'components/Skeleton/BarSkeleton'

function Skeleton() {
    return (
        <div className="flex rounded-3 border border-gray-light p-5">
            <CircleSkeleton radius={60} />
            <div className="flex flex-col ml-3.5 flex-1">
                <div>
                    <div className="my-1">
                        <BarSkeleton width="80%" height={20} />
                    </div>
                    <BarSkeleton width="50%" height={12} />
                </div>
                <div className="mt-auto">
                    <BarSkeleton height={32} width={138} />
                </div>
            </div>
        </div>
    )
}

export default Skeleton;